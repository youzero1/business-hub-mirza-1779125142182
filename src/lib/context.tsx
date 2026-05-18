import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Job, Candidate, Application, Interview, User, EmailTemplate } from '@/types';
import { getSeedData } from './seed';

const STORAGE_KEY = 'ats_app_state';

type AppContextType = {
  state: AppState;
  setCurrentUser: (user: User) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;
  addApplication: (application: Application) => void;
  updateApplication: (application: Application) => void;
  addInterview: (interview: Interview) => void;
  updateInterview: (interview: Interview) => void;
  deleteInterview: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  updateEmailTemplate: (template: EmailTemplate) => void;
};

const AppContext = createContext<AppContextType | null>(null);

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // ignore
  }
  return getSeedData();
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  function setCurrentUser(user: User) {
    setState(s => ({ ...s, currentUser: user }));
  }

  function addJob(job: Job) {
    setState(s => ({ ...s, jobs: [...s.jobs, job] }));
  }
  function updateJob(job: Job) {
    setState(s => ({ ...s, jobs: s.jobs.map(j => (j.id === job.id ? job : j)) }));
  }
  function deleteJob(id: string) {
    setState(s => ({ ...s, jobs: s.jobs.filter(j => j.id !== id) }));
  }

  function addCandidate(candidate: Candidate) {
    setState(s => ({ ...s, candidates: [...s.candidates, candidate] }));
  }
  function updateCandidate(candidate: Candidate) {
    setState(s => ({ ...s, candidates: s.candidates.map(c => (c.id === candidate.id ? candidate : c)) }));
  }
  function deleteCandidate(id: string) {
    setState(s => ({ ...s, candidates: s.candidates.filter(c => c.id !== id) }));
  }

  function addApplication(application: Application) {
    setState(s => ({ ...s, applications: [...s.applications, application] }));
  }
  function updateApplication(application: Application) {
    setState(s => ({
      ...s,
      applications: s.applications.map(a => (a.id === application.id ? application : a)),
    }));
  }

  function addInterview(interview: Interview) {
    setState(s => ({ ...s, interviews: [...s.interviews, interview] }));
  }
  function updateInterview(interview: Interview) {
    setState(s => ({
      ...s,
      interviews: s.interviews.map(i => (i.id === interview.id ? interview : i)),
    }));
  }
  function deleteInterview(id: string) {
    setState(s => ({ ...s, interviews: s.interviews.filter(i => i.id !== id) }));
  }

  function addUser(user: User) {
    setState(s => ({ ...s, users: [...s.users, user] }));
  }
  function updateUser(user: User) {
    setState(s => ({ ...s, users: s.users.map(u => (u.id === user.id ? user : u)) }));
  }

  function updateEmailTemplate(template: EmailTemplate) {
    setState(s => ({
      ...s,
      emailTemplates: s.emailTemplates.map(t => (t.id === template.id ? template : t)),
    }));
  }

  return (
    <AppContext.Provider
      value={{
        state,
        setCurrentUser,
        addJob,
        updateJob,
        deleteJob,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        addApplication,
        updateApplication,
        addInterview,
        updateInterview,
        deleteInterview,
        addUser,
        updateUser,
        updateEmailTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
