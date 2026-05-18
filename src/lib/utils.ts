import { JobStatus, ApplicationStatus, InterviewStatus, CandidateStatus } from '@/types';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr: string, timeStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return timeStr ? `${datePart} at ${timeStr}` : datePart;
}

export function getStatusColor(status: JobStatus | ApplicationStatus | InterviewStatus | CandidateStatus): string {
  switch (status) {
    case 'open':
    case 'hired':
    case 'completed':
    case 'accepted':
      return 'success';
    case 'closed':
    case 'rejected':
    case 'cancelled':
    case 'no_show':
      return 'danger';
    case 'draft':
    case 'new':
    case 'applied':
      return 'default';
    case 'paused':
    case 'screening':
    case 'reviewing':
      return 'warning';
    case 'interview':
    case 'shortlisted':
    case 'scheduled':
      return 'info';
    case 'offer':
      return 'accent';
    default:
      return 'default';
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? singular + 's');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
