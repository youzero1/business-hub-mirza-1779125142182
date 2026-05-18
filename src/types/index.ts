export type JobStatus = 'open' | 'closed' | 'draft' | 'paused';
export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type ApplicationStatus = 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  postedDate: string;
  closingDate?: string;
  applicants: number;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  status: CandidateStatus;
  appliedDate: string;
  resumeUrl?: string;
  notes?: string;
  tags?: string[];
  jobId?: string;
  experience?: number;
  location?: string;
};

export type Interview = {
  id: string;
  candidateId: string;
  jobId: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  status: InterviewStatus;
  interviewers?: string[];
  notes?: string;
  feedback?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer';
  department?: string;
  avatar?: string;
  joinedDate: string;
  activeJobs?: number;
};

export type AppSettings = {
  companyName: string;
  industry: string;
  location: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
};

export type AppState = {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  team: TeamMember[];
  settings: AppSettings;
  currentUser: TeamMember;
};
