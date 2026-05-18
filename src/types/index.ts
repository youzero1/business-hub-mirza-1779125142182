export type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer' | 'external';

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';

export type CandidateStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'technical'
  | 'offer'
  | 'hired'
  | 'rejected';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'panel';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  status: JobStatus;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
  postedAt?: string;
  closedAt?: string;
  hiringManagerId: string;
  recruiterId: string;
  stages: PipelineStage[];
  applicationCount: number;
  openings: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  type: CandidateStage;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  source: 'job_board' | 'referral' | 'linkedin' | 'manual' | 'portal' | 'agency';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  applications: Application[];
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  stage: CandidateStage;
  status: 'active' | 'rejected' | 'withdrawn' | 'hired';
  appliedAt: string;
  updatedAt: string;
  notes: Note[];
  score?: number;
  assignedTo?: string;
  rejectionReason?: string;
  offerAmount?: number;
  offerCurrency?: string;
  offerDate?: string;
}

export interface Note {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  type: 'comment' | 'stage_change' | 'email' | 'interview_note';
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: InterviewFeedback[];
  createdAt: string;
}

export interface InterviewFeedback {
  interviewerId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  recommendation: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  notes: string;
  submittedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  stage: CandidateStage;
  isActive: boolean;
}

export interface AppState {
  currentUser: User;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  emailTemplates: EmailTemplate[];
}
