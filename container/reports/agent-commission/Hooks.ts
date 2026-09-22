"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  apiMessage,
  extractListRows,
  isApiSuccess,
} from "@/container/guest/shared/types";
import { getTravelAgentListAPI } from "@/container/org/travelAgent/TravelAgentApis";
import {
  toQueryString,
  toReportDate,
  type ReportListMeta,
} from "@/container/reports/shared/types";
import { getAgentCommissionReportAPI } from "./AgentCommissionApis";
import type {
  AgentCommissionReportFormValues,
  AgentCommissionReportRow,
} from "./types";

const schema = yup.object({
  commission_type: yup
    .mixed<"all" | "agent">()
    .oneOf(["all", "agent"])
    .required(),
  month: yup.string().required("Month is required"),
  agent_id: yup.mixed<number | string>().default(""),
});

export function useAgentCommission() {
  const form = useForm<AgentCommissionReportFormValues>({
    resolver: yupResolver(
      schema,
    ) as unknown as Resolver<AgentCommissionReportFormValues>,
    defaultValues: {
      commission_type: "all",
      month: format(new Date(), "yyyy-MM"),
      agent_id: "",
    },
    mode: "onSubmit",
  });

  const [rows, setRows] = useState<AgentCommissionReportRow[]>([]);
  const [meta, setMeta] = useState<ReportListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [agents, setAgents] = useState<Array<{ Id: number; Name: string }>>(
    [],
  );

  const commissionType = form.watch("commission_type");
  const prevCommissionType = useRef(commissionType);

  useEffect(() => {
    if (prevCommissionType.current === commissionType) return;
    prevCommissionType.current = commissionType;
    setRows([]);
    setMeta(null);
    setSearched(false);
  }, [commissionType]);

  useEffect(() => {
    void getTravelAgentListAPI().then((response) => {
      if (!isApiSuccess(response)) return;
      setAgents(
        (response.data || [])
          .filter((x) => Number(x.Status) === 1)
          .map((x) => ({ Id: x.Agent_Id, Name: x.Agent_Name })),
      );
    });
  }, []);

  const runReport = useCallback(
    async (values: AgentCommissionReportFormValues) => {
      const month = toReportDate(values.month).slice(0, 7);
      if (!month) {
        toast.error("Select a month");
        return;
      }
      if (values.commission_type === "agent" && !values.agent_id) {
        toast.error("Select an agent");
        return;
      }

      setLoading(true);
      try {
        const response = await getAgentCommissionReportAPI(
          toQueryString({
            commission_type: values.commission_type,
            month,
            ...(values.commission_type === "agent"
              ? { agent_id: Number(values.agent_id) }
              : {}),
          }),
        );
        setSearched(true);
        if (!isApiSuccess(response)) {
          setRows([]);
          setMeta(null);
          toast.error(
            apiMessage(response, "Unable to load agent commission report"),
          );
          return;
        }
        setRows(
          extractListRows<AgentCommissionReportRow>(
            response as unknown as Record<string, unknown>,
          ),
        );
        setMeta({
          commission_type: response.commission_type ?? values.commission_type,
          month: response.month ?? month,
          agent_id: response.agent_id ?? null,
          total_records: response.total_records ?? null,
          total_room_bill: response.total_room_bill ?? null,
          total_commission: response.total_commission ?? null,
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { form, rows, meta, loading, searched, agents, runReport };
}
