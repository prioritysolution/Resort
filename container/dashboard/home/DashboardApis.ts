import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { format, parseISO } from "date-fns";
import type { DashboardDetails } from "./types";

export const getDashboardStatsAPI = async (): Promise<{ details: DashboardDetails }> => {
  try {
    const res = await doGetApiCall<any>({ url: endPoints.dashboard });
    
    if (res && res.Error_Code === 0) {
      return {
        details: {
          stats: {
            newBooking: res.cards?.new_booking ?? 0,
            scheduleRoom: res.cards?.schedule_room ?? 0,
            checkIn: res.cards?.check_in ?? 0,
            checkOut: res.cards?.check_out ?? 0,
          },
          cashTrend: (res.booking_trend || []).map((item: any) => ({
            day: item.date ? format(parseISO(item.date), "EEE") : "",
            amount: item.bookings ?? 0,
          })),
          activity: [],
          today: res.today || null,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
  }

  return {
    details: {
      stats: null,
      cashTrend: [],
      activity: [],
      today: null,
    },
  };
};
