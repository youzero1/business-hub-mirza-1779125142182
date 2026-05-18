import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context';
import { ArrowLeft, MapPin, Clock, Users, Edit, Trash2, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, getStatusColor } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/index';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const job = state.jobs.find(j => j.id === jobId);
  const applications = state.applications.filter(a => a.jobId === jobId);

  if (!job) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Job not found.</p>
        <Button onClick={() => navigate('/jobs')} variant="secondary" size="sm">Back to Jobs</Button>
      </div>
    );
  }

  const candidatesForJob = applications.map(app => {
    const candidate = state.candidates.find(c => c.id === app.candidateId);
    return { app, candidate };
  }).filter(item => item.candidate);

  function handleDeleteJob() {
    if (window.confirm('Delete this job posting?')) {
      dispatch({ type: 'DELETE_JOB', payload: job!.id });
      navigate('/jobs');
    }
  }

  const statusVariant: Record<ApplicationStatus, 'default' | 'primary' | 'warning' | 'success' | 'danger' | 'info' | 'accent'> = {
    applied: 'default',
    screening: 'info',
    interview: 'primary',
    offer: 'accent',
    hired: 'success',
    rejected: 'danger',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>{job.title}</h1>
              <Badge variant={job.status === 'open' ? 'success' : job.status === 'paused' ? 'warning' : 'default'}>
                {job.status}
              </Badge>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <MapPin size={14} /> {job.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <Clock size={14} /> {job.type}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <Users size={14} /> {applications.length} applicants
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={handleDeleteJob}>
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>

        {job.description && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>Description</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.description}</p>
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>Requirements</h3>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {job.requirements.map((req, i) => (
                <li key={i} style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Applicants ({applications.length})</h2>
        </div>
        {candidatesForJob.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px 0' }}>No applicants yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidatesForJob.map(({ app, candidate }) => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/candidates/${candidate!.id}`)}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'white', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0
                }}>
                  {candidate!.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)' }}>{candidate!.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{candidate!.email}</div>
                </div>
                <Badge variant={statusVariant[app.status] || 'default'}>{app.status}</Badge>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(app.appliedAt)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
