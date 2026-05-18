import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import type { CandidateStage, JobStatus, UserRole, InterviewType, InterviewStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSalary(min: number, max: number, currency = 'USD'): string {
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  return `${fmt.format(min)} – ${fmt.format(max)}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function stageLabel(stage: CandidateStage): string {
  const map: Record<CandidateStage, string> = {
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    technical: 'Technical',
    offer: 'Offer',
    hired: 'Hired',
    rejected: 'Rejected',
  };
  return map[stage];
}

export function stageColor(stage: CandidateStage): string {
  const map: Record<CandidateStage, string> = {
    applied: '#6c63ff',
    screening: '#3b82f6',
    interview: '#f59e0b',
    technical: '#06b6d4',
    offer: '#22c55e',
    hired: '#22c55e',
    rejected: '#ef4444',
  };
  return map[stage];
}

export function jobStatusLabel(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    draft: 'Draft',
    open: 'Open',
    paused: 'Paused',
    closed: 'Closed',
  };
  return map[status];
}

export function jobStatusColor(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    draft: 'var(--color-text-muted)',
    open: 'var(--color-success)',
    paused: 'var(--color-warning)',
    closed: 'var(--color-danger)',
  };
  return map[status];
}

export function roleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    admin: 'Admin',
    recruiter: 'Recruiter',
    hiring_manager: 'Hiring Manager',
    interviewer: 'Interviewer',
    external: 'External',
  };
  return map[role];
}

export function interviewTypeLabel(type: InterviewType): string {
  const map: Record<InterviewType, string> = {
    phone: 'Phone Screen',
    video: 'Video Call',
    onsite: 'On-site',
    technical: 'Technical',
    panel: 'Panel Interview',
  };
  return map[type];
}

export function interviewStatusLabel(status: InterviewStatus): string {
  const map: Record<InterviewStatus, string> = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };
  return map[status];
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
}
