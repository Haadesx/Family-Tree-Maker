import React, { useState } from 'react';
import { useStore } from '../store';
import { Link2, UserMinus, UserPlus, Heart, X } from 'lucide-react';

const RelationshipEditor: React.FC = () => {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState<'parent' | 'child' | 'spouse' | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [edgeType, setEdgeType] = useState<'biological' | 'adopted' | 'unknown'>('biological');

  const selectedPerson = state.data.people.find(p => p.id === state.selectedPersonId);
  const availablePeople = state.data.people.filter(p => p.id !== state.selectedPersonId);

  if (!selectedPerson) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <Link2 size={14} className="mr-2" />
          Relationship Editor
        </h3>
        <div className="text-xs text-gray-500 italic">
          Select a person to manage relationships
        </div>
      </div>
    );
  }

  const handleAddRelationship = () => {
    if (!selectedTargetId) {
      alert('Please select a person');
      return;
    }

    if (mode === 'parent') {
      dispatch({
        type: 'ADD_PARENT_CHILD',
        payload: { parentId: selectedTargetId, childId: selectedPerson.id, type: edgeType },
      });
    } else if (mode === 'child') {
      dispatch({
        type: 'ADD_PARENT_CHILD',
        payload: { parentId: selectedPerson.id, childId: selectedTargetId, type: edgeType },
      });
    } else if (mode === 'spouse') {
      dispatch({
        type: 'ADD_SPOUSE',
        payload: { aId: selectedPerson.id, bId: selectedTargetId },
      });
    }

    setMode(null);
    setSelectedTargetId('');
  };

  const handleRemoveRelationship = (type: 'parent' | 'child' | 'spouse', targetId: string) => {
    if (type === 'parent') {
      dispatch({
        type: 'REMOVE_PARENT_CHILD',
        payload: { parentId: targetId, childId: selectedPerson.id },
      });
    } else if (type === 'child') {
      dispatch({
        type: 'REMOVE_PARENT_CHILD',
        payload: { parentId: selectedPerson.id, childId: targetId },
      });
    } else if (type === 'spouse') {
      dispatch({
        type: 'REMOVE_SPOUSE',
        payload: { aId: selectedPerson.id, bId: targetId },
      });
    }
  };

  // Get current relationships
  const parents = state.data.parentChildEdges
    .filter(e => e.childId === selectedPerson.id)
    .map(e => ({ id: e.parentId, type: e.type }));

  const children = state.data.parentChildEdges
    .filter(e => e.parentId === selectedPerson.id)
    .map(e => ({ id: e.childId, type: e.type }));

  const spouses = state.data.spouseEdges
    .filter(e => e.aId === selectedPerson.id || e.bId === selectedPerson.id)
    .map(e => e.aId === selectedPerson.id ? e.bId : e.aId);

  const getPersonName = (id: string) => {
    const p = state.data.people.find(person => person.id === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 flex items-center">
        <Link2 size={14} className="mr-2" />
        Relationship Editor
      </h3>

      {/* Current Person */}
      <div className="bg-white p-2 rounded border border-gray-200">
        <div className="text-xs text-gray-500">Editing:</div>
        <div className="font-medium text-sm text-gray-800">
          {selectedPerson.firstName} {selectedPerson.lastName}
        </div>
      </div>

      {/* Add Relationship Section */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-700">Add Relationship:</div>
        
        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setMode('parent')}
            className={`px-2 py-1 text-xs rounded border transition ${
              mode === 'parent' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            Parent
          </button>
          <button
            onClick={() => setMode('child')}
            className={`px-2 py-1 text-xs rounded border transition ${
              mode === 'child' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            Child
          </button>
          <button
            onClick={() => setMode('spouse')}
            className={`px-2 py-1 text-xs rounded border transition ${
              mode === 'spouse' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            Spouse
          </button>
        </div>

        {/* Mode-specific inputs */}
        {mode && (
          <div className="space-y-2 bg-white p-2 rounded border border-blue-200">
            <div className="flex items-center space-x-2">
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">Select person...</option>
                {availablePeople.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>

            {mode !== 'spouse' && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Type:</span>
                <select
                  value={edgeType}
                  onChange={(e) => setEdgeType(e.target.value as any)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="biological">Biological</option>
                  <option value="adopted">Adopted</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleAddRelationship}
                className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700 text-xs font-medium"
              >
                Add
              </button>
              <button
                onClick={() => setMode(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-1 rounded hover:bg-gray-400 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Remove Relationships Section */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-700">Remove Relationships:</div>
        
        {/* Parents */}
        {parents.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Parents:</div>
            {parents.map(parent => (
              <div key={parent.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-gray-200">
                <span className="text-xs">{getPersonName(parent.id)} ({parent.type})</span>
                <button
                  onClick={() => handleRemoveRelationship('parent', parent.id)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Children:</div>
            {children.map(child => (
              <div key={child.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-gray-200">
                <span className="text-xs">{getPersonName(child.id)} ({child.type})</span>
                <button
                  onClick={() => handleRemoveRelationship('child', child.id)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Spouses */}
        {spouses.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Spouses:</div>
            {spouses.map(spouseId => (
              <div key={spouseId} className="flex items-center justify-between bg-white p-1.5 rounded border border-gray-200">
                <span className="text-xs">{getPersonName(spouseId)}</span>
                <button
                  onClick={() => handleRemoveRelationship('spouse', spouseId)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {parents.length === 0 && children.length === 0 && spouses.length === 0 && (
          <div className="text-xs text-gray-400 italic">
            No relationships yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipEditor;
