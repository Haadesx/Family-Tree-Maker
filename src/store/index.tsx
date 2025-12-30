import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { FamilyData, AppState, Person, ParentChildEdge, SpouseEdge } from '../models/types';
import { generateId, validatePerson, validateParentChild, validateSpouse, removePerson } from '../models/validation';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const initialState: AppState = {
  data: {
    people: [],
    parentChildEdges: [],
    spouseEdges: [],
  },
  selectedPersonId: null,
  focusPersonId: null,
  ancestorDepth: 4,
  descendantDepth: 4,
};

type Action =
  | { type: 'ADD_PERSON'; payload: Omit<Person, 'id'> }
  | { type: 'UPDATE_PERSON'; payload: Person }
  | { type: 'DELETE_PERSON'; payload: string }
  | { type: 'ADD_PARENT_CHILD'; payload: { parentId: string; childId: string; type?: string } }
  | { type: 'REMOVE_PARENT_CHILD'; payload: { parentId: string; childId: string } }
  | { type: 'ADD_SPOUSE'; payload: { aId: string; bId: string } }
  | { type: 'REMOVE_SPOUSE'; payload: { aId: string; bId: string } }
  | { type: 'SELECT_PERSON'; payload: string | null }
  | { type: 'SET_FOCUS'; payload: string | null }
  | { type: 'SET_DEPTH'; payload: { ancestor: number; descendant: number } }
  | { type: 'LOAD_DATA'; payload: FamilyData }
  | { type: 'SET_STATE'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PERSON': {
      const newPerson: Person = {
        ...action.payload,
        id: generateId(),
      };
      const errors = validatePerson(newPerson);
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          people: [...state.data.people, newPerson],
        },
      };
    }

    case 'UPDATE_PERSON': {
      const errors = validatePerson(action.payload);
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          people: state.data.people.map(p =>
            p.id === action.payload.id ? action.payload : p
          ),
        },
      };
    }

    case 'DELETE_PERSON': {
      const newData = removePerson(action.payload, state.data);
      return {
        ...state,
        data: newData,
        selectedPersonId: state.selectedPersonId === action.payload ? null : state.selectedPersonId,
        focusPersonId: state.focusPersonId === action.payload ? null : state.focusPersonId,
      };
    }

    case 'ADD_PARENT_CHILD': {
      const { parentId, childId, type } = action.payload;
      const errors = validateParentChild(parentId, childId, state.data);
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return state;
      }
      const newEdge: ParentChildEdge = { parentId, childId, type: type as any };
      return {
        ...state,
        data: {
          ...state.data,
          parentChildEdges: [...state.data.parentChildEdges, newEdge],
        },
      };
    }

    case 'REMOVE_PARENT_CHILD': {
      const { parentId, childId } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          parentChildEdges: state.data.parentChildEdges.filter(
            e => !(e.parentId === parentId && e.childId === childId)
          ),
        },
      };
    }

    case 'ADD_SPOUSE': {
      const { aId, bId } = action.payload;
      const errors = validateSpouse(aId, bId, state.data);
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return state;
      }
      const newEdge: SpouseEdge = { aId, bId };
      return {
        ...state,
        data: {
          ...state.data,
          spouseEdges: [...state.data.spouseEdges, newEdge],
        },
      };
    }

    case 'REMOVE_SPOUSE': {
      const { aId, bId } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          spouseEdges: state.data.spouseEdges.filter(
            e => !((e.aId === aId && e.bId === bId) || (e.aId === bId && e.bId === aId))
          ),
        },
      };
    }

    case 'SELECT_PERSON': {
      return { ...state, selectedPersonId: action.payload };
    }

    case 'SET_FOCUS': {
      return { ...state, focusPersonId: action.payload };
    }

    case 'SET_DEPTH': {
      return {
        ...state,
        ancestorDepth: action.payload.ancestor,
        descendantDepth: action.payload.descendant,
      };
    }

    case 'LOAD_DATA': {
      return {
        ...state,
        data: action.payload,
      };
    }

    case 'SET_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveToLocalStorage('familyTreeData', state.data);
  }, [state.data]);

  useEffect(() => {
    const saved = loadFromLocalStorage<FamilyData>('familyTreeData');
    if (saved && saved.people.length > 0) {
      dispatch({ type: 'LOAD_DATA', payload: saved });
    }
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
