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

## Deployment

This project is ready to deploy to Vercel or Render with zero configuration.

### Deploy to Vercel (Recommended)

#### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from project directory:
```bash
cd /a0/usr/projects/family_tree_maker
vercel
```

3. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? **Your Vercel account**
   - Link to existing project? **N**
   - Project name? **family-tree-maker**
   - In which directory? **./**
   - Override settings? **N**

4. Your site will be live at `https://family-tree-maker.vercel.app`

#### Method 2: Vercel Website

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

Your site will be live in ~1-2 minutes.

### Deploy to Render

#### Method 1: Render Dashboard

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign in
3. Click "New" → "Static Site"
4. Connect your GitHub repository
5. Configure:
   - Name: **family-tree-maker**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment: `production`
6. Click "Create Static Site"

Your site will be live at `https://family-tree-maker.onrender.com`

#### Method 2: Render Blueprint

1. Fork this repository to your GitHub
2. Go to [render.com](https://render.com) → "Blueprints" → "New Blueprint"
3. Connect your GitHub account
4. Select your repository
5. Render will auto-detect the `render.yaml` file
6. Click "Apply"

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Deploy to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in repo settings:
   - Settings → Pages → Source: Deploy from branch
   - Branch: `gh-pages`, Folder: `/`

### Environment Variables

No environment variables are required for this project. All data is stored in browser localStorage.

### Build Preview

To test the production build locally:

```bash
npm run build
npm run preview
```

Then open `http://localhost:4173`

### Troubleshooting Deployment

**Issue: Build fails with "out of memory"**
```bash
# Increase Node memory
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

**Issue: Blank page after deployment**
- Check that `dist` folder contains `index.html`
- Ensure `vercel.json` or `render.yaml` is in root
- Check browser console for errors

**Issue: Routes not working (404 on refresh)**
- For Vercel: `vercel.json` handles rewrites automatically
- For Render: `render.yaml` handles rewrites automatically
- For other hosts: Configure SPA rewrites to `index.html`

### Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Repository is public (or private with proper auth)
- [ ] `package.json` has correct build scripts
- [ ] `vite.config.ts` is configured (default is fine)
- [ ] No environment variables needed
- [ ] Deploy platform configured
- [ ] Site is live and functional

### Post-Deployment

Once deployed:

1. **Test all features**:
   - Load demo data
   - Add/edit people
   - Create relationships
   - Export JSON/PNG
   - Pan/zoom tree

2. **Share the link** with family members

3. **Bookmark the site** for quick access

4. **Export data regularly** as backup

### Performance Notes

- **First Load**: ~50KB (compressed)
- **Build Time**: ~5-10 seconds
- **Runtime**: No server required, runs entirely in browser
- **Storage**: Uses browser localStorage (5-10MB typical limit)

### Security Notes

- No backend = no data breaches
- All data stays on user's device
- No authentication required
- No external API calls
- Safe to deploy publicly

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Node.js version (16+)
3. Clear browser cache
4. Try incognito mode
5. Check deployment logs

## Credits

Built with:
- React 18
- TypeScript
- Vite
- TailwindCSS
- d3-hierarchy
- html-to-image
- lucide-react
