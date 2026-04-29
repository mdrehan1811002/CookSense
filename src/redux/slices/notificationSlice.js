import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    history: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const newNotif = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      state.history = [newNotif, ...state.history].slice(0, 50);
    },
    clearOldNotifications: (state) => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
      state.history = state.history.filter(n => new Date(n.timestamp).getTime() > oneDayAgo);
    },
    markAllAsRead: (state) => {
      state.history = state.history.map(n => ({ ...n, read: true }));
    }
  },
});

export const { addNotification, clearOldNotifications, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
