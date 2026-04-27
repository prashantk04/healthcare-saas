import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, AppNotification } from '../../types';

const initialState: NotificationState = {
  notifications: [
    {
      id: 'n1',
      title: 'Critical Alert',
      body: 'Patient Amara Okonkwo — O2 saturation dropped to 91%',
      type: 'alert',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 'n2',
      title: 'Lab Results Ready',
      body: 'Blood panel for Marcus Chen is available for review.',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 'n3',
      title: 'Discharge Completed',
      body: 'Lily Nakamura has been successfully discharged.',
      type: 'success',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
  ],
  permission: 'default',
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<AppNotification>) {
      state.notifications.unshift(action.payload);
    },
    markAsRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.read = true));
    },
    setPermission(state, action: PayloadAction<NotificationPermission>) {
      state.permission = action.payload;
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, markAsRead, markAllRead, setPermission, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
