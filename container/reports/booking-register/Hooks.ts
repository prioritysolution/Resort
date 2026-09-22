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
import { getBookingReportAPI } from "./BookingRegisterApis";
import type { BookingReportFormValues, BookingReportRow } from "./types";

const schema = yup.object({
  date_mode: yup.mixed<"range" | "month">().oneOf(["range", "month"]).required(),
  from_date: yup.mixed<string | Date>().default(""),
  to_date: yup.mixed<string | Date>().default(""),
  month: yup.string().default(""),
});

export function useBookingRegister() {
  const form = useForm<BookingReportFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<BookingReportFormValues>,
    defaultValues: emptyDateFilterValues(),
    mode: "onSubmit",
  });

  const [rows, setRows] = useState<BookingReportRow[]>([]);
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
    async (values: BookingReportFormValues) => {
      const dateParams = buildDateQueryParams(values);
      if (
        values.date_mode === "month"
          ? !dateParams.month
          : !dateParams.from_date || !dateParams.to_date
      ) {
        toast.error(
          values.date_mode === "month"
            ? "Select a month"
            : "Select from date and to date",
        );
        return;
      }

      setLoading(true);
      try {
        const response = await getBookingReportAPI(toQueryString(dateParams));
        setSearched(true);
        if (!isApiSuccess(response)) {
          setRows([]);
          setMeta(null);
          toast.error(apiMessage(response, "Unable to load booking report"));
          return;
        }
        setRows(
          extractListRows<BookingReportRow>(
            response as unknown as Record<string, unknown>,
          ),
        );
        setMeta({
          total_records: response.total_records ?? null,
          total_advance: response.total_advance ?? null,
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    form,
    rows,
    meta,
    loading,
    searched,
    runReport,
  };
}
