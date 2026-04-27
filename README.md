# MedCore — B2B Healthcare SaaS Platform

A full-featured healthcare management platform built with **React 18**, **TypeScript**, **Redux Toolkit**, and **Firebase Authentication**. Covers all assignment requirements: auth, dashboard, analytics, patient management (grid/list), push notifications via Service Worker, and a clean scalable architecture.

---

## Live Features

| Feature | Status |
|---|---|
| Firebase Email/Password Auth | ✅ |
| Protected Routes | ✅ |
| Dashboard with real-time stats | ✅ |
| Analytics with Recharts | ✅ |
| Patient Grid / List View toggle | ✅ |
| Patient Detail Page with vitals | ✅ |
| Service Worker + Push Notifications | ✅ |
| Redux Toolkit state management | ✅ |
| Responsive design (mobile-first) | ✅ |
| Collapsible sidebar | ✅ |

---

## Folder Structure

```
healthcare-saas/
├── public/
│   └── sw.js                        # Service Worker (notifications + caching)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingScreen.tsx    # Full-page loading spinner
│   │   │   ├── LoadingScreen.module.css
│   │   │   ├── StatusBadge.tsx      # Reusable patient status pill
│   │   │   └── StatusBadge.module.css
│   │   └── layout/
│   │       ├── AppLayout.tsx        # Root layout (sidebar + topbar + outlet)
│   │       ├── AppLayout.module.css
│   │       ├── Sidebar.tsx          # Collapsible nav sidebar
│   │       ├── Sidebar.module.css
│   │       ├── Topbar.tsx           # Header + notification panel
│   │       └── Topbar.module.css
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth state sync with Firebase
│   │   └── useRedux.ts              # Typed dispatch + selector hooks
│   ├── pages/
│   │   ├── LoginPage.tsx            # Split-panel login with validation
│   │   ├── LoginPage.module.css
│   │   ├── DashboardPage.tsx        # Stats cards + recent admissions
│   │   ├── DashboardPage.module.css
│   │   ├── AnalyticsPage.tsx        # Area/Bar/Radial charts via Recharts
│   │   ├── AnalyticsPage.module.css
│   │   ├── PatientsPage.tsx         # Grid + List view with filters
│   │   ├── PatientsPage.module.css
│   │   ├── PatientDetailPage.tsx    # Full patient profile + vitals
│   │   └── PatientDetailPage.module.css
│   ├── services/
│   │   ├── firebase.ts              # Firebase init + auth helpers
│   │   ├── mockData.ts              # Mock patients + analytics data
│   │   └── notifications.ts        # Notification request + send helpers
│   ├── store/
│   │   ├── index.ts                 # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.ts         # Auth state + login/logout thunks
│   │       ├── patientSlice.ts      # Patient list, filters, view mode
│   │       ├── analyticsSlice.ts   # Monthly + department analytics
│   │       ├── notificationSlice.ts # In-app notification queue
│   │       └── uiSlice.ts           # Sidebar collapse, theme toggle
│   ├── styles/
│   │   └── globals.css              # CSS variables + reset + animations
│   ├── types/
│   │   └── index.ts                 # All TypeScript types/interfaces
│   ├── workers/
│   │   └── sw.ts                    # TypeScript SW source (compiled by Vite PWA)
│   ├── App.tsx                      # Router + ProtectedRoute wrapper
│   └── main.tsx                     # React root + Redux Provider + SW registration
├── .env.example                     # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts                   # Vite + React + PWA plugin config
```

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/healthcare-saas.git
cd healthcare-saas
npm install
```

### 2. Firebase Setup (Required)

#### Step 1 — Create Firebase project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → enter a project name (e.g. `medcore-health`)
3. Disable Google Analytics if you don't need it → **Create project**

#### Step 2 — Enable Email/Password Authentication
1. In the Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, click **Email/Password**
4. Toggle **Enable** → **Save**

#### Step 3 — Add a test user
1. In Authentication → **Users** tab → **Add user**
2. Enter any email + password (e.g. `admin@medcore.health` / `password123`)
3. Click **Add user** — this is what you'll use to log in

#### Step 4 — Get your Firebase config
1. Go to **Project Settings** (gear icon ⚙) → **General** tab
2. Scroll to **"Your apps"** → click **`</>`** (Web app icon)
3. Register app name (e.g. `medcore-web`) → **Register app**
4. Copy the `firebaseConfig` object shown:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "medcore-health.firebaseapp.com",
  projectId: "medcore-health",
  storageBucket: "medcore-health.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...:web:abc..."
};
```

#### Step 5 — Create your `.env` file
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=medcore-health.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medcore-health
VITE_FIREBASE_STORAGE_BUCKET=medcore-health.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123...:web:abc...
```

> **Important**: Never commit your `.env` file. It's already in `.gitignore`.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with the credentials you created in Step 3.

---

## Build & Deploy

### Build for production
```bash
npm run build
```

### Deploy to Vercel (recommended)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In **Environment Variables**, add all `VITE_FIREBASE_*` variables from your `.env`
4. Click **Deploy**

### Deploy to Netlify

1. Push your repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from Git
3. Build command: `npm run build` | Publish directory: `dist`
4. Go to **Site settings → Environment variables** → add all `VITE_FIREBASE_*` vars
5. Redeploy

> **SPA routing fix for Netlify**: Create `public/_redirects` with:
> ```
> /*    /index.html   200
> ```

---

## Architecture Decisions

### State Management — Redux Toolkit
- **5 slices**: `auth`, `patients`, `analytics`, `notifications`, `ui`
- All async operations use `createAsyncThunk` with loading/error states
- Typed with `RootState` and `AppDispatch` for full TypeScript safety
- Custom `useAppDispatch` / `useAppSelector` hooks for clean usage

### CSS Modules (no Tailwind)
- Per-component `.module.css` files prevent style leakage
- Global CSS variables in `globals.css` for consistent theming
- No third-party CSS frameworks — pure CSS with custom properties

### Service Worker Strategy
- Registered in `main.tsx` on page load
- Handles: cache-first static assets, push events, notification clicks
- `vite-plugin-pwa` auto-generates the manifest
- `sendLocalNotification()` posts to SW controller for richer notifications

### Performance
- Lazy route-level code splitting via React Router
- Skeleton loading states on all async data
- CSS animations use `transform` and `opacity` (GPU-accelerated)
- `shimmer` animation via CSS gradients (no JS timers)

---

## Key Design Patterns

### Protected Route
```tsx
// Reads auth state from Redux (synced with Firebase onAuthStateChanged)
<ProtectedRoute>
  <AppLayout />
</ProtectedRoute>
```

### Notification flow
1. User clicks "Enable Alerts" in Topbar
2. `requestNotificationPermission()` called → stored in Redux
3. `sendLocalNotification()` posts to Service Worker
4. SW shows native OS notification
5. Redux slice stores in-app notification queue
6. Bell icon badge reflects unread count

### Patient view toggle
```tsx
// One Redux action, immediate re-render
dispatch(setViewMode('grid'))  // or 'list'
```
State persists across navigations within the session.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

All variables must be prefixed with `VITE_` to be exposed to the browser by Vite.
