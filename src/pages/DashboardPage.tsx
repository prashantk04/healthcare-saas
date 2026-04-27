import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPatients } from '../store/slices/patientSlice';
import { fetchAnalytics } from '../store/slices/analyticsSlice';
import { addNotification } from '../store/slices/notificationSlice';
import { sendLocalNotification } from '../services/notifications';
import styles from './DashboardPage.module.css';

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon: React.ReactNode;
}> = ({ label, value, sub, color = 'var(--color-primary)', icon }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon} style={{ background: `${color}22`, color }}>
      {icon}
    </div>
    <div className={styles.statBody}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const patients = useAppSelector((s) => s.patients.patients);
  const loading = useAppSelector((s) => s.patients.loading);
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (patients.length === 0) dispatch(fetchPatients());
    dispatch(fetchAnalytics());
  }, [dispatch, patients.length]);

  // Fire a simulated critical alert after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const id = `n-${Date.now()}`;
      dispatch(
        addNotification({
          id,
          title: '⚠ Vital Sign Alert',
          body: 'David Okwu — O₂ sat at 88%. Immediate attention required.',
          type: 'alert',
          timestamp: new Date().toISOString(),
          read: false,
        })
      );
      sendLocalNotification('⚠ Vital Sign Alert', 'David Okwu — O₂ sat at 88%.');
    }, 4000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const critical = patients.filter((p) => p.status === 'Critical').length;
  const active = patients.filter((p) => p.status === 'Active').length;
  const stable = patients.filter((p) => p.status === 'Stable').length;
  const discharged = patients.filter((p) => p.status === 'Discharged').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Clinician';

  return (
    <div className={styles.root}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetingTitle}>
            {greeting()}, <em>{displayName}</em>
          </h1>
          <p className={styles.greetingDate}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <button className={styles.simulateBtn} onClick={() => navigate('/patients')}>
          View All Patients →
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Patients"
          value={loading ? '—' : patients.length}
          sub="Across all wards"
          color="var(--color-primary)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Critical"
          value={loading ? '—' : critical}
          sub="Require immediate care"
          color="var(--color-critical)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
        <StatCard
          label="Active"
          value={loading ? '—' : active}
          sub="Under treatment"
          color="var(--color-active)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <StatCard
          label="Stable"
          value={loading ? '—' : stable}
          sub="Monitoring ongoing"
          color="var(--color-stable)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatCard
          label="Discharged"
          value={loading ? '—' : discharged}
          sub="This month"
          color="var(--color-discharged)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="16 12 12 8 8 12" />
              <line x1="12" y1="16" x2="12" y2="8" />
            </svg>
          }
        />
      </div>

      {/* Recent patients */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Admissions</h2>
          <button className={styles.seeAll} onClick={() => navigate('/patients')}>
            See all
          </button>
        </div>
        <div className={styles.recentList}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow} />
              ))
            : patients.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className={styles.recentRow}
                  onClick={() => navigate(`/patients/${p.id}`)}
                >
                  <div className={styles.recentAvatar}>
                    {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentName}>{p.name}</span>
                    <span className={styles.recentDiag}>{p.diagnosis}</span>
                  </div>
                  <div className={styles.recentMeta}>
                    <span className={styles.recentWard}>{p.ward.split(' - ')[0]}</span>
                    <span
                      className={styles.statusBadge}
                      data-status={p.status.toLowerCase()}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
