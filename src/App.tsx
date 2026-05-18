import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/lib/context';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/pages/DashboardPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import CandidatesPage from '@/pages/CandidatesPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import InterviewsPage from '@/pages/InterviewsPage';
import TeamPage from '@/pages/TeamPage';
import SettingsPage from '@/pages/SettingsPage';
import CandidatePortalPage from '@/pages/CandidatePortalPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/portal" element={<CandidatePortalPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:candidateId" element={<CandidateDetailPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
