import { useState } from 'react';
import { useApp } from '@/lib/context';
import { formatDateTime, getInterviewTypeLabel } from '@/lib/utils';
import type { InterviewType, InterviewStatus } from '@/types/index';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, Plus, Clock } from 'lucide-react';

const typeOptions: { value: InterviewType; label: string }[] = [
  { value: 'phone', label: 'Phone Screen' },
  { value: 'video', label: 'Video Call' },
  { value: 'technical', label: 'Technical' },
  { value: 'onsite', label: 'On-site' },
  { value: 'behavioral', label: 'Behavioral' },
];

export default function InterviewsPage() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InterviewStatus | 'all'>('all');
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    type: 'phone' as InterviewType,
    scheduledAt: '',
    duration: '30',
    notes: '',
  });

  function handleSubmit() {
    if (!form.candidateId || !form.jobId || !form.scheduledAt) return;
    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_INTERVIEW',
      payload: {
        id: `int-${Date.now()}`,
        candidateId: form.candidateId,
        jobId: form.jobId,
        type: form.type,
        status: 'scheduled',
        scheduledAt: form.scheduledAt,
        duration: parseInt(form.duration, 10),
        interviewerIds: [],
        notes: form.notes,
        createdAt: now,
      },
    });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', type: 'phone', scheduledAt: '', duration: '30', notes: '' });
  }

  const candidateOptions = state.candidates.map(c => ({ value: c.id, label: c.name }));
  const jobOptions = state.jobs.filter(j => j.status === 'open').map(j => ({ value: j.id, label: j.title }));

  const filtered = filterStatus === 'all'
    ? state.interviews
    : state.interviews.filter(i => i.status === filterStatus);

  const statusVariant: Record<InterviewStatus, 'default' | 'primary' | 'success' | 'danger' | 'warning'> = {
    scheduled: 'primary',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'warning',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)' }}>Interviews</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Schedule Interview
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {(['all', 'scheduled', 'completed', 'cancelled', 'no_show'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              background: filterStatus === s ? 'var(--color-primary)' : 'var(--color-surface)',
              color: filterStatus === s ? 'white' : 'var(--color-text-muted)',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar size={24} />}
          title="No interviews found"
          description="Schedule an interview to get started."
          action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(interview => {
            const candidate = state.candidates.find(c => c.id === interview.candidateId);
            const job = state.jobs.find(j => j.id === interview.jobId);
            return (
              <Card key={interview.id} padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                    {(candidate?.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{candidate?.name || 'Unknown Candidate'}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{job?.title || 'Unknown Job'} · {getInterviewTypeLabel(interview.type)}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={12} />
                      {formatDateTime(interview.scheduledAt)} · {interview.duration} min
                    </div>
                  </div>
                  <Badge variant={statusVariant[interview.status]}>
                    {interview.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={e => setForm(f => ({ ...f, candidateId: e.target.value }))}
            options={candidateOptions}
          />
          <Select
            label="Job Position"
            value={form.jobId}
            onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))}
            options={jobOptions}
          />
          <Select
            label="Interview Type"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as InterviewType }))}
            options={typeOptions}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Date &amp; Time</label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                style={{ width: '100%', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '9px 12px', color: 'var(--color-text)', fontSize: 13.5, outline: 'none' }}
              />
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Duration (min)</label>
              <input
                type="number"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                style={{ width: '100%', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '9px 12px', color: 'var(--color-text)', fontSize: 13.5, outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
