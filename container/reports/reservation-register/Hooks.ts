"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  apiMessage,
  extractListRows,
  isApiSuccess,
} from "@/container/guest/shared/types";
import {
  buildDateQueryParams,
  emptyDateFilterValues,
  toQueryString,
  type ReportListMeta,
} from "@/container/reports/shared/types";
import { getReservationReportAPI } from "./ReservationRegisterApis";
import type {
  ReservationReportFormValues,
  ReservationReportRow,
} from "./types";

const schema = yup.object({
  date_mode: yup.mixed<"range" | "month">().oneOf(["range", "month"]).required(),
  from_date: yup.mixed<string | Date>().default(""),
  to_date: yup.mixed<string | Date>().default(""),
  month: yup.string().default(""),
  reservation_no: yup.string().default(""),
});

export function useReservationRegister() {
  const form = useForm<ReservationReportFormValues>({
    resolver: yupResolver(
      schema,
    ) as unknown as Resolver<ReservationReportFormValues>,
    defaultValues: {
      ...emptyDateFilterValues(),
      reservation_no: "",
    },
    mode: "onSubmit",
  });

  const [rows, setRows] = useState<ReservationReportRow[]>([]);
  const [meta, setMeta] = useState<ReportListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const dateMode = form.watch("date_mode");
  const prevDateMode = useRef(dateMode);

  useEffect(() => {
    if (prevDateMode.current === dateMode) return;
    prevDateMode.current = dateMode;
    setRows([]);
    setMeta(null);
    setSearched(false);
  }, [dateMode]);

  const runReport = useCallback(
    async (values: ReservationReportFormValues) => {
      const reservationNo = values.reservation_no.trim();
      const dateParams = buildDateQueryParams(values);
      const hasDates =
        values.date_mode === "month"
          ? Boolean(dateParams.month)
          : Boolean(dateParams.from_date && dateParams.to_date);

      if (!reservationNo && !hasDates) {
        toast.error("Enter a reservation number or select dates / month");
        return;
      }

      setLoading(true);
      try {
        const response = await getReservationReportAPI(
          toQueryString({
            ...dateParams,
            ...(reservationNo ? { reservation_no: reservationNo } : {}),
          }),
        );
        setSearched(true);
        if (!isApiSuccess(response)) {
          setRows([]);
          setMeta(null);
          toast.error(
            apiMessage(response, "Unable to load reservation report"),
          );
          return;
        }
        setRows(
          extractListRows<ReservationReportRow>(
            response as unknown as Record<string, unknown>,
          ),
        );
        setMeta({
          total_records: response.total_records ?? null,
          total_amount_paid: response.total_amount_paid ?? null,
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { form, rows, meta, loading, searched, runReport };
}
