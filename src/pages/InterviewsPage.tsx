import { useState } from 'react';
import { useApp } from '@/lib/context';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import type { Interview, InterviewType } from '@/types/index';

const typeOptions: { value: InterviewType; label: string }[] = [
  { value: 'phone', label: 'Phone Screen' },
  { value: 'video', label: 'Video Call' },
  { value: 'onsite', label: 'On-site' },
  { value: 'technical', label: 'Technical' },
  { value: 'cultural', label: 'Cultural Fit' },
];

export default function InterviewsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    type: 'video' as InterviewType,
    scheduledAt: '',
    duration: '60',
    location: '',
    notes: '',
  });

  const interviews = [...state.interviews].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  function handleAdd() {
    if (!form.candidateId || !form.jobId || !form.scheduledAt) return;
    const now = new Date().toISOString();
    const newInterview: Interview = {
      id: `i-${Date.now()}`,
      candidateId: form.candidateId,
      jobId: form.jobId,
      applicationId: '',
      type: form.type,
      status: 'scheduled',
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      duration: parseInt(form.duration) || 60,
      location: form.location.trim(),
      interviewers: [],
      notes: form.notes.trim(),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: newInterview });
    setForm({ candidateId: '', jobId: '', type: 'video', scheduledAt: '', duration: '60', location: '', notes: '' });
    setShowModal(false);
  }

  const candidateOptions = state.candidates.map(c => ({ value: c.id, label: c.name }));
  const jobOptions = state.jobs.filter(j => j.status === 'open').map(j => ({ value: j.id, label: j.title }));

  const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    scheduled: 'info',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'warning',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Schedule Interview
        </Button>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Calendar size={24} />}
            title="No interviews scheduled"
            description="Schedule your first interview to get started."
            action={<Button size="sm" onClick={() => setShowModal(true)}><Plus size={14} /> Schedule Interview</Button>}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {interviews.map(interview => {
            const candidate = state.candidates.find(c => c.id === interview.candidateId);
            const job = state.jobs.find(j => j.id === interview.jobId);
            return (
              <Card key={interview.id} padding="md" hover onClick={() => candidate && navigate(`/candidates/${candidate.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0
                  }}>
                    {(candidate?.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{candidate?.name || 'Unknown'}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{job?.title || 'Unknown Job'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <Badge variant={statusVariant[interview.status] || 'default'}>{interview.status.replace('_', ' ')}</Badge>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {interview.duration}min · {interview.type}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} /> {formatDate(interview.scheduledAt)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={e => setForm(f => ({ ...f, candidateId: e.target.value }))}
            options={[{ value: '', label: 'Select candidate...' }, ...candidateOptions]}
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))}
            options={[{ value: '', label: 'Select job...' }, ...jobOptions]}
          />
          <Select
            label="Interview Type"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as InterviewType }))}
            options={typeOptions}
          />
          <Input
            label="Date & Time"
            value={form.scheduledAt}
            onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
            type="datetime-local"
            required
          />
          <Input
            label="Duration (minutes)"
            value={form.duration}
            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            type="number"
            placeholder="60"
          />
          <Input
            label="Location / Meeting Link"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder="https://meet.google.com/..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.candidateId || !form.jobId || !form.scheduledAt}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
