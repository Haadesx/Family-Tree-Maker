import React, { useRef } from 'react';
import { useStore } from '../store';
import { exportToJSON, importFromJSON, getDemoData } from '../utils/storage';
import { exportTreeToPNG } from '../utils/export';
import { FileDown, FileUp, Image, Database } from 'lucide-react';

const TopBar: React.FC = () => {
  const { state, dispatch } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    exportToJSON(state.data);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const data = await importFromJSON(file);
      dispatch({ type: 'LOAD_DATA', payload: data });
      alert('Data imported successfully!');
    } catch (error) {
      alert(`Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Reset input
    e.target.value = '';
  };

  const handleExportPNG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) {
      alert('No tree to export. Please load demo data or create a tree first.');
      return;
    }
    exportTreeToPNG(svgElement as unknown as HTMLElement);
  };

  const handleLoadDemo = () => {
    if (state.data.people.length > 0) {
      if (!confirm('This will replace current data. Continue?')) {
        return;
      }
    }
    const demoData = getDemoData();
    dispatch({ type: 'LOAD_DATA', payload: demoData });
    // Set focus to first person
    if (demoData.people.length > 0) {
      dispatch({ type: 'SET_FOCUS', payload: demoData.people[0].id });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-gray-800">🌳 Family Tree Maker</h1>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">MVP</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handleLoadDemo}
          className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
        >
          <Database size={16} />
          <span>Load Demo</span>
        </button>
        
        <button
          onClick={handleImportClick}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          <FileUp size={16} />
          <span>Import JSON</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <button
          onClick={handleExportJSON}
          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
        >
          <FileDown size={16} />
          <span>Export JSON</span>
        </button>
        
        <button
          onClick={handleExportPNG}
          className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm"
        >
          <Image size={16} />
          <span>Export PNG</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
