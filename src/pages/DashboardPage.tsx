import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/lib/context';
import { getStatusColor, formatDate, getInitials } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import styles from './DashboardPage.module.css';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { state } = useApp();
  const { jobs, candidates, interviews } = state;

  const openJobs = jobs.filter(j => j.status === 'open' || j.status === 'draft' || j.status === 'paused').length;

  const thisWeekInterviews = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return interviews.filter(i => {
      const d = new Date(i.date);
      return d >= startOfWeek && d <= endOfWeek;
    }).length;
  }, [interviews]);

  const recentCandidates = useMemo(
    () =>
      [...candidates]
        .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        .slice(0, 5),
    [candidates]
  );

  const upcomingInterviews = useMemo(
    () =>
      [...interviews]
        .filter(i => new Date(i.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5),
    [interviews]
  );

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <StatCard
          title="Open Jobs"
          value={openJobs}
          icon={<Briefcase size={20} />}
          variant="primary"
        />
        <StatCard
          title="Total Candidates"
          value={candidates.length}
          icon={<Users size={20} />}
          variant="success"
        />
        <StatCard
          title="Interviews This Week"
          value={thisWeekInterviews}
          icon={<Calendar size={20} />}
          variant="warning"
        />
        <StatCard
          title="Active Pipeline"
          value={candidates.filter(c => c.status !== 'rejected').length}
          icon={<TrendingUp size={20} />}
          variant="info"
        />
      </div>

      <div className={styles.grid}>
        <Card>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Recent Candidates</span>
            <Link to="/candidates" className={styles.viewAll}>View all</Link>
          </div>
          {recentCandidates.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No candidates yet.</p>
          ) : (
            recentCandidates.map(candidate => (
              <Link key={candidate.id} to={`/candidates/${candidate.id}`} style={{ textDecoration: 'none' }}>
                <div className={styles.candidateItem}>
                  <div className={styles.avatar}>{getInitials(candidate.name)}</div>
                  <div className={styles.candidateInfo}>
                    <span className={styles.candidateName}>{candidate.name}</span>
                    <span className={styles.candidateRole}>{candidate.position}</span>
                  </div>
                  <Badge variant={getStatusColor(candidate.status) as 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'primary'}>
                    {candidate.status}
                  </Badge>
                  <span className={styles.date}>{formatDate(candidate.appliedDate)}</span>
                </div>
              </Link>
            ))
          )}
        </Card>

        <Card>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Upcoming Interviews</span>
            <Link to="/interviews" className={styles.viewAll}>View all</Link>
          </div>
          {upcomingInterviews.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No upcoming interviews.</p>
          ) : (
            upcomingInterviews.map(interview => {
              const d = new Date(interview.date);
              return (
                <div key={interview.id} className={styles.interviewItem}>
                  <div className={styles.interviewTime}>
                    <span className={styles.interviewDay}>{d.getDate()}</span>
                    <span className={styles.interviewMonth}>{d.toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className={styles.interviewInfo}>
                    <span className={styles.candidateName}>{interview.candidateId}</span>
                    <span className={styles.candidateRole}>{interview.jobId} · {interview.type}</span>
                  </div>
                  <Badge variant={getStatusColor(interview.status) as 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'primary'}>
                    {interview.status}
                  </Badge>
                  <span className={styles.interviewHour}>{interview.time}</span>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
