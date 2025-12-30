import React from 'react';
import { useStore } from '../store';
import { Target } from 'lucide-react';

const FocusControls: React.FC = () => {
  const { state, dispatch } = useStore();

  const people = state.data.people;
  const selectedPerson = people.find(p => p.id === state.selectedPersonId);
  const focusPerson = people.find(p => p.id === state.focusPersonId);

  const handleSetFocus = () => {
    if (state.selectedPersonId) {
      dispatch({ type: 'SET_FOCUS', payload: state.selectedPersonId });
    }
  };

  const handleClearFocus = () => {
    dispatch({ type: 'SET_FOCUS', payload: null });
  };

  const handleAncestorChange = (value: number) => {
    dispatch({ type: 'SET_DEPTH', payload: { ancestor: value, descendant: state.descendantDepth } });
  };

  const handleDescendantChange = (value: number) => {
    dispatch({ type: 'SET_DEPTH', payload: { ancestor: state.ancestorDepth, descendant: value } });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <Target size={14} className="mr-2" />
        Focus & Depth
      </h3>

      {/* Current Focus */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 mb-1">Current Focus:</div>
        <div className="font-medium text-sm">
          {focusPerson ? (
            <span className="text-purple-700">
              {focusPerson.firstName} {focusPerson.lastName}
            </span>
          ) : (
            <span className="text-gray-400 italic">None</span>
          )}
        </div>
      </div>

      {/* Set Focus from Selected */}
      <div className="mb-4">
        {selectedPerson && state.selectedPersonId !== state.focusPersonId ? (
          <button
            onClick={handleSetFocus}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition text-sm font-medium"
          >
            Set Focus to Selected
          </button>
        ) : (
          <button
            onClick={handleClearFocus}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition text-sm font-medium"
            disabled={!focusPerson}
          >
            Clear Focus
          </button>
        )}
        {selectedPerson && (
          <div className="text-xs text-gray-500 mt-1">
            Selected: {selectedPerson.firstName} {selectedPerson.lastName}
          </div>
        )}
      </div>

      {/* Ancestor Depth */}
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">
          Ancestor Depth: <span className="font-semibold text-gray-800">{state.ancestorDepth}</span>
        </label>
        <input
          type="range"
          min="0"
          max="6"
          value={state.ancestorDepth}
          onChange={(e) => handleAncestorChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0</span>
          <span>3</span>
          <span>6</span>
        </div>
      </div>

      {/* Descendant Depth */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          Descendant Depth: <span className="font-semibold text-gray-800">{state.descendantDepth}</span>
        </label>
        <input
          type="range"
          min="0"
          max="6"
          value={state.descendantDepth}
          onChange={(e) => handleDescendantChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0</span>
          <span>3</span>
          <span>6</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-800 border border-blue-100">
        <div className="font-semibold mb-1">Tip:</div>
        <div>Set a focus person to visualize their family tree. Adjust depth to show more or fewer generations.</div>
      </div>
    </div>
  );
};

export default FocusControls;
