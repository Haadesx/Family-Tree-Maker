import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import PersonForm from './PersonForm';

const PeopleList: React.FC = () => {
  const { state, dispatch } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

  const filteredPeople = state.data.people.filter(person => {
    const search = searchTerm.toLowerCase();
    return (
      person.firstName.toLowerCase().includes(search) ||
      person.lastName.toLowerCase().includes(search) ||
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(search)
    );
  });

  const handleDelete = (personId: string) => {
    if (confirm('Are you sure you want to delete this person? This will also remove all relationships.')) {
      dispatch({ type: 'DELETE_PERSON', payload: personId });
    }
  };

  const handleSelect = (personId: string) => {
    dispatch({ type: 'SELECT_PERSON', payload: personId });
  };

  const handleEdit = (personId: string) => {
    setEditingPersonId(personId);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">People</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search people..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Person</h3>
            <PersonForm
              onSave={() => setShowAddForm(false)}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingPersonId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Person</h3>
            <PersonForm
              personId={editingPersonId}
              onSave={() => setEditingPersonId(null)}
              onCancel={() => setEditingPersonId(null)}
            />
          </div>
        </div>
      )}

      {/* People List */}
      <div className="space-y-2">
        {filteredPeople.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            {searchTerm ? 'No matches found' : 'No people yet. Add someone or load demo data.'}
          </div>
        ) : (
          filteredPeople.map(person => {
            const isSelected = state.selectedPersonId === person.id;
            const isFocused = state.focusPersonId === person.id;
            
            return (
              <div
                key={person.id}
                className={`p-3 rounded border cursor-pointer transition group relative ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(person.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {person.firstName} {person.lastName}
                      {isFocused && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Focus</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {person.birthDate || '??'} - {person.deathDate || 'Present'}
                      {person.sex && <span className="ml-2">{person.sex}</span>}
                    </div>
                    {person.notes && (
                      <div className="text-xs text-gray-600 mt-1 italic">
                        {person.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(person.id); }}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(person.id); }}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PeopleList;
