import { useState } from 'react';
import { Plus, UserCheck } from 'lucide-react';
import { useApp } from '@/lib/context';
import type { TeamMember, UserRole } from '@/types/index';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';

const roleColors: Record<UserRole, 'default' | 'info' | 'primary' | 'accent' | 'warning'> = {
  admin: 'primary',
  recruiter: 'info',
  hiring_manager: 'accent',
  interviewer: 'warning',
  external: 'default',
};

export default function TeamPage() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'recruiter' as UserRole,
    department: '',
  });

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    const member: TeamMember = {
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      role: form.role,
      department: form.department,
      isActive: true,
      joinedDate: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: member });
    setShowModal(false);
    setForm({ name: '', email: '', role: 'recruiter', department: '' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => setShowModal(true)}><Plus size={15} /> Add Member</Button>
      </div>

      {state.team.length === 0 ? (
        <EmptyState icon={<UserCheck size={28} />} title="No team members" description="Add team members to collaborate." action={<Button onClick={() => setShowModal(true)}>Add Member</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {state.team.map(member => (
            <Card key={member.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{member.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant={roleColors[member.role]}>{member.role.replace('_', ' ')}</Badge>
                {member.department && <Badge variant="default">{member.department}</Badge>}
                <Badge variant={member.isActive ? 'success' : 'default'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Team Member" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required />
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
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
