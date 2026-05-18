import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context';
import { formatDate, formatSalary, getStatusColor } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/index';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Users } from 'lucide-react';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Job not found.</p>
      <Button onClick={() => navigate('/jobs')} variant="secondary" size="sm">Back to Jobs</Button>
    </div>
  );

  const candidates = state.candidates.filter(c => c.appliedJobId === job.id);

  const stages: { key: ApplicationStatus; label: string }[] = [
    { key: 'applied', label: 'Applied' },
    { key: 'screening', label: 'Screening' },
    { key: 'interview', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
    { key: 'hired', label: 'Hired' },
    { key: 'rejected', label: 'Rejected' },
  ];

  function moveStage(candidateId: string, newStatus: ApplicationStatus) {
    const candidate = state.candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    dispatch({ type: 'UPDATE_CANDIDATE', payload: { ...candidate, status: newStatus } });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>{job.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, color: 'var(--color-text-muted)', fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Briefcase size={14} />{job.department}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14} />{job.location}</span>
              {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><DollarSign size={14} />{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={14} />Posted {formatDate(job.createdAt)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={14} />{candidates.length} applicants</span>
            </div>
          </div>
          <Badge variant={getStatusColor(job.status) as 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent'}>
            {job.status}
          </Badge>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {stages.map(stage => {
            const stageCandidates = candidates.filter(c => c.status === stage.key);
            return (
              <Card key={stage.key} padding="none">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{stage.label}</h3>
                  <Badge variant="default">{stageCandidates.length}</Badge>
                </div>
                {stageCandidates.length === 0 ? (
                  <EmptyState title="No candidates" description={`No candidates in ${stage.label} stage.`} />
                ) : (
                  <div>
                    {stageCandidates.map(candidate => (
                      <div
                        key={candidate.id}
                        style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)' }}>{candidate.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{candidate.currentRole || candidate.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                          {stages.filter(s => s.key !== stage.key && s.key !== 'rejected').map(s => (
                            <Button key={s.key} size="sm" variant="ghost" onClick={() => moveStage(candidate.id, s.key)}>
                              → {s.label}
                            </Button>
                          ))}
                          <Button size="sm" variant="ghost" onClick={() => moveStage(candidate.id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>Job Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Type</span><div style={{ fontSize: 13.5, color: 'var(--color-text)', fontWeight: 500, marginTop: 2 }}>{job.type.replace('_', ' ')}</div></div>
              <div><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Department</span><div style={{ fontSize: 13.5, color: 'var(--color-text)', fontWeight: 500, marginTop: 2 }}>{job.department}</div></div>
              <div><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Location</span><div style={{ fontSize: 13.5, color: 'var(--color-text)', fontWeight: 500, marginTop: 2 }}>{job.location}</div></div>
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>Requirements</h3>
            <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {job.requirements.map((req, i) => (
                <li key={i} style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{req}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>Description</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{job.description}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
