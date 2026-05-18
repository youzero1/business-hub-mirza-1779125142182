import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Search, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/context';
import { formatDate, getJobStatusLabel, formatSalary } from '@/lib/utils';
import { Job, JobStatus, JobType, ExperienceLevel } from '@/types/index';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';

type JobFormState = {
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
};

const defaultForm: JobFormState = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  status: 'draft',
  experienceLevel: 'mid',
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
};

const statusVariantMap: Record<JobStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
  draft: 'default',
  published: 'success',
  closed: 'danger',
  on_hold: 'warning',
};

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function JobsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobFormState>(defaultForm);

  const addJob = (job: Job) => dispatch({ type: 'ADD_JOB', payload: job });
  const updateJob = (job: Job) => dispatch({ type: 'UPDATE_JOB', payload: job });
  const deleteJob = (id: string) => dispatch({ type: 'DELETE_JOB', payload: id });

  const filtered = state.jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

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
      experienceLevel: job.experienceLevel,
      description: job.description,
      requirements: job.requirements.join('\n'),
      salaryMin: job.salary?.min?.toString() ?? '',
      salaryMax: job.salary?.max?.toString() ?? '',
      currency: job.salary?.currency ?? 'USD',
    });
    setShowModal(true);
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.department.trim()) return;
    const salary =
      form.salaryMin || form.salaryMax
        ? {
            min: form.salaryMin ? parseInt(form.salaryMin) : 0,
            max: form.salaryMax ? parseInt(form.salaryMax) : 0,
            currency: form.currency || 'USD',
          }
        : undefined;

    if (editJob) {
      updateJob({
        ...editJob,
        title: form.title,
        department: form.department,
        location: form.location,
        type: form.type,
        status: form.status,
        experienceLevel: form.experienceLevel,
        description: form.description,
        requirements: form.requirements.split('\n').filter(Boolean),
        salary,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const now = new Date().toISOString();
      addJob({
        id: generateId(),
        title: form.title,
        department: form.department,
        location: form.location,
        type: form.type,
        status: form.status,
        experienceLevel: form.experienceLevel,
        description: form.description,
        requirements: form.requirements.split('\n').filter(Boolean),
        salary,
        createdAt: now,
        updatedAt: now,
        applicationCount: 0,
      });
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this job posting?')) {
      deleteJob(id);
    }
  }

  function setField<K extends keyof JobFormState>(key: K, value: JobFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>Job Postings</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {state.jobs.length} total positions
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New Job
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '7px 12px',
            flex: 1,
            minWidth: 200,
          }}
        >
          <Search size={15} style={{ color: 'var(--color-text-muted)' }} />
          <input
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text)',
              fontSize: 13,
              width: '100%',
            }}
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'all')}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'closed', label: 'Closed' },
            { value: 'on_hold', label: 'On Hold' },
          ]}
        />
      </div>

      {/* Job List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={24} />}
          title="No jobs found"
          description="Create a new job posting to get started."
          action={<Button onClick={openCreate}>Create Job</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((job) => (
            <Card key={job.id} hover padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      {job.title}
                    </span>
                    <Badge variant={statusVariantMap[job.status]}>
                      {getJobStatusLabel(job.status)}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                    {job.department} &middot; {job.location}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {job.salary?.min && job.salary?.max && (
                      <Badge variant="info">
                        {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                      </Badge>
                    )}
                    <Badge variant="default">{job.type.replace('_', ' ')}</Badge>
                    <Badge variant="default">{job.experienceLevel}</Badge>
                    <Badge variant="default">{job.applicationCount ?? 0} applicants</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
                    {`Created ${formatDate(job.createdAt)}`}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                    <ExternalLink size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(job)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editJob ? 'Edit Job' : 'Create Job Posting'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editJob ? 'Save Changes' : 'Create Job'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Job Title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Department"
              value={form.department}
              onChange={(e) => setField('department', e.target.value)}
              placeholder="e.g. Engineering"
              required
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setField('location', e.target.value)}
              placeholder="e.g. Remote, New York"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select
              label="Job Type"
              value={form.type}
              onChange={(e) => setField('type', e.target.value as JobType)}
              options={[
                { value: 'full_time', label: 'Full Time' },
                { value: 'part_time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
              ]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setField('status', e.target.value as JobStatus)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'closed', label: 'Closed' },
                { value: 'on_hold', label: 'On Hold' },
              ]}
            />
          </div>
          <Select
            label="Experience Level"
            value={form.experienceLevel}
            onChange={(e) => setField('experienceLevel', e.target.value as ExperienceLevel)}
            options={[
              { value: 'entry', label: 'Entry Level' },
              { value: 'mid', label: 'Mid Level' },
              { value: 'senior', label: 'Senior' },
              { value: 'lead', label: 'Lead' },
              { value: 'executive', label: 'Executive' },
            ]}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Input
              label="Min Salary"
              value={form.salaryMin}
              onChange={(e) => setField('salaryMin', e.target.value)}
              type="number"
              placeholder="e.g. 80000"
            />
            <Input
              label="Max Salary"
              value={form.salaryMax}
              onChange={(e) => setField('salaryMax', e.target.value)}
              type="number"
              placeholder="e.g. 120000"
            />
            <Select
              label="Currency"
              value={form.currency}
              onChange={(e) => setField('currency', e.target.value)}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>Description</label>
            <textarea
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 12px',
                color: 'var(--color-text)',
                fontSize: 13,
                outline: 'none',
                resize: 'vertical',
                minHeight: 80,
                fontFamily: 'inherit',
              }}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Describe the role..."
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>Requirements (one per line)</label>
            <textarea
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 12px',
                color: 'var(--color-text)',
                fontSize: 13,
                outline: 'none',
                resize: 'vertical',
                minHeight: 80,
                fontFamily: 'inherit',
              }}
              value={form.requirements}
              onChange={(e) => setField('requirements', e.target.value)}
              placeholder="5+ years of experience&#10;Proficiency in TypeScript"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
