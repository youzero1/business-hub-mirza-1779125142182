import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AppState, Job, Interview, TeamMember, AppSettings, Candidate } from '@/types/index';
import { seedData } from './seed';

type Action =
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
  | { type: 'DELETE_TEAM_MEMBER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_JOB':
      return { ...state, jobs: [action.payload, ...state.jobs] };
    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) };
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter(j => j.id !== action.payload) };
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [action.payload, ...state.candidates] };
    case 'UPDATE_CANDIDATE':
      return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CANDIDATE':
      return { ...state, candidates: state.candidates.filter(c => c.id !== action.payload) };
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [action.payload, ...state.interviews] };
    case 'UPDATE_INTERVIEW':
      return { ...state, interviews: state.interviews.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INTERVIEW':
      return { ...state, interviews: state.interviews.filter(i => i.id !== action.payload) };
    case 'ADD_TEAM_MEMBER':
      return { ...state, team: [action.payload, ...state.team] };
    case 'UPDATE_TEAM_MEMBER':
      return { ...state, team: state.team.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_TEAM_MEMBER':
      return { ...state, team: state.team.filter(m => m.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seedData);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
