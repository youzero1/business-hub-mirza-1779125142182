import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Zap, Send, Briefcase, MapPin, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import type { Candidate, Application } from '@/types/index';

export default function CandidatePortalPage() {
  const { state, dispatch } = useApp();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', currentRole: '', summary: '' });
  const [submitted, setSubmitted] = useState(false);

  const openJobs = state.jobs.filter(j => j.status === 'open');

  function handleApply(jobId: string) {
    setSelectedJob(jobId);
    setShowApplyModal(true);
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.email.trim() || !selectedJob) return;
    const now = new Date().toISOString();

    // Check if candidate already exists
    let candidate = state.candidates.find(c => c.email.toLowerCase() === form.email.toLowerCase());

    if (!candidate) {
      candidate = {
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
        source: 'portal',
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_CANDIDATE', payload: candidate });
    }

    const application: Application = {
      id: `a-${Date.now()}`,
      candidateId: candidate.id,
      jobId: selectedJob,
      status: 'applied',
      appliedAt: now,
      updatedAt: now,
      source: 'portal',
      notes: '',
      resume: '',
      coverLetter: '',
    };
    dispatch({ type: 'ADD_APPLICATION', payload: application });
    setSubmitted(true);
    setShowApplyModal(false);
    setForm({ name: '', email: '', phone: '', location: '', currentRole: '', summary: '' });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '0 0 60px' }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 32,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}>
          <Zap size={18} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-text)' }}>TalentFlow Careers</span>
      </header>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        {submitted && (
          <div style={{
            background: 'var(--color-success-light)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: 20,
            fontSize: 14,
            color: 'var(--color-success)',
            fontWeight: 500,
          }}>
            ✓ Your application has been submitted successfully!
          </div>
        )}

        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>Open Positions</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 28 }}>Join our team and help us build the future.</p>

        {openJobs.length === 0 ? (
          <Card padding="lg">
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Briefcase size={36} style={{ color: 'var(--color-text-muted)', marginBottom: 12 }} />
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>No open positions at this time.</p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {openJobs.map(job => (
              <Card key={job.id} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>{job.title}</h2>
                      <Badge variant="success">Open</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <MapPin size={13} /> {job.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <Clock size={13} /> {job.type}
                      </span>
                      {job.department && (
                        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{job.department}</span>
                      )}
                    </div>
                    {job.description && (
                      <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: 560 }}>
                        {job.description.length > 200 ? job.description.slice(0, 200) + '...' : job.description}
                      </p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleApply(job.id)}>
                    <Send size={14} /> Apply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Position" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" type="email" required />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 000 0000" />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="San Francisco, CA" />
          <Input label="Current Role" value={form.currentRole} onChange={e => setForm(f => ({ ...f, currentRole: e.target.value }))} placeholder="Software Engineer" />
          <Textarea label="Cover Letter / Summary" value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="Tell us about yourself..." rows={4} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.name.trim() || !form.email.trim()}>
              <Send size={14} /> Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
