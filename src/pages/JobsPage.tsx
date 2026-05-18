import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Briefcase, MapPin, Users, Clock } from 'lucide-react';
import { useApp } from '@/lib/context';
import type { Job, JobType, JobStatus, ExperienceLevel } from '@/types/index';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import styles from './JobsPage.module.css';

const statusColors: Record<JobStatus, 'success' | 'default' | 'warning' | 'danger'> = {
  open: 'success',
  closed: 'default',
  draft: 'warning',
  paused: 'danger',
};

const typeLabels: Record<JobType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

type JobForm = {
  title: string;
  department: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  description: string;
  requirements: string;
  salaryMin: string;
  salaryMax: string;
};

const defaultForm: JobForm = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  experienceLevel: 'mid',
  status: 'open',
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
};

export default function JobsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<JobForm>(defaultForm);
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');

  const filtered = state.jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function setField<K extends keyof JobForm>(key: K, value: JobForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    if (!form.title.trim()) return;
    const job: Job = {
      id: crypto.randomUUID(),
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      experienceLevel: form.experienceLevel,
      status: form.status,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      salary: form.salaryMin ? { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: 'USD' } : undefined,
      postedDate: new Date().toISOString(),
      hiringManagerId: state.currentUser.id,
      teamMemberIds: [],
      tags: [],
    };
    dispatch({ type: 'ADD_JOB', payload: job });
    setShowModal(false);
    setForm(defaultForm);
  }

  const statusOptions: { value: JobStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'draft', label: 'Draft' },
    { value: 'paused', label: 'Paused' },
  ];

  return (
    <div className={styles.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              style={{ paddingLeft: 32, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px 8px 32px', color: 'var(--color-text)', fontSize: 13, outline: 'none', width: '100%' }}
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as JobStatus | 'all')}
            options={statusOptions}
          />
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={15} /> New Job</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Briefcase size={28} />} title="No jobs found" description="Create a new job posting to get started." action={<Button onClick={() => setShowModal(true)}>Create Job</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(job => {
            const appCount = state.candidates.filter(c => c.appliedJobId === job.id).length;
            return (
              <Card key={job.id} hover onClick={() => navigate(`/jobs/${job.id}`)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--color-text)', marginBottom: 3 }}>{job.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{job.department}</div>
                  </div>
                  <Badge variant={statusColors[job.status]}>{job.status}</Badge>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--color-text-muted)' }}><MapPin size={13} />{job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--color-text-muted)' }}><Clock size={13} />{typeLabels[job.type]}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--color-text-muted)' }}><Users size={13} />{appCount} applicants</span>
                </div>
                {job.salary && (
                  <div style={{ fontSize: 12.5, color: 'var(--color-success)', fontWeight: 600 }}>
                    ${job.salary.min.toLocaleString()} – ${job.salary.max.toLocaleString()}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post New Job" size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Job Title" value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Senior Frontend Engineer" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Department" value={form.department} onChange={e => setField('department', e.target.value)} placeholder="Engineering" />
            <Input label="Location" value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Remote / City" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Select
              label="Type"
              value={form.type}
              onChange={e => setField('type', e.target.value as JobType)}
              options={[
                { value: 'full_time', label: 'Full Time' },
                { value: 'part_time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
                { value: 'remote', label: 'Remote' },
              ]}
            />
            <Select
              label="Experience Level"
              value={form.experienceLevel}
              onChange={e => setField('experienceLevel', e.target.value as ExperienceLevel)}
              options={[
                { value: 'entry', label: 'Entry' },
                { value: 'mid', label: 'Mid' },
                { value: 'senior', label: 'Senior' },
                { value: 'lead', label: 'Lead' },
                { value: 'executive', label: 'Executive' },
              ]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => setField('status', e.target.value as JobStatus)}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'draft', label: 'Draft' },
                { value: 'paused', label: 'Paused' },
              ]}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Min Salary (USD)" value={form.salaryMin} onChange={e => setField('salaryMin', e.target.value)} placeholder="80000" type="number" />
            <Input label="Max Salary (USD)" value={form.salaryMax} onChange={e => setField('salaryMax', e.target.value)} placeholder="120000" type="number" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>Description</label>
            <textarea
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '9px 12px', color: 'var(--color-text)', fontSize: 13.5, outline: 'none', resize: 'vertical', minHeight: 80, fontFamily: 'inherit' }}
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Job description..."
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>Requirements (one per line)</label>
            <textarea
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '9px 12px', color: 'var(--color-text)', fontSize: 13.5, outline: 'none', resize: 'vertical', minHeight: 80, fontFamily: 'inherit' }}
              value={form.requirements}
              onChange={e => setField('requirements', e.target.value)}
              placeholder="5+ years experience\nStrong TypeScript skills"
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Post Job</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
