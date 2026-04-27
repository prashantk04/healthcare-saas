import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { markAllRead, markAsRead, removeNotification } from '../../store/slices/notificationSlice';
import { requestNotificationPermission, sendLocalNotification } from '../../services/notifications';
import { setPermission } from '../../store/slices/notificationSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import styles from './Topbar.module.css';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patient Management',
};

const Topbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications = useAppSelector((s) => s.notifications.notifications);
  const permission = useAppSelector((s) => s.notifications.permission);
  const unread = notifications.filter((n) => !n.read).length;

  const title =
    PAGE_TITLES[location.pathname] ??
    (location.pathname.startsWith('/patients/') ? 'Patient Details' : 'MedCore');

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    dispatch(setPermission(perm));
    if (perm === 'granted') {
      const id = `n-${Date.now()}`;
      dispatch(
        addNotification({
          id,
          title: 'Notifications Enabled',
          body: 'You will now receive real-time clinical alerts.',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false,
        })
      );
      sendLocalNotification('MedCore Alerts Active', 'Real-time clinical notifications are on.');
    }
  };

  const notifColor: Record<string, string> = {
    alert: 'var(--color-critical)',
    warning: 'var(--color-warning)',
    success: 'var(--color-stable)',
    info: 'var(--color-primary)',
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2 className={styles.pageTitle}>{title}</h2>
        <div className={styles.breadcrumb}>
          MedCore / <span>{title}</span>
        </div>
      </div>

      <div className={styles.right}>
        {permission !== 'granted' && (
          <button className={styles.enableBtn} onClick={handleEnableNotifications}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Enable Alerts
          </button>
        )}

        <div className={styles.notifWrapper} ref={panelRef}>
          <button
            className={styles.bellBtn}
            onClick={() => setPanelOpen((v) => !v)}
            aria-label="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unread > 0 && <span className={styles.bellBadge}>{unread}</span>}
          </button>

          {panelOpen && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Notifications</span>
                {unread > 0 && (
                  <button
                    className={styles.markAllBtn}
                    onClick={() => dispatch(markAllRead())}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className={styles.panelList}>
                {notifications.length === 0 ? (
                  <p className={styles.empty}>No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}
                      onClick={() => dispatch(markAsRead(n.id))}
                    >
                      <span
                        className={styles.dot}
                        style={{ background: notifColor[n.type] ?? 'var(--color-primary)' }}
                      />
                      <div className={styles.notifContent}>
                        <span className={styles.notifTitle}>{n.title}</span>
                        <span className={styles.notifBody}>{n.body}</span>
                        <span className={styles.notifTime}>
                          {new Date(n.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeNotification(n.id));
                        }}
                        aria-label="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
