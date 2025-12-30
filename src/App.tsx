import React from 'react';
import { StoreProvider } from './store';
import TopBar from './components/TopBar';
import PeopleList from './components/PeopleList';
import TreeCanvas from './components/TreeCanvas';
import FocusControls from './components/FocusControls';
import RelationshipEditor from './components/RelationshipEditor';
import RelationsList from './components/RelationsList';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Top Bar */}
        <TopBar />
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - People List */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin">
            <PeopleList />
          </div>
          
          {/* Middle - Tree Canvas */}
          <div className="flex-1 bg-gray-100 overflow-hidden relative">
            <TreeCanvas />
          </div>
          
          {/* Right Sidebar - Controls & Editor */}
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto scrollbar-thin">
            <div className="p-4 space-y-6">
              <FocusControls />
              <RelationshipEditor />
              <RelationsList />
            </div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
