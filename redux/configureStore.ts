import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "@/container/layout/SidebarReducer";
import dashboardReducer from "@/container/dashboard/home/DashboardReducer";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
