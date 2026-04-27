import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPatients, setSelectedPatient } from '../store/slices/patientSlice';
import styles from './PatientDetailPage.module.css';

const statusColor: Record<string, string> = {
  Critical: 'var(--color-critical)',
  Active: 'var(--color-active)',
  Stable: 'var(--color-stable)',
  Discharged: 'var(--color-discharged)',
};

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value}</span>
  </div>
);

const VitalCard: React.FC<{
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  alert?: boolean;
}> = ({ label, value, unit, icon, alert }) => (
  <div className={`${styles.vitalCard} ${alert ? styles.vitalAlert : ''}`}>
    <div className={styles.vitalIcon}>{icon}</div>
    <div className={styles.vitalBody}>
      <span className={styles.vitalValue}>{value}</span>
      <span className={styles.vitalUnit}>{unit}</span>
    </div>
    <span className={styles.vitalLabel}>{label}</span>
  </div>
);

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patients, selectedPatient, loading } = useAppSelector((s) => s.patients);

  useEffect(() => {
    if (patients.length === 0) dispatch(fetchPatients());
  }, [dispatch, patients.length]);

  useEffect(() => {
    if (patients.length > 0 && id) {
      const patient = patients.find((p) => p.id === id) ?? null;
      dispatch(setSelectedPatient(patient));
    }
  }, [patients, id, dispatch]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className={styles.notFound}>
        <h2>Patient not found</h2>
        <button onClick={() => navigate('/patients')} className={styles.backBtn}>
          ← Back to Patients
        </button>
      </div>
    );
  }

  const p = selectedPatient;
  const isLowO2 = p.vitals.oxygenSaturation < 93;
  const isHighHR = p.vitals.heartRate > 100;

  return (
    <div className={styles.root}>
      {/* Back */}
      <button className={styles.back} onClick={() => navigate('/patients')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Patients
      </button>

      {/* Header card */}
      <div className={styles.heroCard}>
        <div
          className={styles.heroAvatar}
          style={{
            background: p.status === 'Critical'
              ? 'linear-gradient(135deg, #7f1d1d, #ef4444)'
              : 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
          }}
        >
          {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className={styles.heroInfo}>
          <div className={styles.heroMeta}>
            <span className={styles.heroId}>#{p.id}</span>
            <span
              className={styles.heroBadge}
              style={{
                background: `${statusColor[p.status]}22`,
                color: statusColor[p.status],
              }}
            >
              {p.status === 'Critical' && (
                <span className={styles.pulseRing} style={{ background: statusColor[p.status] }} />
              )}
              {p.status}
            </span>
          </div>
          <h1 className={styles.heroName}>{p.name}</h1>
          <p className={styles.heroDiag}>{p.diagnosis}</p>
          <div className={styles.heroTags}>
            <span>{p.age} years old</span>
            <span>{p.gender}</span>
            <span>{p.bloodGroup}</span>
            <span>Admitted {new Date(p.admittedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <section>
        <h2 className={styles.sectionTitle}>Current Vitals</h2>
        <div className={styles.vitalsGrid}>
          <VitalCard
            label="Heart Rate"
            value={p.vitals.heartRate}
            unit="bpm"
            alert={isHighHR}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <VitalCard
            label="Blood Pressure"
            value={p.vitals.bloodPressure}
            unit="mmHg"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          />
          <VitalCard
            label="Temperature"
            value={p.vitals.temperature}
            unit="°F"
            alert={p.vitals.temperature > 100}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
            }
          />
          <VitalCard
            label="O₂ Saturation"
            value={p.vitals.oxygenSaturation}
            unit="%"
            alert={isLowO2}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Details grid */}
      <div className={styles.detailGrid}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <InfoRow label="Full Name" value={p.name} />
          <InfoRow label="Age" value={`${p.age} years`} />
          <InfoRow label="Gender" value={p.gender} />
          <InfoRow label="Blood Group" value={p.bloodGroup} />
          <InfoRow label="Phone" value={p.phone} />
          <InfoRow label="Email" value={p.email} />
        </div>

        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Admission Details</h2>
          <InfoRow label="Patient ID" value={p.id} />
          <InfoRow label="Admitted On" value={new Date(p.admittedOn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
          <InfoRow label="Attending Doctor" value={p.doctor} />
          <InfoRow label="Ward / Unit" value={p.ward} />
          <InfoRow label="Diagnosis" value={p.diagnosis} />
          <InfoRow label="Status" value={p.status} />
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
