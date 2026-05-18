import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Edit2, Trash2, Briefcase } from 'lucide-react';
import { useApp } from '@/lib/context';
import type { ApplicationStatus } from '@/types/index';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

const statusColors: Record<ApplicationStatus, 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
  applied: 'info',
  reviewing: 'primary',
  shortlisted: 'warning',
  rejected: 'danger',
  hired: 'success',
};

const typeLabels: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return <div style={{ padding: 32, color: 'var(--color-text-muted)' }}>Job not found.</div>;

  const candidates = state.candidates.filter(c => c.appliedJobId === job.id);

  const jobStatusColor: Record<string, 'success' | 'default' | 'warning' | 'danger'> = {
    open: 'success',
    closed: 'default',
    draft: 'warning',
    paused: 'danger',
  };

  function handleDelete() {
    if (confirm('Delete this job?')) {
      dispatch({ type: 'DELETE_JOB', payload: job!.id });
      navigate('/jobs');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" onClick={() => navigate('/jobs')}><ArrowLeft size={16} /> Back</Button>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>{job.title}</h1>
              <Badge variant={jobStatusColor[job.status]}>{job.status}</Badge>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--color-text-muted)', fontSize: 13.5 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14} />{job.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={14} />{typeLabels[job.type]}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={14} />{candidates.length} candidates</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm"><Edit2 size={14} /> Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
          </div>
        </div>

        {job.description && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>Description</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{job.description}</p>
          </div>
        )}

        {job.requirements.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>Requirements</h3>
            <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {job.requirements.map((r, i) => <li key={i} style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.salary && (
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 13.5, color: 'var(--color-success)', fontWeight: 600 }}>
              ${job.salary.min.toLocaleString()} – ${job.salary.max.toLocaleString()} {job.salary.currency}
            </span>
          </div>
        )}
      </Card>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--color-text)' }}>Candidates ({candidates.length})</h2>
        {candidates.length === 0 ? (
          <EmptyState icon={<Briefcase size={26} />} title="No candidates yet" description="Candidates who apply for this job will appear here." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidates.map(candidate => (
              <Card key={candidate.id} hover onClick={() => navigate(`/candidates/${candidate.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{candidate.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{candidate.currentRole || candidate.email}</div>
                  </div>
                  {candidate.applicationStatus && (
                    <Badge variant={statusColors[candidate.applicationStatus]}>{candidate.applicationStatus}</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
