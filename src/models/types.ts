export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  sex?: 'M' | 'F' | 'O';
  birthDate?: string;
  deathDate?: string;
  notes?: string;
  photoUrl?: string;
}

export interface ParentChildEdge {
  parentId: string;
  childId: string;
  type?: 'biological' | 'adopted' | 'unknown';
}

export interface SpouseEdge {
  aId: string;
  bId: string;
  startDate?: string;
  endDate?: string;
}

export interface FamilyData {
  people: Person[];
  parentChildEdges: ParentChildEdge[];
  spouseEdges: SpouseEdge[];
}

export interface AppState {
  data: FamilyData;
  selectedPersonId: string | null;
  focusPersonId: string | null;
  ancestorDepth: number;
  descendantDepth: number;
}

export interface TreeNode {
  id: string;
  person: Person;
  spouses: Person[];
  children: TreeNode[];
  parents: Person[];
  x?: number;
  y?: number;
}
