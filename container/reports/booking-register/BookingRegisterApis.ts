import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiListResponse } from "@/types/api";
import type { ReportListMeta } from "@/container/reports/shared/types";
import type { BookingReportRow } from "./types";

export type BookingReportResponse = ApiListResponse<BookingReportRow> &
  ReportListMeta;

export const getBookingReportAPI = (query: string) =>
  doGetApiCall<BookingReportResponse>({
    url: endPoints.reportBooking(query),
  });
