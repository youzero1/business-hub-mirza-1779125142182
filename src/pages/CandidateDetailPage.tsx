import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '@/lib/context';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/index';

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const statusVariant: Record<ApplicationStatus, 'default' | 'primary' | 'warning' | 'success' | 'danger' | 'info' | 'accent'> = {
  applied: 'default',
  screening: 'info',
  interview: 'primary',
  offer: 'accent',
  hired: 'success',
  rejected: 'danger',
};

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const candidate = state.candidates.find(c => c.id === candidateId);
  const applications = state.applications.filter(a => a.candidateId === candidateId);

  if (!candidate) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Candidate not found.</p>
        <Button onClick={() => navigate('/candidates')} variant="secondary" size="sm">Back to Candidates</Button>
      </div>
    );
  }

  function handleStatusChange(appId: string, status: ApplicationStatus) {
    dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { id: appId, status } });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/candidates')}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--color-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 22, flexShrink: 0,
          }}>
            {candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{candidate.name}</h1>
            {candidate.currentRole && <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 10 }}>{candidate.currentRole}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <Mail size={13} /> {candidate.email}
              </span>
              {candidate.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <Phone size={13} /> {candidate.phone}
                </span>
              )}
              {candidate.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <MapPin size={13} /> {candidate.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {candidate.summary && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summary</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{candidate.summary}</p>
          </div>
        )}

        {candidate.skills && candidate.skills.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {candidate.skills.map((skill: string, i: number) => (
                <Badge key={i} variant="primary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card padding="lg">
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Applications ({applications.length})</h2>
        {applications.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>No applications yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {applications.map(app => {
              const job = state.jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                  <Briefcase size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{job?.title || 'Unknown Job'}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} /> Applied {formatDate(app.appliedAt)}
                    </div>
                  </div>
                  <Select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    options={statusOptions}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
