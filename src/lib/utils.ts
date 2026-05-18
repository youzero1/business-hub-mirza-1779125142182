import type { JobStatus, ApplicationStatus, InterviewStatus, InterviewType } from '@/types/index';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatSalary(min: number, max: number, currency = 'USD'): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  return `${fmt(min)} – ${fmt(max)}`;
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function getStatusColor(status: ApplicationStatus | JobStatus | InterviewStatus): string {
  const map: Record<string, string> = {
    applied: 'default',
    screening: 'info',
    interview: 'primary',
    offer: 'accent',
    hired: 'success',
    rejected: 'danger',
    draft: 'default',
    open: 'success',
    paused: 'warning',
    closed: 'danger',
    scheduled: 'primary',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'warning',
  };
  return map[status] || 'default';
}

export function getJobStatusLabel(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    draft: 'Draft',
    open: 'Open',
    paused: 'Paused',
    closed: 'Closed',
  };
  return map[status] || status;
}

export function getInterviewTypeLabel(type: InterviewType): string {
  const map: Record<InterviewType, string> = {
    phone: 'Phone Screen',
    video: 'Video Call',
    onsite: 'On-site',
    technical: 'Technical',
    behavioral: 'Behavioral',
  };
  return map[type] || type;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}
