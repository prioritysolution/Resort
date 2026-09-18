import type { DashboardApiResponse } from "./types";

export const getDashboardStatsAPI = async (): Promise<DashboardApiResponse> => {
  // Resort API has no dashboard stats endpoint yet.
  return {
    message: "Success",
    details: {
      stats: null,
      cashTrend: [],
      activity: [],
    },
  };
};
