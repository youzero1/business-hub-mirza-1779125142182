import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Briefcase, MapPin, Users, ChevronRight, Filter } from 'lucide-react';
import { useApp } from '@/lib/context';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, jobStatusLabel, formatSalary, generateId } from '@/lib/utils';
import type { Job, JobStatus } from '@/types';
import styles from './JobsPage.module.css';

type JobStatusBadge = 'success' | 'warning' | 'danger' | 'default';

function statusToBadge(status: JobStatus): JobStatusBadge {
  if (status === 'open') return 'success';
  if (status === 'paused') return 'warning';
  if (status === 'closed') return 'danger';
  return 'default';
}

const defaultStages = [
  { id: 'ds1', name: 'Applied', order: 0, color: '#6c63ff', type: 'applied' as const },
  { id: 'ds2', name: 'Screening', order: 1, color: '#3b82f6', type: 'screening' as const },
  { id: 'ds3', name: 'Interview', order: 2, color: '#f59e0b', type: 'interview' as const },
  { id: 'ds4', name: 'Technical', order: 3, color: '#06b6d4', type: 'technical' as const },
  { id: 'ds5', name: 'Offer', order: 4, color: '#22c55e', type: 'offer' as const },
  { id: 'ds6', name: 'Hired', order: 5, color: '#22c55e', type: 'hired' as const },
];

export default function JobsPage() {
  const { state, addJob, updateJob, deleteJob } = useApp();
  const navigate = useNavigate();
  const { jobs, currentUser } = state;

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full_time' as Job['type'],
    status: 'open' as JobStatus,
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    openings: '1',
  });

  const departments = useMemo(() => {
    const depts = new Set(jobs.map(j => j.department));
    return Array.from(depts);
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || j.status === filterStatus;
      const matchDept = !filterDept || j.department === filterDept;
      return matchSearch && matchStatus && matchDept;
    });
  }, [jobs, search, filterStatus, filterDept]);

  function handleSubmit() {
    if (!form.title || !form.department || !form.location) return;
    const now = new Date().toISOString();
    const newJob: Job = {
      id: generateId(),
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      description: form.description,
      requirements: form.requirements.split('\n').filter(r => r.trim()),
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      currency: 'USD',
      createdAt: now,
      updatedAt: now,
      postedAt: form.status === 'open' ? now : undefined,
      hiringManagerId: currentUser.id,
      recruiterId: currentUser.id,
      stages: defaultStages,
      applicationCount: 0,
      openings: parseInt(form.openings) || 1,
    };
    addJob(newJob);
    setShowModal(false);
    setForm({ title: '', department: '', location: '', type: 'full_time', status: 'open', description: '', requirements: '', salaryMin: '', salaryMax: '', openings: '1' });
  }

  function handleStatusChange(job: Job, status: JobStatus) {
    updateJob({ ...job, status, updatedAt: new Date().toISOString() });
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <Search size={15} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <Filter size={14} />
            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className={styles.filterSelect}
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Post Job
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={24} />}
          title="No jobs found"
          description="Try adjusting your filters or post a new job position."
          action={<Button onClick={() => setShowModal(true)}>Post New Job</Button>}
        />
      ) : (
        <div className={styles.jobGrid}>
          {filtered.map(job => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobCardHeader}>
                <div className={styles.jobCardTitle} onClick={() => navigate(`/jobs/${job.id}`)}>
                  <h3>{job.title}</h3>
                  <div className={styles.jobCardMeta}>
                    <span className={styles.metaItem}><MapPin size={12} />{job.location}</span>
                    <span className={styles.metaItem}><Users size={12} />{job.applicationCount} applicants</span>
                  </div>
                </div>
                <Badge variant={statusToBadge(job.status)} dot>{jobStatusLabel(job.status)}</Badge>
              </div>
              <div className={styles.jobCardBody}>
                <div className={styles.jobMeta}>
                  <Badge variant="default">{job.department}</Badge>
                  <Badge variant="default">{job.type.replace('_', ' ')}</Badge>
                  {job.salaryMin && job.salaryMax && (
                    <span className={styles.salary}>
                      {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                    </span>
                  )}
                </div>
                {job.description && (
                  <p className={styles.description}>{job.description.slice(0, 120)}{job.description.length > 120 ? '...' : ''}</p>
                )}
                <div className={styles.requirements}>
                  {job.requirements.slice(0, 3).map((req, i) => (
                    <span key={i} className={styles.reqTag}>{req}</span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className={styles.reqTag}>+{job.requirements.length - 3} more</span>
                  )}
                </div>
              </div>
              <div className={styles.jobCardFooter}>
                <span className={styles.postedAt}>
                  {job.postedAt ? `Posted ${formatDate(job.postedAt)}` : `Created ${formatDate(job.createdAt)}`}
                </span>
                <div className={styles.jobActions}>
                  {job.status === 'open' && (
                    <button className={styles.actionBtn} onClick={() => handleStatusChange(job, 'paused')}>Pause</button>
                  )}
                  {job.status === 'paused' && (
                    <button className={styles.actionBtn} onClick={() => handleStatusChange(job, 'open')}>Reopen</button>
                  )}
                  {job.status === 'draft' && (
                    <button className={styles.actionBtn} onClick={() => handleStatusChange(job, 'open')}>Publish</button>
                  )}
                  <button
                    className={styles.actionBtnPrimary}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View <ChevronRight size={14} />
                  </button>
                  <button
                    className={styles.actionBtnDanger}
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post New Job" size="lg">
        <div className={styles.modalForm}>
          <div className={styles.formRow}>
            <Input
              label="Job Title"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior Frontend Engineer"
            />
            <Input
              label="Department"
              required
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              placeholder="e.g. Engineering"
            />
          </div>
          <div className={styles.formRow}>
            <Input
              label="Location"
              required
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Remote or New York, NY"
            />
            <Input
              label="Openings"
              type="number"
              value={form.openings}
              onChange={e => setForm(f => ({ ...f, openings: e.target.value }))}
              placeholder="1"
            />
          </div>
          <div className={styles.formRow}>
            <Select
              label="Employment Type"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as Job['type'] }))}
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
              onChange={e => setForm(f => ({ ...f, status: e.target.value as JobStatus }))}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'draft', label: 'Draft' },
                { value: 'paused', label: 'Paused' },
              ]}
            />
          </div>
          <div className={styles.formRow}>
            <Input
              label="Salary Min (USD)"
              type="number"
              value={form.salaryMin}
              onChange={e => setForm(f => ({ ...f, salaryMin: e.target.value }))}
              placeholder="e.g. 80000"
            />
            <Input
              label="Salary Max (USD)"
              type="number"
              value={form.salaryMax}
              onChange={e => setForm(f => ({ ...f, salaryMax: e.target.value }))}
              placeholder="e.g. 120000"
            />
          </div>
          <Textarea
            label="Job Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the role, responsibilities..."
            rows={3}
          />
          <Textarea
            label="Requirements (one per line)"
            value={form.requirements}
            onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
            placeholder="5+ years of React experience\nTypeScript expertise"
            rows={3}
          />
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Post Job</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
