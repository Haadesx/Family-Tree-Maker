import { hierarchy, tree } from 'd3-hierarchy';
import { FamilyData, Person, TreeNode } from '../models/types';

interface LayoutNode {
  id: string;
  person: Person;
  spouses: Person[];
  parents: Person[];
  children: LayoutNode[];
  x?: number;
  y?: number;
}

export function buildFamilyTree(
  focusPersonId: string,
  data: FamilyData,
  ancestorDepth: number,
  descendantDepth: number
): TreeNode | null {
  if (!focusPersonId) return null;

  const personMap = new Map<string, Person>();
  data.people.forEach(p => personMap.set(p.id, p));

  // Build descendants tree
  function buildDescendants(
    personId: string,
    depth: number,
    visited: Set<string> = new Set()
  ): LayoutNode | null {
    if (depth < 0 || visited.has(personId)) return null;
    visited.add(personId);

    const person = personMap.get(personId);
    if (!person) return null;

    // Get spouses
    const spouses = data.spouseEdges
      .filter(e => e.aId === personId || e.bId === personId)
      .map(e => e.aId === personId ? e.bId : e.aId)
      .map(id => personMap.get(id))
      .filter((p): p is Person => p !== undefined);

    // Get children
    const childrenEdges = data.parentChildEdges.filter(e => e.parentId === personId);
    const children: LayoutNode[] = [];
    
    for (const edge of childrenEdges) {
      const child = buildDescendants(edge.childId, depth - 1, visited);
      if (child) children.push(child);
    }

    return {
      id: personId,
      person,
      spouses,
      parents: [],
      children,
    };
  }

  // Build ancestors tree
  function buildAncestors(
    personId: string,
    depth: number,
    visited: Set<string> = new Set()
  ): LayoutNode | null {
    if (depth < 0 || visited.has(personId)) return null;
    visited.add(personId);

    const person = personMap.get(personId);
    if (!person) return null;

    // Get spouses
    const spouses = data.spouseEdges
      .filter(e => e.aId === personId || e.bId === personId)
      .map(e => e.aId === personId ? e.bId : e.aId)
      .map(id => personMap.get(id))
      .filter((p): p is Person => p !== undefined);

    // Get parents
    const parentEdges = data.parentChildEdges.filter(e => e.childId === personId);
    const parents: LayoutNode[] = [];
    
    for (const edge of parentEdges) {
      const parent = buildAncestors(edge.parentId, depth - 1, visited);
      if (parent) parents.push(parent);
    }

    return {
      id: personId,
      person,
      spouses,
      parents: [],
      children: parents, // In ancestors tree, children field stores parents for layout
    };
  }

  // Build the tree structure
  const focusPerson = personMap.get(focusPersonId);
  if (!focusPerson) return null;

  // Get focus person's spouses
  const focusSpouses = data.spouseEdges
    .filter(e => e.aId === focusPersonId || e.bId === focusPersonId)
    .map(e => e.aId === focusPersonId ? e.bId : e.aId)
    .map(id => personMap.get(id))
    .filter((p): p is Person => p !== undefined);

  // Build descendants
  const descendants = buildDescendants(focusPersonId, descendantDepth, new Set());

  // Build ancestors
  const ancestors = buildAncestors(focusPersonId, ancestorDepth, new Set());

  // Combine into a single tree for layout
  // Root is the focus person
  const root: LayoutNode = {
    id: focusPersonId,
    person: focusPerson,
    spouses: focusSpouses,
    parents: [],
    children: descendants ? descendants.children : [],
  };

  // For ancestors, we need to attach them above the root
  // We'll create a synthetic root that has ancestors as children
  // and the actual focus person as a child of that
  if (ancestors && ancestors.children.length > 0) {
    // Create a combined structure
    const syntheticRoot: LayoutNode = {
      id: 'synthetic-root',
      person: { id: 'synthetic-root', firstName: 'Root', lastName: '' },
      spouses: [],
      parents: [],
      children: [...ancestors.children, root],
    };
    return convertToTreeNode(syntheticRoot);
  }

  return convertToTreeNode(root);
}

function convertToTreeNode(node: LayoutNode): TreeNode {
  return {
    id: node.id,
    person: node.person,
    spouses: node.spouses,
    parents: node.parents,
    children: node.children.map(convertToTreeNode),
    x: node.x,
    y: node.y,
  };
}

export function layoutTree(root: TreeNode, nodeWidth: number = 150, nodeHeight: number = 80): TreeNode {
  if (!root) return root;

  // Convert to d3 hierarchy
  const hierarchyData = hierarchy(root, (d: TreeNode) => d.children);

  // Use tree layout
  const treeLayout = tree<TreeNode>()
    .nodeSize([nodeHeight, nodeWidth]);

  const laidOut = treeLayout(hierarchyData);

  // Convert back to our TreeNode structure with coordinates
  function addCoords(node: typeof laidOut): TreeNode {
    const original = node.data;
    return {
      ...original,
      x: node.x,
      y: node.y,
      children: node.children ? node.children.map(addCoords) : [],
    };
  }

  return addCoords(laidOut);
}

export function getImmediateRelations(personId: string, data: FamilyData) {
  const parents = data.parentChildEdges
    .filter(e => e.childId === personId)
    .map(e => e.parentId);

  const children = data.parentChildEdges
    .filter(e => e.parentId === personId)
    .map(e => e.childId);

  const spouses = data.spouseEdges
    .filter(e => e.aId === personId || e.bId === personId)
    .map(e => e.aId === personId ? e.bId : e.aId);

  return { parents, children, spouses };
}
