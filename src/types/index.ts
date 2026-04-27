// ─── Auth ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// ─── Patient ─────────────────────────────────────────────────────────────────

export type PatientStatus = 'Active' | 'Critical' | 'Stable' | 'Discharged';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface VitalSigns {
  heartRate: number;       // bpm
  bloodPressure: string;   // "120/80"
  temperature: number;     // °F
  oxygenSaturation: number; // %
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  diagnosis: string;
  status: PatientStatus;
  admittedOn: string;      // ISO date
  doctor: string;
  ward: string;
  phone: string;
  email: string;
  vitals: VitalSigns;
  avatar?: string;
}

export interface PatientState {
  patients: Patient[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  statusFilter: PatientStatus | 'All';
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface MonthlyData {
  month: string;
  admissions: number;
  discharges: number;
  revenue: number;
}

export interface DepartmentStats {
  department: string;
  patients: number;
  occupancy: number;
}

export interface AnalyticsState {
  monthlyData: MonthlyData[];
  departmentStats: DepartmentStats[];
  loading: boolean;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'alert' | 'info' | 'success' | 'warning';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

export interface NotificationState {
  notifications: AppNotification[];
  permission: NotificationPermission | 'default';
}

// ─── UI ──────────────────────────────────────────────────────────────────────

export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
}
