import { FamilyData } from '../models/types';

export function saveToLocalStorage(key: string, data: FamilyData): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function exportToJSON(data: FamilyData, filename: string = 'family-tree.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<FamilyData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as FamilyData;
        if (!data.people || !Array.isArray(data.people)) {
          throw new Error('Invalid data format: missing people array');
        }
        if (!data.parentChildEdges || !Array.isArray(data.parentChildEdges)) {
          data.parentChildEdges = [];
        }
        if (!data.spouseEdges || !Array.isArray(data.spouseEdges)) {
          data.spouseEdges = [];
        }
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function getDemoData(): FamilyData {
  return {
    people: [
      {
        id: 'p1',
        firstName: 'John',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '1950-05-15',
        deathDate: '2015-08-20',
        notes: 'Family patriarch',
        photoUrl: '',
      },
      {
        id: 'p2',
        firstName: 'Mary',
        lastName: 'Smith',
        sex: 'F',
        birthDate: '1952-03-22',
        deathDate: '',
        notes: 'Family matriarch',
        photoUrl: '',
      },
      {
        id: 'p3',
        firstName: 'Robert',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '1975-10-10',
        deathDate: '',
        notes: 'Eldest son',
        photoUrl: '',
      },
      {
        id: 'p4',
        firstName: 'Susan',
        lastName: 'Johnson',
        sex: 'F',
        birthDate: '1977-06-18',
        deathDate: '',
        notes: "Robert's wife",
        photoUrl: '',
      },
      {
        id: 'p5',
        firstName: 'Emily',
        lastName: 'Smith',
        sex: 'F',
        birthDate: '2005-02-01',
        deathDate: '',
        notes: "Robert's daughter",
        photoUrl: '',
      },
      {
        id: 'p6',
        firstName: 'Michael',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '2008-09-14',
        deathDate: '',
        notes: "Robert's son",
        photoUrl: '',
      },
      {
        id: 'p7',
        firstName: 'Linda',
        lastName: 'Davis',
        sex: 'F',
        birthDate: '1978-12-05',
        deathDate: '',
        notes: 'Second wife of John',
        photoUrl: '',
      },
      {
        id: 'p8',
        firstName: 'David',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '1982-04-30',
        deathDate: '',
        notes: 'Youngest son',
        photoUrl: '',
      },
      {
        id: 'p9',
        firstName: 'Sarah',
        lastName: 'Smith',
        sex: 'F',
        birthDate: '1985-07-25',
        deathDate: '',
        notes: 'Daughter from second marriage',
        photoUrl: '',
      },
      {
        id: 'p10',
        firstName: 'James',
        lastName: 'Unknown',
        sex: 'M',
        birthDate: '1920-01-01',
        deathDate: '1990-01-01',
        notes: "John's father - unknown parent",
        photoUrl: '',
      },
      {
        id: 'p11',
        firstName: 'Margaret',
        lastName: 'Unknown',
        sex: 'F',
        birthDate: '1922-01-01',
        deathDate: '1995-01-01',
        notes: "John's mother - unknown parent",
        photoUrl: '',
      },
    ],
    parentChildEdges: [
      { parentId: 'p1', childId: 'p3', type: 'biological' },
      { parentId: 'p2', childId: 'p3', type: 'biological' },
      { parentId: 'p1', childId: 'p8', type: 'biological' },
      { parentId: 'p7', childId: 'p8', type: 'biological' },
      { parentId: 'p1', childId: 'p9', type: 'biological' },
      { parentId: 'p7', childId: 'p9', type: 'biological' },
      { parentId: 'p3', childId: 'p5', type: 'biological' },
      { parentId: 'p4', childId: 'p5', type: 'biological' },
      { parentId: 'p3', childId: 'p6', type: 'biological' },
      { parentId: 'p4', childId: 'p6', type: 'biological' },
      { parentId: 'p10', childId: 'p1', type: 'unknown' },
      { parentId: 'p11', childId: 'p1', type: 'unknown' },
    ],
    spouseEdges: [
      { aId: 'p1', bId: 'p2' },
      { aId: 'p3', bId: 'p4' },
      { aId: 'p1', bId: 'p7' },
    ],
  };
}
