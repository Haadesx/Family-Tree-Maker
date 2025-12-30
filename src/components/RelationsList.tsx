import React from 'react';
import { useStore } from '../store';
import { Users } from 'lucide-react';
import { getImmediateRelations } from '../layout/treeBuilder';

const RelationsList: React.FC = () => {
  const { state } = useStore();

  const selectedPerson = state.data.people.find(p => p.id === state.selectedPersonId);

  if (!selectedPerson) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <Users size={14} className="mr-2" />
          Immediate Relations
        </h3>
        <div className="text-xs text-gray-500 italic">
          Select a person to view their relations
        </div>
      </div>
    );
  }

  const relations = getImmediateRelations(selectedPerson.id, state.data);

  const getPersonName = (id: string) => {
    const p = state.data.people.find(person => person.id === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  };

  const getPersonBirthYear = (id: string) => {
    const p = state.data.people.find(person => person.id === id);
    return p?.birthDate ? p.birthDate.substring(0, 4) : '?';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 flex items-center">
        <Users size={14} className="mr-2" />
        Immediate Relations
      </h3>

      <div className="bg-white p-2 rounded border border-gray-200">
        <div className="text-xs text-gray-500">Selected:</div>
        <div className="font-medium text-sm text-gray-800">
          {selectedPerson.firstName} {selectedPerson.lastName}
        </div>
      </div>

      {/* Parents */}
      <div>
        <div className="text-xs font-semibold text-gray-600 mb-1">Parents:</div>
        {relations.parents.length > 0 ? (
          <div className="space-y-1">
            {relations.parents.map(parentId => (
              <div key={parentId} className="text-xs bg-blue-50 p-1.5 rounded border border-blue-100">
                <span className="font-medium">{getPersonName(parentId)}</span>
                <span className="text-gray-500 ml-1">({getPersonBirthYear(parentId)})</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">No parents recorded</div>
        )}
      </div>

      {/* Spouses */}
      <div>
        <div className="text-xs font-semibold text-gray-600 mb-1">Spouses:</div>
        {relations.spouses.length > 0 ? (
          <div className="space-y-1">
            {relations.spouses.map(spouseId => (
              <div key={spouseId} className="text-xs bg-purple-50 p-1.5 rounded border border-purple-100">
                <span className="font-medium">{getPersonName(spouseId)}</span>
                <span className="text-gray-500 ml-1">({getPersonBirthYear(spouseId)})</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">No spouses recorded</div>
        )}
      </div>

      {/* Children */}
      <div>
        <div className="text-xs font-semibold text-gray-600 mb-1">Children:</div>
        {relations.children.length > 0 ? (
          <div className="space-y-1">
            {relations.children.map(childId => (
              <div key={childId} className="text-xs bg-green-50 p-1.5 rounded border border-green-100">
                <span className="font-medium">{getPersonName(childId)}</span>
                <span className="text-gray-500 ml-1">({getPersonBirthYear(childId)})</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">No children recorded</div>
        )}
      </div>

      {/* Summary */}
      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
        <div className="flex justify-between">
          <span>Total Parents:</span>
          <span className="font-semibold">{relations.parents.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Spouses:</span>
          <span className="font-semibold">{relations.spouses.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Children:</span>
          <span className="font-semibold">{relations.children.length}</span>
        </div>
      </div>
    </div>
  );
};

export default RelationsList;
