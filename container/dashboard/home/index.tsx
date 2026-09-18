"use client";

import { useEffect } from "react";
import { useDashboardHome } from "@/container/dashboard/home/Hooks";
import DashboardHomeView from "@/components/dashboard/home";

const DashboardHomeContainer = () => {
  const dashboard = useDashboardHome();

  useEffect(() => {
    dashboard.loadDashboard();
  }, [dashboard.loadDashboard]);

  return <DashboardHomeView {...dashboard} />;
};

export default DashboardHomeContainer;
