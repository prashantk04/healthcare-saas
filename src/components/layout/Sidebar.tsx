import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logoutThunk } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>) },
  { path: '/analytics', label: 'Analytics', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>) },
  { path: '/patients', label: 'Patients', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>) },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { sidebarCollapsed } = useAppSelector((s) => s.ui);
  const unreadCount = useAppSelector((s) => s.notifications.notifications.filter((n) => !n.read).length);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-primary)" opacity="0.9"/>
            <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12l10 5 10-5" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
        {!sidebarCollapsed && <span className={styles.logoText}>MedCore</span>}
      </div>

      <button className={styles.toggleBtn} onClick={() => dispatch(toggleSidebar())} aria-label="Toggle sidebar">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          {sidebarCollapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
        </svg>
      </button>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => [styles.navItem, isActive ? styles.navItemActive : ''].join(' ')}>
            <span className={styles.navIcon}>{item.icon}</span>
            {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            {item.path === '/dashboard' && unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.avatar}>
          {user?.displayName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
        </div>
        {!sidebarCollapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.displayName ?? 'Admin User'}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
