import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context';
import { Search, Plus, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import type { Candidate } from '@/types/index';

export default function CandidatesPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', currentRole: '', summary: '' });

  const filtered = state.candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.currentRole || '').toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    const now = new Date().toISOString();
    const newCandidate: Candidate = {
      id: `c-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      currentRole: form.currentRole.trim(),
      summary: form.summary.trim(),
      skills: [],
      experience: [],
      education: [],
      status: 'active',
      source: 'manual',
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_CANDIDATE', payload: newCandidate });
    setForm({ name: '', email: '', phone: '', location: '', currentRole: '', summary: '' });
    setShowModal(false);
  }

  const statusColor: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
    active: 'success',
    inactive: 'default',
    hired: 'warning',
    blacklisted: 'danger',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '7px 12px', flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--color-text)', width: '100%' }}
            placeholder="Search candidates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowModal(true)} size="sm">
          <Plus size={15} /> Add Candidate
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users size={24} />}
            title="No candidates found"
            description={search ? 'Try a different search term.' : 'Add your first candidate to get started.'}
            action={!search && <Button size="sm" onClick={() => setShowModal(true)}><Plus size={14} /> Add Candidate</Button>}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(candidate => {
            const appCount = state.applications.filter(a => a.candidateId === candidate.id).length;
            return (
              <Card key={candidate.id} hover onClick={() => navigate(`/candidates/${candidate.id}`)} padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0
                  }}>
                    {candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{candidate.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{candidate.currentRole || candidate.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{appCount} application{appCount !== 1 ? 's' : ''}</span>
                    <Badge variant={statusColor[candidate.status] || 'default'}>{candidate.status}</Badge>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(candidate.createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" type="email" required />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 000 0000" />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="San Francisco, CA" />
          <Input label="Current Role" value={form.currentRole} onChange={e => setForm(f => ({ ...f, currentRole: e.target.value }))} placeholder="Senior Engineer" />
          <Textarea label="Summary" value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="Brief bio..." rows={3} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name.trim() || !form.email.trim()}>Add Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
