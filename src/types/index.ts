// Core entity types for the ATS application

export type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer' | 'external';

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  createdAt: string;
  updatedAt: string;
  hiringManagerId: string;
  applicationCount: number;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  currentRole?: string;
  currentCompany?: string;
  location?: string;
  linkedIn?: string;
  resumeUrl?: string;
  skills: string[];
  status: ApplicationStatus;
  appliedJobId?: string;
  appliedAt: string;
  notes?: string;
  rating?: number;
  tags?: string[];
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  interviewerIds: string[];
  location?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AppSettings {
  companyName: string;
  companyWebsite?: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  team: TeamMember[];
  currentUser: CurrentUser;
  settings: AppSettings;
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppAction =
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
