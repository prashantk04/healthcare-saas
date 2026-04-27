import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnalyticsState } from '../../types';
import { mockMonthlyData, mockDepartmentStats } from '../../services/mockData';

const initialState: AnalyticsState = {
  monthlyData: [],
  departmentStats: [],
  loading: false,
};

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async () => {
  await new Promise((res) => setTimeout(res, 500));
  return { monthlyData: mockMonthlyData, departmentStats: mockDepartmentStats };
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyData = action.payload.monthlyData;
        state.departmentStats = action.payload.departmentStats;
      });
  },
});

export default analyticsSlice.reducer;
