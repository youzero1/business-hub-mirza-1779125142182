import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/context';
import { Job, JobStatus, JobType, ExperienceLevel } from '@/types/index';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import styles from './JobsPage.module.css';

const statusVariant: Record<JobStatus, 'default' | 'info' | 'primary' | 'success' | 'danger' | 'warning'> = {
  open: 'success',
  closed: 'danger',
  draft: 'default',
  published: 'success',
};

const jobTypeOptions: { value: JobType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

const experienceLevelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
];

type JobForm = {
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  experienceLevel: ExperienceLevel;
  openings: number;
};

const defaultForm: JobForm = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  status: 'open',
  description: '',
  experienceLevel: 'mid',
  openings: 1,
};

export default function JobsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(defaultForm);
  const [search, setSearch] = useState('');

  const filtered = state.jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditJob(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(job: Job) {
    setEditJob(job);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      experienceLevel: job.experienceLevel,
      openings: job.openings,
    });
    setShowModal(true);
  }

  function handleSubmit() {
    const now = new Date().toISOString();
    if (editJob) {
      dispatch({
        type: 'UPDATE_JOB',
        payload: {
          ...editJob,
          ...form,
          updatedAt: now,
        },
      });
    } else {
      dispatch({
        type: 'ADD_JOB',
        payload: {
          id: crypto.randomUUID(),
          ...form,
          requirements: [],
          applicantCount: 0,
          createdAt: now,
          updatedAt: now,
        },
      });
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this job?')) {
      dispatch({ type: 'DELETE_JOB', payload: id });
    }
  }

  function setField<K extends keyof JobForm>(key: K, value: JobForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 20 }}>Job Postings</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 2 }}>{state.jobs.length} total jobs</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> New Job</Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={28} />}
          title="No jobs found"
          description="Create your first job posting to get started."
          action={<Button onClick={openCreate}><Plus size={16} /> New Job</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(job => (
            <Card key={job.id} hover onClick={() => navigate(`/jobs/${job.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{job.title}</span>
                    <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                    <Badge variant="default">{job.experienceLevel}</Badge>
                  </div>
                  <div style={{ display: 'flex', gap: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={13} />{job.department}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} />{job.applicantCount} applicants</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(job)}><Edit2 size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editJob ? 'Edit Job' : 'New Job'}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editJob ? 'Save' : 'Create'}</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Job Title" value={form.title} onChange={e => setField('title', e.target.value)} required />
          <Input label="Department" value={form.department} onChange={e => setField('department', e.target.value)} required />
          <Input label="Location" value={form.location} onChange={e => setField('location', e.target.value)} />
          <Select
            label="Job Type"
            value={form.type}
            onChange={v => setField('type', v as JobType)}
            options={jobTypeOptions}
          />
          <Select
            label="Experience Level"
            value={form.experienceLevel}
            onChange={v => setField('experienceLevel', v as ExperienceLevel)}
            options={experienceLevelOptions}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={v => setField('status', v as JobStatus)}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
