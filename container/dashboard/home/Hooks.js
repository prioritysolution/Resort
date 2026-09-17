"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { getDashboardStatsAPI } from "@/container/dashboard/home/DashboardApis";
import {
  setDashboardData,
  setDashboardLoading,
} from "@/container/dashboard/home/DashboardReducer";

export const useDashboardHome = () => {
  const dispatch = useDispatch();
  const { stats, activity, cashTrend, loading } = useSelector(
    (state) => state.dashboard,
  );
  const [userName, setUserName] = useState("there");
  const [orgName, setOrgName] = useState("Your organisation");

  useEffect(() => {
    setUserName(getCookieData("userName") || "there");
    setOrgName(getCookieData("userOrgName") || "Your organisation");
  }, []);

  const loadDashboard = useCallback(async () => {
    dispatch(setDashboardLoading(true));
    try {
      const orgId = getCookieData("orgId");
      const res = await getDashboardStatsAPI(orgId);
      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(setDashboardData(res.details || res.Data || {}));
        return;
      }
      toast.error(res.message || "Unable to load dashboard");
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch]);

  return {
    stats,
    activity,
    cashTrend,
    loading,
    userName,
    orgName,
    loadDashboard,
  };
};
