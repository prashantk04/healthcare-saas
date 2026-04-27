import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#3b82f6" fillOpacity="0.15" />
          <path d="M20 8v24M8 20h24" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="20" r="5" fill="#3b82f6" fillOpacity="0.4" />
        </svg>
        <span>MedCore</span>
      </div>
      <div className={styles.spinner} />
    </div>
  );
}
