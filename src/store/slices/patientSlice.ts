import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PatientState, Patient, PatientStatus } from '../../types';
import { mockPatients } from '../../services/mockData';

const initialState: PatientState = {
  patients: [],
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'All',
  selectedPatient: null,
  loading: false,
  error: null,
};

export const fetchPatients = createAsyncThunk('patients/fetch', async () => {
  // Simulate API call
  await new Promise((res) => setTimeout(res, 600));
  return mockPatients;
});

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<PatientStatus | 'All'>) {
      state.statusFilter = action.payload;
    },
    setSelectedPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch patients';
      });
  },
});

export const { setViewMode, setSearchQuery, setStatusFilter, setSelectedPatient } =
  patientSlice.actions;
export default patientSlice.reducer;
