import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import styles from './DashboardPage.module.css';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function DashboardPage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { jobs, candidates, interviews } = state;

  const stats = useMemo(() => {
    const openJobs = jobs.filter(j => j.status === 'open' || j.status === 'published').length;
    const activeCandidates = candidates.filter(c => !['hired', 'rejected'].includes(c.status)).length;
    const scheduledInterviews = interviews.filter(i => i.status === 'scheduled').length;
    const hiredThisMonth = candidates.filter(c => {
      if (c.status !== 'hired') return false;
      const updated = new Date(c.updatedAt);
      const now = new Date();
      return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear();
    }).length;
    return { openJobs, activeCandidates, scheduledInterviews, hiredThisMonth };
  }, [jobs, candidates, interviews]);

  const recentCandidates = useMemo(() =>
    [...candidates].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()).slice(0, 5),
    [candidates]
  );

  const upcomingInterviews = useMemo(() =>
    interviews
      .filter(i => i.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 5),
    [interviews]
  );

  return (
    <div className={styles.root}>
      <div className={styles.statsGrid}>
        <StatCard
          label="Open Jobs"
          value={stats.openJobs}
          icon={<Briefcase size={20} />}
          trend={{ value: 12, label: 'vs last month', positive: true }}
          color="var(--color-primary)"
        />
        <StatCard
          label="Active Candidates"
          value={stats.activeCandidates}
          icon={<Users size={20} />}
          trend={{ value: 8, label: 'vs last month', positive: true }}
          color="var(--color-success)"
        />
        <StatCard
          label="Scheduled Interviews"
          value={stats.scheduledInterviews}
          icon={<Calendar size={20} />}
          trend={{ value: 3, label: 'vs last month', positive: true }}
          color="var(--color-warning)"
        />
        <StatCard
          label="Hired This Month"
          value={stats.hiredThisMonth}
          icon={<TrendingUp size={20} />}
          trend={{ value: 25, label: 'vs last month', positive: true }}
          color="var(--color-accent)"
        />
      </div>

      <div className={styles.grid2}>
        <Card>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Candidates</h2>
            <button className={styles.viewAll} onClick={() => navigate('/candidates')}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.list}>
            {recentCandidates.map(candidate => (
              <div
                key={candidate.id}
                className={styles.listItem}
                onClick={() => navigate(`/candidates/${candidate.id}`)}
              >
                <div className={styles.candidateAvatar}>
                  {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.candidateInfo}>
                  <span className={styles.candidateName}>{candidate.name}</span>
                  <span className={styles.candidateRole}>{candidate.jobTitle}</span>
                </div>
                <div className={styles.candidateMeta}>
                  <Badge variant={getStatusColor(candidate.status) as 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'primary'}>
                    {candidate.status}
                  </Badge>
                  <span className={styles.date}>{formatDate(candidate.appliedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Interviews</h2>
            <button className={styles.viewAll} onClick={() => navigate('/interviews')}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.list}>
            {upcomingInterviews.map(interview => (
              <div key={interview.id} className={styles.listItem}>
                <div className={styles.interviewIcon}>
                  <Calendar size={16} />
                </div>
                <div className={styles.candidateInfo}>
                  <span className={styles.candidateName}>{interview.candidateName}</span>
                  <span className={styles.candidateRole}>{interview.jobTitle} · {interview.type}</span>
                </div>
                <div className={styles.candidateMeta}>
                  <span className={styles.date}>{formatDate(interview.scheduledAt)}</span>
                  <div className={styles.interviewTime}>
                    <Clock size={12} />
                    {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pipeline Overview</h2>
        </div>
        <div className={styles.pipelineGrid}>
          {(['new', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const).map(status => {
            const count = candidates.filter(c => c.status === status).length;
            const Icon = status === 'hired' ? CheckCircle : status === 'rejected' ? XCircle : Users;
            return (
              <div key={status} className={styles.pipelineItem}>
                <div className={styles.pipelineIcon}>
                  <Icon size={18} />
                </div>
                <div className={styles.pipelineCount}>{count}</div>
                <div className={styles.pipelineLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
