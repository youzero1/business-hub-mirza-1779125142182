import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Settings,
  UserCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { getInitials } from '@/lib/utils';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/candidates', icon: Users, label: 'Candidates' },
  { to: '/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/team', icon: UserCheck, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { currentUser } = state;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={18} />
        </div>
        <span className={styles.logoText}>TalentFlow</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            <Icon size={18} className={styles.navIcon} />
            <span>{label}</span>
            <ChevronRight size={14} className={styles.chevron} />
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.userBtn}
          onClick={() => navigate('/settings')}
        >
          <div className={styles.avatar}>
            {getInitials(currentUser.name)}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser.name}</span>
            <span className={styles.userRole}>{currentUser.role.replace('_', ' ')}</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
