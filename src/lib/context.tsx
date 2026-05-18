import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Job, Candidate, Interview, TeamMember } from '@/types/index';
import { seedData } from '@/lib/seed';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'DELETE_CANDIDATE'; payload: string }
  | { type: 'ADD_INTERVIEW'; payload: Interview }
  | { type: 'UPDATE_INTERVIEW'; payload: Interview }
  | { type: 'DELETE_INTERVIEW'; payload: string }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'DELETE_TEAM_MEMBER'; payload: string };

export type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map((j) => (j.id === action.payload.id ? action.payload : j)) };
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter((j) => j.id !== action.payload) };
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [...state.candidates, action.payload] };
    case 'UPDATE_CANDIDATE':
      return { ...state, candidates: state.candidates.map((c) => (c.id === action.payload.id ? action.payload : c)) };
    case 'DELETE_CANDIDATE':
      return { ...state, candidates: state.candidates.filter((c) => c.id !== action.payload) };
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [...state.interviews, action.payload] };
    case 'UPDATE_INTERVIEW':
      return { ...state, interviews: state.interviews.map((i) => (i.id === action.payload.id ? action.payload : i)) };
    case 'DELETE_INTERVIEW':
      return { ...state, interviews: state.interviews.filter((i) => i.id !== action.payload) };
    case 'ADD_TEAM_MEMBER':
      return { ...state, team: [...state.team, action.payload] };
    case 'UPDATE_TEAM_MEMBER':
      return { ...state, team: state.team.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case 'DELETE_TEAM_MEMBER':
      return { ...state, team: state.team.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'ats_app_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seedData);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
