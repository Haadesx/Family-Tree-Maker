import { toPng } from 'html-to-image';
import { FamilyData } from '../models/types';

export async function exportTreeToPNG(element: HTMLElement, filename: string = 'family-tree.png'): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 0.95,
      pixelRatio: 2,
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    alert('Failed to export PNG. Please try again.');
  }
}

export function exportTreeToPDF(element: HTMLElement): void {
  // For PDF export, we'll use the browser's print functionality
  // This is a simple approach that works well
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for PDF export');
    return;
  }

  const svgContent = element.innerHTML;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Family Tree - PDF Export</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .tree-container { display: flex; justify-content: center; align-items: center; }
        svg { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      <h1>Family Tree</h1>
      <div class="tree-container">
        ${svgContent}
      </div>
      <script>
        window.onload = () => {
          window.print();
          setTimeout(() => window.close(), 100);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export function getDemoData(): FamilyData {
  return {
    people: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '1950-05-15',
        deathDate: '2010-08-20',
        notes: 'Family patriarch',
      },
      {
        id: '2',
        firstName: 'Mary',
        lastName: 'Smith',
        sex: 'F',
        birthDate: '1952-03-10',
        notes: 'Family matriarch',
      },
      {
        id: '3',
        firstName: 'Robert',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '1975-07-22',
        notes: 'Eldest son',
      },
      {
        id: '4',
        firstName: 'Susan',
        lastName: 'Johnson',
        sex: 'F',
        birthDate: '1977-11-05',
        notes: 'Robert\'s wife',
      },
      {
        id: '5',
        firstName: 'Michael',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '2000-01-15',
        notes: 'Robert\'s son',
      },
      {
        id: '6',
        firstName: 'Emily',
        lastName: 'Smith',
        sex: 'F',
        birthDate: '2002-09-30',
        notes: 'Robert\'s daughter',
      },
      {
        id: '7',
        firstName: 'Sarah',
        lastName: 'Williams',
        sex: 'F',
        birthDate: '1978-04-18',
        notes: 'Second child',
      },
      {
        id: '8',
        firstName: 'David',
        lastName: 'Williams',
        sex: 'M',
        birthDate: '1976-12-25',
        notes: 'Sarah\'s husband',
      },
      {
        id: '9',
        firstName: 'James',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '1982-02-28',
        notes: 'Youngest son',
      },
      {
        id: '10',
        firstName: 'Lisa',
        lastName: 'Chen',
        sex: 'F',
        birthDate: '1985-06-12',
        notes: 'James\'s partner',
      },
      {
        id: '11',
        firstName: 'Noah',
        lastName: 'Smith',
        sex: 'M',
        birthDate: '2015-08-08',
        notes: 'James\'s son',
      },
    ],
    parentChildEdges: [
      { parentId: '1', childId: '3', type: 'biological' },
      { parentId: '2', childId: '3', type: 'biological' },
      { parentId: '1', childId: '7', type: 'biological' },
      { parentId: '2', childId: '7', type: 'biological' },
      { parentId: '1', childId: '9', type: 'biological' },
      { parentId: '2', childId: '9', type: 'biological' },
      { parentId: '3', childId: '5', type: 'biological' },
      { parentId: '4', childId: '5', type: 'biological' },
      { parentId: '3', childId: '6', type: 'biological' },
      { parentId: '4', childId: '6', type: 'biological' },
      { parentId: '7', childId: '11', type: 'adopted' },
      { parentId: '8', childId: '11', type: 'adopted' },
    ],
    spouseEdges: [
      { aId: '1', bId: '2' },
      { aId: '3', bId: '4' },
      { aId: '7', bId: '8' },
      { aId: '9', bId: '10' },
    ],
  };
}
