export type JobStatus = 'open' | 'closed' | 'draft' | 'published';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';
export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical';
export type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  experienceLevel: ExperienceLevel;
  createdAt: string;
  updatedAt: string;
  applicantCount: number;
  openings: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  jobId: string;
  jobTitle: string;
  status: CandidateStatus;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  experience: number;
  notes?: string;
  rating?: number;
  appliedAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
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
  joinedAt: string;
  activeInterviews: number;
}

export interface AppSettings {
  companyName: string;
  companyWebsite: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark';
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  team: TeamMember[];
  currentUser: TeamMember;
  settings: AppSettings;
}
