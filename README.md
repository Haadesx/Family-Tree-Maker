# Family Tree Maker

A single-page web application for creating and visualizing family trees.

## Features

### Core Functionality
- **People Management**: Create, edit, and delete people with full profile information
  - Name (first/last)
  - Sex (M/F/O)
  - Birth/Death dates
  - Notes and photo URLs

- **Relationship Management**: 
  - Parent-child relationships (biological, adopted, unknown)
  - Spouse relationships (supports multiple spouses)
  - Prevents cycles and duplicates

- **Tree Visualization**:
  - Automatic layout using d3-hierarchy
  - SVG rendering with pan and zoom
  - Focus person with configurable ancestor/descendant depth
  - Visual indicators for relationships

- **Data Persistence**:
  - Automatic localStorage autosave
  - Export to JSON
  - Import from JSON
  - Demo dataset included

- **Export Options**:
  - Export tree view as PNG
  - Print to PDF via browser

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Tree Layout**: d3-hierarchy
- **PNG Export**: html-to-image
- **Icons**: lucide-react

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation Steps

1. Navigate to the project directory:
```bash
cd /a0/usr/projects/family_tree_maker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

### Getting Started

1. **Load Demo Data**: Click the "Load Demo" button in the top bar to load sample family data
2. **Explore the Tree**: Use the tree canvas to view the family structure
3. **Pan & Zoom**: 
   - Drag to pan the view
   - Scroll to zoom in/out
   - Use the zoom controls in the top-right corner

### Managing People

1. **Add Person**: Click "Add" in the People sidebar
2. **Edit Person**: Click the edit icon (✏️) next to a person
3. **Delete Person**: Click the delete icon (🗑️) next to a person
4. **Select Person**: Click on a person in the list or on a tree node

### Managing Relationships

1. **Select a person** from the People list
2. Use the **Relationship Editor** in the right sidebar:
   - Choose relationship type (Parent/Child/Spouse)
   - Select the target person
   - Choose relationship type (for parent-child)
   - Click "Add"
3. **Remove relationships** by clicking the X button next to any listed relationship

### Visualizing Trees

1. **Set Focus**: Select a person and click "Set Focus to Selected"
2. **Adjust Depth**: Use the sliders to control how many generations to show
   - Ancestor Depth: How many generations up to display
   - Descendant Depth: How many generations down to display
3. **View Relations**: The "Immediate Relations" panel shows parents, spouses, and children

### Import/Export

1. **Export JSON**: Click "Export JSON" to download all data
2. **Import JSON**: Click "Import JSON" to load previously saved data
3. **Export PNG**: Click "Export PNG" to save the current tree view as an image

## Data Model

### Person
```typescript
{
  id: string;           // UUID
  firstName: string;
  lastName: string;
  sex?: 'M' | 'F' | 'O';
  birthDate?: string;
  deathDate?: string;
  notes?: string;
  photoUrl?: string;
}
```

### Parent-Child Edge
```typescript
{
  parentId: string;
  childId: string;
  type?: 'biological' | 'adopted' | 'unknown';
}
```

### Spouse Edge
```typescript
{
  aId: string;
  bId: string;
  startDate?: string;
  endDate?: string;
}
```

## Architecture

### File Structure
```
src/
├── models/          # TypeScript types and validation
│   ├── types.ts
│   └── validation.ts
├── store/           # State management (Context + Reducer)
│   └── index.ts
├── layout/          # Tree building and positioning
│   └── treeBuilder.ts
├── utils/           # Storage and export utilities
│   ├── storage.ts
│   └── export.ts
├── components/      # React UI components
│   ├── App.tsx
│   ├── TopBar.tsx
│   ├── PeopleList.tsx
│   ├── PersonForm.tsx
│   ├── TreeCanvas.tsx
│   ├── FocusControls.tsx
│   ├── RelationshipEditor.tsx
│   └── RelationsList.tsx
├── main.tsx         # Entry point
└── index.css        # TailwindCSS
```

### State Management
- Uses React Context + useReducer pattern
- Centralized store for all data and UI state
- Automatic localStorage persistence

### Tree Layout Algorithm
1. Build ancestor/descendant subgraph from focus person
2. Convert to hierarchical structure
3. Apply d3-hierarchy tree layout
4. Render as SVG with pan/zoom

## Known Limitations

1. **Spouse Visualization**: Multiple spouses are indicated but not perfectly laid out to avoid visual clutter. The current implementation shows spouse count and handles relationships correctly, but visual positioning may overlap in complex cases.

2. **No Backend**: All data is stored in browser localStorage. Data is not synced across devices or shared.

3. **No Authentication**: This is a single-user application. Anyone with access to the browser can view/edit the data.

4. **Browser Print for PDF**: PDF export uses the browser's print dialog rather than generating a true PDF file. This works well but requires user interaction.

5. **No Undo/Redo**: Changes are immediate and cannot be undone.

6. **No Conflict Resolution**: If the same data is imported multiple times, duplicates may occur.

7. **Mobile Support**: The interface is designed for desktop/tablet. Mobile support is limited.

## Validation Rules

- **Person**: First and last name required; birth date must be before death date
- **Parent-Child**: Cannot create cycles; cannot be self-parent; no duplicates
- **Spouse**: Cannot be self-spouse; no duplicate edges (A-B same as B-A)

## Browser Compatibility

- Modern browsers with ES2020 support
- Requires localStorage support
- Requires SVG support
- Tested on Chrome, Firefox, Safari, Edge

## License

MIT

## Development

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Notes

- **Layout Library**: Uses d3-hierarchy for tree layout as specified. This provides clean hierarchical positioning and is well-suited for family trees.
- **State Management**: Uses React Context + Reducer for simplicity and to avoid external dependencies like Redux or Zustand.
- **Styling**: TailwindCSS provides rapid UI development with consistent design.
- **Type Safety**: Full TypeScript implementation for better developer experience and fewer runtime errors.
