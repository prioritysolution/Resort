import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    activity: [],
    cashTrend: [],
    loading: false,
  },
  reducers: {
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action) => {
      state.stats = action.payload.stats;
      state.activity = action.payload.activity || [];
      state.cashTrend = action.payload.cashTrend || [];
    },
  },
});

export const { setDashboardLoading, setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
