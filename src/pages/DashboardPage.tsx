import { useApp } from '@/lib/context';
import { formatDate, timeAgo } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  const openJobs = state.jobs.filter(j => j.status === 'open').length;
  const totalCandidates = state.candidates.length;
  const scheduledInterviews = state.interviews.filter(i => i.status === 'scheduled').length;
  const hiredThisMonth = state.candidates.filter(c => c.status === 'hired').length;

  const recentCandidates = [...state.candidates]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  const upcomingInterviews = state.interviews
    .filter(i => i.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 4);

  const statusBadgeVariant: Record<string, 'default' | 'primary' | 'warning' | 'info' | 'accent' | 'success' | 'danger'> = {
    applied: 'default',
    screening: 'info',
    interview: 'primary',
    offer: 'accent',
    hired: 'success',
    rejected: 'danger',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard
          title="Open Positions"
          value={openJobs}
          icon={<Briefcase size={20} />}
          trend={{ value: 2, label: 'vs last month', positive: true }}
          color="primary"
        />
        <StatCard
          title="Total Candidates"
          value={totalCandidates}
          icon={<Users size={20} />}
          trend={{ value: 12, label: 'new this week', positive: true }}
          color="info"
        />
        <StatCard
          title="Scheduled Interviews"
          value={scheduledInterviews}
          icon={<Calendar size={20} />}
          trend={{ value: 3, label: 'this week', positive: true }}
          color="accent"
        />
        <StatCard
          title="Hired This Month"
          value={hiredThisMonth}
          icon={<TrendingUp size={20} />}
          trend={{ value: 1, label: 'vs last month', positive: true }}
          color="success"
        />
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Candidates */}
        <Card padding="none">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Recent Applications</h2>
            <button
              onClick={() => navigate('/candidates')}
              style={{ fontSize: 12.5, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div>
            {recentCandidates.map(candidate => (
              <div
                key={candidate.id}
                onClick={() => navigate(`/candidates/${candidate.id}`)}
                style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.currentRole || candidate.email}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Badge variant={statusBadgeVariant[candidate.status] || 'default'}>{candidate.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Interviews */}
        <Card padding="none">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Upcoming Interviews</h2>
            <button
              onClick={() => navigate('/interviews')}
              style={{ fontSize: 12.5, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div>
            {upcomingInterviews.map(interview => {
              const candidate = state.candidates.find(c => c.id === interview.candidateId);
              const job = state.jobs.find(j => j.id === interview.jobId);
              return (
                <div
                  key={interview.id}
                  style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)' }}>{candidate?.name || 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{job?.title} · {interview.type}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-subtle)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} />
                      {formatDate(interview.scheduledAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            {upcomingInterviews.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                No upcoming interviews
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Job Pipeline */}
      <Card padding="none">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Active Job Pipeline</h2>
          <button
            onClick={() => navigate('/jobs')}
            style={{ fontSize: 12.5, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
          >
            View all <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {state.jobs.filter(j => j.status === 'open').map(job => {
            const jobCandidates = state.candidates.filter(c => c.appliedJobId === job.id);
            const stages = [
              { label: 'Applied', key: 'applied', color: 'var(--color-text-muted)' },
              { label: 'Screening', key: 'screening', color: 'var(--color-info)' },
              { label: 'Interview', key: 'interview', color: 'var(--color-primary)' },
              { label: 'Offer', key: 'offer', color: 'var(--color-accent)' },
              { label: 'Hired', key: 'hired', color: 'var(--color-success)' },
            ];

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: '12px 16px', cursor: 'pointer', border: '1px solid var(--color-border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-3)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text)' }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{job.department} · {job.location}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {jobCandidates.length > 0 ? (
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{jobCandidates.length} candidates</span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>No candidates yet</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {stages.map(stage => {
                    const count = jobCandidates.filter(c => c.status === stage.key).length;
                    return (
                      <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: count > 0 ? stage.color : 'var(--color-text-subtle)' }}>{count}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--color-text-muted)' }}>{stage.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {state.jobs.filter(j => j.status === 'open').length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
              No open jobs
            </div>
          )}
        </div>
      </Card>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Quick stats */}
        <Card>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Pipeline Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Applications Review', count: state.candidates.filter(c => c.status === 'applied').length, icon: <AlertCircle size={15} />, color: 'var(--color-text-muted)' },
              { label: 'In Screening', count: state.candidates.filter(c => c.status === 'screening').length, icon: <Clock size={15} />, color: 'var(--color-info)' },
              { label: 'In Interviews', count: state.candidates.filter(c => c.status === 'interview').length, icon: <Calendar size={15} />, color: 'var(--color-primary)' },
              { label: 'Offer Extended', count: state.candidates.filter(c => c.status === 'offer').length, icon: <CheckCircle size={15} />, color: 'var(--color-accent)' },
              { label: 'Hired', count: state.candidates.filter(c => c.status === 'hired').length, icon: <CheckCircle size={15} />, color: 'var(--color-success)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: item.color }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--color-text)', flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentCandidates.slice(0, 4).map(candidate => (
              <div key={candidate.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 500 }}>{candidate.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}> applied for </span>
                  <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{state.jobs.find(j => j.id === candidate.appliedJobId)?.title || 'a position'}</span>
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--color-text-subtle)', flexShrink: 0 }}>{timeAgo(candidate.appliedAt)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
