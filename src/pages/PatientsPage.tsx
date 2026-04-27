import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPatients, setViewMode, setSearchQuery, setStatusFilter } from '../store/slices/patientSlice';
import { Patient, PatientStatus } from '../types';
import styles from './PatientsPage.module.css';

const STATUS_OPTIONS: Array<PatientStatus | 'All'> = ['All', 'Active', 'Critical', 'Stable', 'Discharged'];

const statusColor: Record<string, string> = {
  Critical: 'var(--color-critical)',
  Active: 'var(--color-active)',
  Stable: 'var(--color-stable)',
  Discharged: 'var(--color-discharged)',
};

const VitalPill: React.FC<{ label: string; value: string | number; unit?: string }> = ({
  label, value, unit,
}) => (
  <div className={styles.vitalPill}>
    <span className={styles.vitalLabel}>{label}</span>
    <span className={styles.vitalValue}>{value}{unit}</span>
  </div>
);

const PatientGridCard: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient, onClick }) => (
  <div className={styles.gridCard} onClick={onClick} role="button" tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}>
    <div className={styles.cardTop}>
      <div className={styles.cardAvatar}
        style={{ background: patient.status === 'Critical' ? 'linear-gradient(135deg, #7f1d1d, #ef4444)' : 'linear-gradient(135deg, #1e3a5f, #3b82f6)' }}>
        {patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
      </div>
      <div className={styles.cardStatus}>
        <span
          className={styles.statusDot}
          style={{ background: statusColor[patient.status] }}
        />
        <span className={styles.statusText} style={{ color: statusColor[patient.status] }}>
          {patient.status}
        </span>
      </div>
    </div>
    <div className={styles.cardBody}>
      <h3 className={styles.cardName}>{patient.name}</h3>
      <p className={styles.cardId}>#{patient.id} · {patient.age}y · {patient.gender}</p>
      <p className={styles.cardDiag}>{patient.diagnosis}</p>
    </div>
    <div className={styles.cardVitals}>
      <VitalPill label="HR" value={patient.vitals.heartRate} unit=" bpm" />
      <VitalPill label="BP" value={patient.vitals.bloodPressure} />
      <VitalPill label="O₂" value={patient.vitals.oxygenSaturation} unit="%" />
    </div>
    <div className={styles.cardFooter}>
      <span className={styles.cardWard}>{patient.ward}</span>
      <span className={styles.cardDoc}>{patient.doctor.replace('Dr. ', '')}</span>
    </div>
  </div>
);

const PatientListRow: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient, onClick }) => (
  <div className={styles.listRow} onClick={onClick} role="button" tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}>
    <div className={styles.listAvatar}>
      {patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
    </div>
    <div className={styles.listMain}>
      <span className={styles.listName}>{patient.name}</span>
      <span className={styles.listDiag}>{patient.diagnosis}</span>
    </div>
    <div className={styles.listMeta}>
      <span className={styles.listAge}>{patient.age}y · {patient.gender} · {patient.bloodGroup}</span>
    </div>
    <div className={styles.listWard}>{patient.ward.split(' - ')[0]}</div>
    <div className={styles.listDoc}>{patient.doctor}</div>
    <div className={styles.listVitals}>
      <span>{patient.vitals.heartRate} bpm</span>
      <span className={patient.vitals.oxygenSaturation < 93 ? styles.vitalAlert : ''}>
        {patient.vitals.oxygenSaturation}% O₂
      </span>
    </div>
    <div>
      <span
        className={styles.statusBadge}
        style={{
          background: `${statusColor[patient.status]}22`,
          color: statusColor[patient.status],
        }}
      >
        {patient.status}
      </span>
    </div>
  </div>
);

const PatientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patients, viewMode, searchQuery, statusFilter, loading } = useAppSelector(
    (s) => s.patients
  );

  useEffect(() => {
    if (patients.length === 0) dispatch(fetchPatients());
  }, [dispatch, patients.length]);

  const filtered = patients.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.root}>
      {/* Controls bar */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by name, diagnosis, ID…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        <div className={styles.filters}>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`}
              onClick={() => dispatch(setStatusFilter(s))}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleActive : ''}`}
            onClick={() => dispatch(setViewMode('grid'))}
            aria-label="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Grid
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleActive : ''}`}
            onClick={() => dispatch(setViewMode('list'))}
            aria-label="List view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            List
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className={styles.resultCount}>
        {loading ? 'Loading…' : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className={styles.gridView}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.gridSkeleton} />
              ))
            : filtered.map((p) => (
                <PatientGridCard
                  key={p.id}
                  patient={p}
                  onClick={() => navigate(`/patients/${p.id}`)}
                />
              ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className={styles.listView}>
          <div className={styles.listHeader}>
            <span />
            <span>Patient</span>
            <span>Age / Gender</span>
            <span>Ward</span>
            <span>Doctor</span>
            <span>Vitals</span>
            <span>Status</span>
          </div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.listSkeleton} />
              ))
            : filtered.map((p) => (
                <PatientListRow
                  key={p.id}
                  patient={p}
                  onClick={() => navigate(`/patients/${p.id}`)}
                />
              ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className={styles.empty}>
          <span>No patients match your filters.</span>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
