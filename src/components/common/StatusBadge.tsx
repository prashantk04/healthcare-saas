import { PatientStatus } from '../../types';
import styles from './StatusBadge.module.css';

interface Props {
  status: PatientStatus;
  pulse?: boolean;
}

export default function StatusBadge({ status, pulse }: Props) {
  const cls = status.toLowerCase();
  return (
    <span className={`${styles.badge} ${styles[cls]}`}>
      <span className={`${styles.dot} ${pulse && cls === 'critical' ? styles.pulse : ''}`} />
      {status}
    </span>
  );
}
