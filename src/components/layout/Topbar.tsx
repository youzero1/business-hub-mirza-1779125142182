import { Bell, Search, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Topbar.module.css';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Jobs',
  '/candidates': 'Candidates',
  '/interviews': 'Interviews',
  '/team': 'Team',
  '/settings': 'Settings',
};

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = '/' + location.pathname.split('/')[1];
  const title = pageTitles[pathname] || 'TalentFlow';

  function handleNewJob() {
    navigate('/jobs');
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search candidates, jobs..."
            readOnly
          />
        </div>
        <button className={styles.iconBtn}>
          <Bell size={18} />
        </button>
        <button className={styles.newBtn} onClick={handleNewJob}>
          <Plus size={16} />
          New Job
        </button>
      </div>
    </header>
  );
}
