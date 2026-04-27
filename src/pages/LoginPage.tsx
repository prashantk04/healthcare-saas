import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { loginThunk } from '../store/slices/authSlice';
import { clearError } from '../store/slices/authSlice';
import styles from './LoginPage.module.css';

// ─── Demo credentials ──────────────────────────────────────────────
const DEMO_EMAIL = 'admin@healthcare.com';
const DEMO_PASSWORD = 'password123';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [filled, setFilled] = useState(false);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'At least 6 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(clearError());
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleAutofill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setFieldErrors({});
    dispatch(clearError());
    setFilled(true);
    setTimeout(() => setFilled(false), 2000);
  };

  return (
    <div className={styles.root}>
      <div className={styles.gridBg} aria-hidden />

      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#3b82f6" />
              <path d="M16 7v18M7 16h18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className={styles.brandName}>MedCore</span>
        </div>

        <div className={styles.heroText}>
          <h1 className={styles.heroHeading}>
            Unified care,<br />
            <em>intelligently</em><br />
            managed.
          </h1>
          <p className={styles.heroSub}>
            The healthcare platform built for modern clinical teams — from patient
            management to real-time analytics.
          </p>
        </div>

        <div className={styles.stats}>
          {[
            { value: '12k+', label: 'Patients Managed' },
            { value: '98.4%', label: 'System Uptime' },
            { value: '340+', label: 'Clinics Onboarded' },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Sign in to MedCore</h2>
            <p className={styles.formSubtitle}>Enter your credentials to continue</p>
          </div>

          {/* Demo credentials box */}
          <div className={styles.demoBox}>
            <div className={styles.demoBoxTop}>
              <span className={styles.demoBadge}>
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Demo Access
              </span>
              <span className={styles.demoDesc}>Use these to explore the app</span>
            </div>
            <div className={styles.demoCredentials}>
              <div className={styles.demoRow}>
                <span className={styles.demoKey}>Email</span>
                <code className={styles.demoVal}>{DEMO_EMAIL}</code>
              </div>
              <div className={styles.demoDivider} />
              <div className={styles.demoRow}>
                <span className={styles.demoKey}>Password</span>
                <code className={styles.demoVal}>{DEMO_PASSWORD}</code>
              </div>
            </div>
            <button className={styles.autofillBtn} onClick={handleAutofill} type="button">
              {filled ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Filled!
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Autofill credentials
                </>
              )}
            </button>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <span>⚠</span>
              <span>
                {error.includes('user-not-found') ||
                error.includes('wrong-password') ||
                error.includes('invalid-credential')
                  ? 'Invalid credentials. Use the demo access above.'
                  : error.includes('too-many-requests')
                  ? 'Too many attempts. Please wait a moment.'
                  : 'Login failed. Please try again.'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                placeholder="doctor@medcore.health"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className={styles.fieldError} role="alert">{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeToggle}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {fieldErrors.password && (
                <span className={styles.fieldError} role="alert">{fieldErrors.password}</span>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;