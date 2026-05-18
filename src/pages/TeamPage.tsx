import { useState } from 'react';
import { useApp } from '@/lib/context';
import { UserCheck, Plus, Mail, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { TeamMember, UserRole } from '@/types/index';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'hiring_manager', label: 'Hiring Manager' },
  { value: 'interviewer', label: 'Interviewer' },
];

const roleVariant: Record<UserRole, 'default' | 'primary' | 'accent' | 'info' | 'warning'> = {
  admin: 'danger' as any,
  recruiter: 'primary',
  hiring_manager: 'accent',
  interviewer: 'info',
};

export default function TeamPage() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'recruiter' as UserRole, department: '' });

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    const now = new Date().toISOString();
    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      department: form.department.trim(),
      avatar: '',
      createdAt: now,
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
    setForm({ name: '', email: '', role: 'recruiter', department: '' });
    setShowModal(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Member
        </Button>
      </div>

      {state.team.length === 0 ? (
        <Card>
          <EmptyState
            icon={<UserCheck size={24} />}
            title="No team members"
            description="Add team members to collaborate on hiring."
            action={<Button size="sm" onClick={() => setShowModal(true)}><Plus size={14} /> Add Member</Button>}
          />
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {state.team.map(member => (
            <Card key={member.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--color-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15, flexShrink: 0,
                }}>
                  {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Mail size={11} /> {member.email}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge variant={roleVariant[member.role] as any}>{member.role.replace('_', ' ')}</Badge>
                {member.department && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{member.department}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Team Member" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Alex Johnson" required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="alex@company.com" type="email" required />
          <Select
            label="Role"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
            options={roleOptions}
          />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Engineering" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name.trim() || !form.email.trim()}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
