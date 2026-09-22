import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiListResponse } from "@/types/api";
import type { ReportListMeta } from "@/container/reports/shared/types";
import type { CollectionReportRow } from "./types";

export type CollectionReportResponse = ApiListResponse<CollectionReportRow> &
  ReportListMeta;

export const getCollectionReportAPI = (query: string) =>
  doGetApiCall<CollectionReportResponse>({
    url: endPoints.reportCollection(query),
  });
