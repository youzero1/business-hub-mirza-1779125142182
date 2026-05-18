export type JobStatus = 'open' | 'closed' | 'draft' | 'paused';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type ApplicationStatus = 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer' | 'external';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  postedDate: string;
  closingDate?: string;
  hiringManagerId: string;
  teamMemberIds: string[];
  tags: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  appliedJobId?: string;
  status: CandidateStatus;
  applicationStatus?: ApplicationStatus;
  resumeUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  notes: string;
  appliedDate: string;
  source?: string;
  rating?: number;
  tags: string[];
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
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  isActive: boolean;
  joinedDate: string;
}

export interface AppSettings {
  companyName: string;
  companyLogo?: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  slackIntegration: boolean;
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  team: TeamMember[];
  settings: AppSettings;
  currentUser: TeamMember;
}
