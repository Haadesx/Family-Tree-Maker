import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Person } from '../models/types';
import { validatePerson } from '../models/validation';

interface PersonFormProps {
  personId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({ personId, onSave, onCancel }) => {
  const { state, dispatch } = useStore();
  
  const [formData, setFormData] = useState<Omit<Person, 'id'>>({
    firstName: '',
    lastName: '',
    sex: undefined,
    birthDate: '',
    deathDate: '',
    notes: '',
    photoUrl: '',
  });

  useEffect(() => {
    if (personId) {
      const person = state.data.people.find(p => p.id === personId);
      if (person) {
        setFormData({
          firstName: person.firstName,
          lastName: person.lastName,
          sex: person.sex,
          birthDate: person.birthDate || '',
          deathDate: person.deathDate || '',
          notes: person.notes || '',
          photoUrl: person.photoUrl || '',
        });
      }
    }
  }, [personId, state.data.people]);

  const handleChange = (field: keyof Omit<Person, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validatePerson(formData as Person);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    if (personId) {
      dispatch({
        type: 'UPDATE_PERSON',
        payload: { ...formData, id: personId } as Person,
      });
    } else {
      dispatch({
        type: 'ADD_PERSON',
        payload: formData,
      });
    }
    
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sex
          </label>
          <select
            value={formData.sex || ''}
            onChange={(e) => handleChange('sex', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Death Date
        </label>
        <input
          type="date"
          value={formData.deathDate}
          onChange={(e) => handleChange('deathDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo URL
        </label>
        <input
          type="url"
          value={formData.photoUrl}
          onChange={(e) => handleChange('photoUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      <div className="flex space-x-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          {personId ? 'Update' : 'Add'} Person
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
