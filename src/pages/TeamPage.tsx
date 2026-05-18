import { useState } from 'react';
import { useApp } from '@/lib/context';
import type { TeamMember, UserRole } from '@/types/index';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { UserCheck, Plus } from 'lucide-react';

const roleVariant: Record<UserRole, 'default' | 'primary' | 'accent' | 'info' | 'warning'> = {
  admin: 'primary' as const,
  recruiter: 'primary' as const,
  hiring_manager: 'accent' as const,
  interviewer: 'info' as const,
  external: 'default' as const,
};

export default function TeamPage() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'recruiter' as UserRole, department: '' });

  function handleAdd() {
    if (!form.name || !form.email) return;
    const member: TeamMember = {
      id: `member-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      department: form.department,
      joinedAt: new Date().toISOString(),
      isActive: true,
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: member });
    setShowModal(false);
    setForm({ name: '', email: '', role: 'recruiter', department: '' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)' }}>Team</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Member
        </Button>
      </div>

      {state.team.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={24} />}
          title="No team members"
          description="Add team members to collaborate on hiring."
          action={<Button onClick={() => setShowModal(true)}>Add Member</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {state.team.map(member => (
            <Card key={member.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                  {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{member.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{member.email}</div>
                  {member.department && <div style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 2 }}>{member.department}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <Badge variant={roleVariant[member.role]}>{member.role.replace('_', ' ')}</Badge>
                <Badge variant={member.isActive ? 'success' : 'default'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Team Member">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@company.com" type="email" required />
          <Select
            label="Role"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'recruiter', label: 'Recruiter' },
              { value: 'hiring_manager', label: 'Hiring Manager' },
              { value: 'interviewer', label: 'Interviewer' },
              { value: 'external', label: 'External' },
            ]}
          />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Engineering" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
