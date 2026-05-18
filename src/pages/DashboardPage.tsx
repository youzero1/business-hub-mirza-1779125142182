import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, stageLabel, stageColor, interviewTypeLabel } from '@/lib/utils';
import type { CandidateStage } from '@/types';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { jobs, applications, interviews, candidates } = state;

  const stats = useMemo(() => {
    const openJobs = jobs.filter(j => j.status === 'open').length;
    const activeApps = applications.filter(a => a.status === 'active').length;
    const scheduledInterviews = interviews.filter(i => i.status === 'scheduled').length;
    const hired = applications.filter(a => a.stage === 'hired').length;
    const inOffer = applications.filter(a => a.stage === 'offer').length;
    return { openJobs, activeApps, scheduledInterviews, hired, inOffer };
  }, [jobs, applications, interviews]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 6);
  }, [applications]);

  const upcomingInterviews = useMemo(() => {
    return [...interviews]
      .filter(i => i.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 4);
  }, [interviews]);

  const stageCounts = useMemo(() => {
    const stages: CandidateStage[] = ['applied', 'screening', 'interview', 'technical', 'offer', 'hired'];
    return stages.map(stage => ({
      stage,
      count: applications.filter(a => a.stage === stage && a.status === 'active').length,
    }));
  }, [applications]);

  function getCandidate(candidateId: string) {
    return candidates.find(c => c.id === candidateId);
  }

  function getJob(jobId: string) {
    return jobs.find(j => j.id === jobId);
  }

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        <StatCard
          label="Open Positions"
          value={stats.openJobs}
          icon={<Briefcase size={18} />}
          color="primary"
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatCard
          label="Active Candidates"
          value={stats.activeApps}
          icon={<Users size={18} />}
          color="info"
          trend={{ value: 8, label: 'vs last month' }}
        />
        <StatCard
          label="Scheduled Interviews"
          value={stats.scheduledInterviews}
          icon={<Calendar size={18} />}
          color="warning"
        />
        <StatCard
          label="Offers Extended"
          value={stats.inOffer}
          icon={<TrendingUp size={18} />}
          color="success"
        />
      </div>

      <div className={styles.grid}>
        <Card padding="none">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Pipeline Overview</h2>
          </div>
          <div className={styles.pipeline}>
            {stageCounts.map(({ stage, count }) => (
              <div key={stage} className={styles.pipelineStage}>
                <div
                  className={styles.pipelineDot}
                  style={{ background: stageColor(stage) }}
                />
                <div className={styles.pipelineInfo}>
                  <span className={styles.pipelineLabel}>{stageLabel(stage)}</span>
                  <div
                    className={styles.pipelineBar}
                  >
                    <div
                      className={styles.pipelineFill}
                      style={{
                        width: `${Math.min((count / Math.max(stats.activeApps, 1)) * 100, 100)}%`,
                        background: stageColor(stage),
                      }}
                    />
                  </div>
                </div>
                <span className={styles.pipelineCount}>{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Interviews</h2>
            <button className={styles.seeAll} onClick={() => navigate('/interviews')}>See all</button>
          </div>
          <div className={styles.list}>
            {upcomingInterviews.length === 0 ? (
              <div className={styles.emptyMsg}>
                <Clock size={20} />
                <span>No upcoming interviews</span>
              </div>
            ) : (
              upcomingInterviews.map(interview => {
                const candidate = getCandidate(interview.candidateId);
                const job = getJob(interview.jobId);
                return (
                  <div key={interview.id} className={styles.interviewRow}>
                    <div className={styles.interviewAvatar}>
                      {candidate ? (candidate.firstName[0] + candidate.lastName[0]) : '?'}
                    </div>
                    <div className={styles.interviewInfo}>
                      <span className={styles.interviewName}>
                        {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                      </span>
                      <span className={styles.interviewMeta}>
                        {interviewTypeLabel(interview.type)} · {job?.title ?? 'Unknown Job'}
                      </span>
                    </div>
                    <div className={styles.interviewDate}>
                      {formatDate(interview.scheduledAt)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Applications</h2>
          <button className={styles.seeAll} onClick={() => navigate('/candidates')}>See all</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Stage</th>
                <th>Applied</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map(app => {
                const candidate = getCandidate(app.candidateId);
                const job = getJob(app.jobId);
                return (
                  <tr
                    key={app.id}
                    className={styles.tableRow}
                    onClick={() => navigate(`/candidates/${app.candidateId}`)}
                  >
                    <td>
                      <div className={styles.candidateCell}>
                        <div className={styles.candidateAvatar}>
                          {candidate ? (candidate.firstName[0] + candidate.lastName[0]) : '?'}
                        </div>
                        <div>
                          <div className={styles.candidateName}>
                            {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                          </div>
                          <div className={styles.candidateEmail}>{candidate?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.jobTitle}>{job?.title ?? '—'}</td>
                    <td>
                      <Badge
                        variant={
                          app.stage === 'offer' || app.stage === 'hired'
                            ? 'success'
                            : app.stage === 'rejected'
                            ? 'danger'
                            : app.stage === 'interview' || app.stage === 'technical'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {stageLabel(app.stage)}
                      </Badge>
                    </td>
                    <td className={styles.muted}>{formatDate(app.appliedAt)}</td>
                    <td>
                      {app.score !== undefined ? (
                        <div className={styles.score}>
                          <div
                            className={styles.scoreBar}
                            style={{ width: `${app.score}%`, background: app.score >= 80 ? 'var(--color-success)' : app.score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)' }}
                          />
                          <span>{app.score}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <Badge variant={app.status === 'active' ? 'success' : app.status === 'hired' ? 'accent' : 'danger'} dot>
                        {app.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className={styles.bottomGrid}>
        <Card padding="md">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Open Jobs</h2>
            <button className={styles.seeAll} onClick={() => navigate('/jobs')}>See all</button>
          </div>
          <div className={styles.jobList}>
            {jobs.filter(j => j.status === 'open').slice(0, 4).map(job => (
              <div key={job.id} className={styles.jobRow} onClick={() => navigate(`/jobs/${job.id}`)}>
                <div>
                  <div className={styles.jobTitle2}>{job.title}</div>
                  <div className={styles.jobMeta}>{job.department} · {job.location}</div>
                </div>
                <div className={styles.jobRight}>
                  <span className={styles.appCount}>{job.applicationCount} applicants</span>
                  <Badge variant="success" dot>Open</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.qaBtn} onClick={() => navigate('/jobs')}>
              <Briefcase size={20} />
              <span>Post New Job</span>
            </button>
            <button className={styles.qaBtn} onClick={() => navigate('/candidates')}>
              <Users size={20} />
              <span>Add Candidate</span>
            </button>
            <button className={styles.qaBtn} onClick={() => navigate('/interviews')}>
              <Calendar size={20} />
              <span>Schedule Interview</span>
            </button>
            <button className={styles.qaBtn} onClick={() => navigate('/team')}>
              <CheckCircle size={20} />
              <span>Manage Team</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
