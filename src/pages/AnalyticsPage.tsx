import React, { useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchAnalytics } from '../store/slices/analyticsSlice';
import styles from './AnalyticsPage.module.css';

const fmt = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className={styles.tooltipRow}>
          <span>{p.name}</span>
          <span>{typeof p.value === 'number' && p.name === 'Revenue' ? fmt(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { monthlyData, departmentStats, loading } = useAppSelector((s) => s.analytics);

  useEffect(() => {
    if (monthlyData.length === 0) dispatch(fetchAnalytics());
  }, [dispatch, monthlyData.length]);

  const totalAdmissions = monthlyData.reduce((a, d) => a + d.admissions, 0);
  const totalRevenue = monthlyData.reduce((a, d) => a + d.revenue, 0);
  const avgOccupancy =
    departmentStats.length
      ? Math.round(departmentStats.reduce((a, d) => a + d.occupancy, 0) / departmentStats.length)
      : 0;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading analytics…</span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* KPI strip */}
      <div className={styles.kpiRow}>
        {[
          { label: 'Total Admissions (7mo)', value: totalAdmissions.toLocaleString(), color: 'var(--color-primary)' },
          { label: 'Total Revenue (7mo)', value: `$${(totalRevenue / 1000).toFixed(0)}k`, color: 'var(--color-accent)' },
          { label: 'Avg Bed Occupancy', value: `${avgOccupancy}%`, color: 'var(--color-stable)' },
          { label: 'Departments Tracked', value: departmentStats.length, color: 'var(--color-warning)' },
        ].map((k) => (
          <div key={k.label} className={styles.kpiCard}>
            <span className={styles.kpiValue} style={{ color: k.color }}>{k.value}</span>
            <span className={styles.kpiLabel}>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className={styles.chartRow}>
        <div className={styles.chartCard} style={{ flex: 2 }}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Admissions & Discharges</h3>
            <span className={styles.chartPeriod}>Sep – Mar</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-admissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-discharges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#3b82f6" strokeWidth={2} fill="url(#grad-admissions)" />
              <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#06b6d4" strokeWidth={2} fill="url(#grad-discharges)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard} style={{ flex: 1 }}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Monthly Revenue</h3>
            <span className={styles.chartPeriod}>USD</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department occupancy */}
      <div className={styles.chartRow}>
        <div className={styles.chartCard} style={{ flex: 1 }}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Department Occupancy</h3>
            <span className={styles.chartPeriod}>% capacity used</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="80%"
              data={departmentStats.map((d, i) => ({
                ...d,
                fill: ['#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][i % 6],
              }))}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="occupancy" cornerRadius={4} />
              <Legend
                iconSize={8}
                formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{v}</span>}
                content={() => (
                  <div className={styles.deptLegend}>
                    {departmentStats.map((d, i) => (
                      <div key={d.department} className={styles.deptRow}>
                        <div
                          className={styles.deptDot}
                          style={{ background: ['#3b82f6','#06b6d4','#22c55e','#f59e0b','#ef4444','#8b5cf6'][i % 6] }}
                        />
                        <span className={styles.deptName}>{d.department}</span>
                        <span className={styles.deptOcc}>{d.occupancy}%</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Tooltip formatter={(v) => [`${v}%`, 'Occupancy']} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard} style={{ flex: 1 }}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Patient Volume by Dept.</h3>
            <span className={styles.chartPeriod}>Current</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={departmentStats}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 20, bottom: 4 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={90} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="patients" name="Patients" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
