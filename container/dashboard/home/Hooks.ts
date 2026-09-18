"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { getDashboardStatsAPI } from "@/container/dashboard/home/DashboardApis";
import {
  setDashboardData,
  setDashboardLoading,
} from "@/container/dashboard/home/DashboardReducer";
import type { DashboardState } from "./types";

type RootSlice = {
  dashboard: DashboardState;
};

export const useDashboardHome = () => {
  const dispatch = useDispatch();
  const { stats, activity, cashTrend, loading } = useSelector(
    (state: RootSlice) => state.dashboard,
  );
  const [userName, setUserName] = useState("there");
  const [orgName, setOrgName] = useState("Your organisation");

  console.log("resortToken ", getCookieData("resortToken"));
  

  useEffect(() => {
    setUserName(
      getCookieData("resortUserName") ||
        getCookieData("resortShortName") ||
        "there",
    );
    setOrgName(
      getCookieData("resortName") ||
        getCookieData("resortBranchName") ||
        "Your organisation",
    );
  }, []);

  const loadDashboard = useCallback(async () => {
    dispatch(setDashboardLoading(true));
    try {
      const res = await getDashboardStatsAPI();
      dispatch(setDashboardData(res.details || {}));
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
