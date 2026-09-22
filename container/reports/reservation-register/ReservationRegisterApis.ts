import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiListResponse } from "@/types/api";
import type { ReportListMeta } from "@/container/reports/shared/types";
import type { ReservationReportRow } from "./types";

export type ReservationReportResponse = ApiListResponse<ReservationReportRow> &
  ReportListMeta;

export const getReservationReportAPI = (query: string) =>
  doGetApiCall<ReservationReportResponse>({
    url: endPoints.reportReservation(query),
  });
