import { FamilyData, Person, ParentChildEdge, SpouseEdge } from './types';

export function generateId(): string {
  return crypto.randomUUID();
}

export function validatePerson(person: Person): string[] {
  const errors: string[] = [];
  
  if (!person.firstName || person.firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  if (!person.lastName || person.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  
  if (person.birthDate && person.deathDate) {
    if (new Date(person.birthDate) > new Date(person.deathDate)) {
      errors.push('Birth date must be before death date');
    }
  }
  
  return errors;
}

export function wouldCreateCycle(
  newParentId: string,
  newChildId: string,
  data: FamilyData
): boolean {
  if (newParentId === newChildId) return true;
  
  // Check if newChildId is an ancestor of newParentId
  const visited = new Set<string>();
  const stack = [newChildId];
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === newParentId) return true;
    if (visited.has(current!)) continue;
    visited.add(current!);
    
    // Find parents of current
    const parents = data.parentChildEdges
      .filter(e => e.childId === current)
      .map(e => e.parentId);
    
    stack.push(...parents);
  }
  
  return false;
}

export function validateParentChild(
  parentId: string,
  childId: string,
  data: FamilyData
): string[] {
  const errors: string[] = [];
  
  if (parentId === childId) {
    errors.push('Cannot create self-parent relationship');
  }
  
  if (wouldCreateCycle(parentId, childId, data)) {
    errors.push('This would create a parent-child cycle');
  }
  
  // Check for duplicate
  const exists = data.parentChildEdges.some(
    e => e.parentId === parentId && e.childId === childId
  );
  if (exists) {
    errors.push('This relationship already exists');
  }
  
  return errors;
}

export function validateSpouse(
  aId: string,
  bId: string,
  data: FamilyData
): string[] {
  const errors: string[] = [];
  
  if (aId === bId) {
    errors.push('Cannot create self-spouse relationship');
  }
  
  // Check for duplicate (A-B same as B-A)
  const exists = data.spouseEdges.some(
    e => (e.aId === aId && e.bId === bId) || (e.aId === bId && e.bId === aId)
  );
  if (exists) {
    errors.push('This spouse relationship already exists');
  }
  
  return errors;
}

export function removePerson(personId: string, data: FamilyData): FamilyData {
  return {
    people: data.people.filter(p => p.id !== personId),
    parentChildEdges: data.parentChildEdges.filter(
      e => e.parentId !== personId && e.childId !== personId
    ),
    spouseEdges: data.spouseEdges.filter(
      e => e.aId !== personId && e.bId !== personId
    ),
  };
}
