import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useApp } from '@/lib/context';
import type { Interview, InterviewType, InterviewStatus } from '@/types/index';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';

const typeOptions: { value: InterviewType; label: string }[] = [
  { value: 'phone', label: 'Phone' },
  { value: 'video', label: 'Video' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'technical', label: 'Technical' },
  { value: 'hr', label: 'HR' },
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
    duration: '60',
    interviewerIds: [] as string[],
    location: '',
    notes: '',
  });

  const statusOptions: { value: InterviewStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
  ];

  const statusColors: Record<InterviewStatus, 'default' | 'primary' | 'success' | 'danger' | 'warning'> = {
    scheduled: 'primary',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'warning',
  };

  const filtered = state.interviews.filter(i =>
    filterStatus === 'all' || i.status === filterStatus
  );

  function handleSubmit() {
    if (!form.candidateId || !form.jobId || !form.scheduledAt) return;
    const interview: Interview = {
      id: crypto.randomUUID(),
      candidateId: form.candidateId,
      jobId: form.jobId,
      type: form.type,
      status: 'scheduled',
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      duration: Number(form.duration),
      interviewerIds: form.interviewerIds,
      location: form.location || undefined,
      notes: form.notes || undefined,
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: interview });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', type: 'phone', scheduledAt: '', duration: '60', interviewerIds: [], location: '', notes: '' });
  }

  const candidateOptions = [
    { value: '', label: 'Select candidate...' },
    ...state.candidates.map(c => ({ value: c.id, label: c.name })),
  ];
  const jobOptions = [
    { value: '', label: 'Select job...' },
    ...state.jobs.map(j => ({ value: j.id, label: j.title })),
  ];

  function getCandidateName(id: string) {
    return state.candidates.find(c => c.id === id)?.name || 'Unknown';
  }
  function getJobTitle(id: string) {
    return state.jobs.find(j => j.id === id)?.title || 'Unknown';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {statusOptions.map(s => (
            <button
              key={s.value}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: filterStatus === s.value ? 'var(--color-primary)' : 'var(--color-surface-2)',
                color: filterStatus === s.value ? 'white' : 'var(--color-text-muted)',
                fontSize: 12.5,
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={() => setFilterStatus(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={15} /> Schedule Interview</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Calendar size={28} />} title="No interviews" description="Schedule interviews with candidates." action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(interview => (
            <Card key={interview.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--color-text)', marginBottom: 4 }}>
                    {getCandidateName(interview.candidateId)}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                    {getJobTitle(interview.jobId)} · {interview.type} · {interview.duration} min
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
                    {new Date(interview.scheduledAt).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <Badge variant={statusColors[interview.status]}>{interview.status.replace('_', ' ')}</Badge>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {interview.status === 'scheduled' && (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => dispatch({ type: 'UPDATE_INTERVIEW', payload: { ...interview, status: 'completed' } })}>Complete</Button>
                        <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'UPDATE_INTERVIEW', payload: { ...interview, status: 'cancelled' } })}>Cancel</Button>
                      </>
                    )}
                    <Button size="sm" variant="danger" onClick={() => dispatch({ type: 'DELETE_INTERVIEW', payload: interview.id })}>Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select label="Candidate" value={form.candidateId} onChange={e => setForm(f => ({ ...f, candidateId: e.target.value }))} options={candidateOptions} />
          <Select label="Job" value={form.jobId} onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))} options={jobOptions} />
          <Select label="Interview Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as InterviewType }))} options={typeOptions} />
          <Input label="Scheduled At" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} type="datetime-local" />
          <Input label="Duration (minutes)" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} type="number" />
          <Input label="Location / Link" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Zoom link or office address" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>Notes</label>
            <textarea
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '9px 12px', color: 'var(--color-text)', fontSize: 13.5, outline: 'none', resize: 'vertical', minHeight: 72, fontFamily: 'inherit' }}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
