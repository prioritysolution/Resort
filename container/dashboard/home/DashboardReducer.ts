import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardDataPayload, DashboardState } from "./types";

const initialState: DashboardState = {
  stats: null,
  activity: [],
  cashTrend: [],
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<DashboardDataPayload>) => {
      state.stats = action.payload.stats ?? null;
      state.activity = action.payload.activity || [];
      state.cashTrend = action.payload.cashTrend || [];
    },
  },
});

export const { setDashboardLoading, setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
