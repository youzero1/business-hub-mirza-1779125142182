import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Plus } from 'lucide-react';
import { useApp } from '@/lib/context';
import type { Candidate, CandidateStatus, ApplicationStatus } from '@/types/index';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const statusColors: Record<CandidateStatus, 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'accent'> = {
  new: 'info',
  screening: 'primary',
  interview: 'accent',
  offer: 'warning',
  hired: 'success',
  rejected: 'danger',
};

export default function CandidatesPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', currentRole: '', skills: '', jobId: '' });
  const [applyForm, setApplyForm] = useState({ candidateId: '', jobId: '', status: 'applied' as ApplicationStatus });

  const filtered = state.candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.currentRole && c.currentRole.toLowerCase().includes(search.toLowerCase()))
  );

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    const candidate: Candidate = {
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      currentRole: form.currentRole || undefined,
      status: 'new',
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      notes: '',
      appliedDate: new Date().toISOString(),
      tags: [],
    };
    dispatch({ type: 'ADD_CANDIDATE', payload: candidate });
    setShowAddModal(false);
    setForm({ name: '', email: '', phone: '', currentRole: '', skills: '', jobId: '' });
  }

  function handleApply() {
    if (!applyForm.candidateId || !applyForm.jobId) return;
    const candidate = state.candidates.find(c => c.id === applyForm.candidateId);
    if (!candidate) return;
    dispatch({
      type: 'UPDATE_CANDIDATE',
      payload: { ...candidate, appliedJobId: applyForm.jobId, applicationStatus: applyForm.status },
    });
    setShowApplyModal(false);
  }

  const jobOptions = state.jobs.map(j => ({ value: j.id, label: j.title }));
  const candidateOptions = state.candidates.map(c => ({ value: c.id, label: c.name }));
  const applicationStatusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'applied', label: 'Applied' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            style={{ paddingLeft: 32, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px 8px 32px', color: 'var(--color-text)', fontSize: 13, outline: 'none', width: '100%' }}
            placeholder="Search candidates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setShowApplyModal(true)}>Link to Job</Button>
          <Button onClick={() => setShowAddModal(true)}><Plus size={15} /> Add Candidate</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No candidates found" description="Add candidates manually or through job applications." action={<Button onClick={() => setShowAddModal(true)}>Add Candidate</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(candidate => (
            <Card key={candidate.id} hover onClick={() => navigate(`/candidates/${candidate.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {candidate.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{candidate.currentRole || candidate.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant={statusColors[candidate.status]}>{candidate.status}</Badge>
                {candidate.skills.length > 0 && (
                  <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>{candidate.skills.slice(0, 2).join(', ')}{candidate.skills.length > 2 ? ` +${candidate.skills.length - 2}` : ''}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Candidate" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Current Role" value={form.currentRole} onChange={e => setForm(f => ({ ...f, currentRole: e.target.value }))} />
          <Input label="Skills (comma separated)" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Candidate</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Position" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select label="Candidate" value={applyForm.candidateId} onChange={e => setApplyForm(f => ({ ...f, candidateId: e.target.value }))} options={[{ value: '', label: 'Select candidate...' }, ...candidateOptions]} />
          <Select label="Job" value={applyForm.jobId} onChange={e => setApplyForm(f => ({ ...f, jobId: e.target.value }))} options={[{ value: '', label: 'Select job...' }, ...jobOptions]} />
          <Select label="Application Status" value={applyForm.status} onChange={e => setApplyForm(f => ({ ...f, status: e.target.value as ApplicationStatus }))} options={applicationStatusOptions} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Cancel</Button>
            <Button onClick={handleApply}>Link Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
