import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './AppLayout.module.css';

const AppLayout: React.FC = () => (
  <div className={styles.root}>
    <Sidebar />
    <div className={styles.main}>
      <Topbar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
