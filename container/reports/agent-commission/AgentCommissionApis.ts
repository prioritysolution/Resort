import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiListResponse } from "@/types/api";
import type { ReportListMeta } from "@/container/reports/shared/types";
import type { AgentCommissionReportRow } from "./types";

export type AgentCommissionReportResponse =
  ApiListResponse<AgentCommissionReportRow> & ReportListMeta;

export const getAgentCommissionReportAPI = (query: string) =>
  doGetApiCall<AgentCommissionReportResponse>({
    url: endPoints.reportAgentCommission(query),
  });
