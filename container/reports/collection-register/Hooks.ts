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
import { getCollectionReportAPI } from "./CollectionRegisterApis";
import type {
  CollectionReportFormValues,
  CollectionReportRow,
} from "./types";

const schema = yup.object({
  collection_type: yup
    .mixed<"summary" | "reservation" | "booking">()
    .oneOf(["summary", "reservation", "booking"])
    .required(),
  date_mode: yup.mixed<"range" | "month">().oneOf(["range", "month"]).required(),
  from_date: yup.mixed<string | Date>().default(""),
  to_date: yup.mixed<string | Date>().default(""),
  month: yup.string().default(""),
  reservation_no: yup.string().default(""),
  booking_no: yup.string().default(""),
});

export function useCollectionRegister() {
  const form = useForm<CollectionReportFormValues>({
    resolver: yupResolver(
      schema,
    ) as unknown as Resolver<CollectionReportFormValues>,
    defaultValues: {
      ...emptyDateFilterValues(),
      collection_type: "summary",
      reservation_no: "",
      booking_no: "",
    },
    mode: "onSubmit",
  });

  const [rows, setRows] = useState<CollectionReportRow[]>([]);
  const [meta, setMeta] = useState<ReportListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const dateMode = form.watch("date_mode");
  const collectionType = form.watch("collection_type");
  const prevFilterKey = useRef(`${collectionType}:${dateMode}`);

  useEffect(() => {
    const key = `${collectionType}:${dateMode}`;
    if (prevFilterKey.current === key) return;
    prevFilterKey.current = key;
    setRows([]);
    setMeta(null);
    setSearched(false);
  }, [collectionType, dateMode]);

  const runReport = useCallback(
    async (values: CollectionReportFormValues) => {
      const dateParams = buildDateQueryParams(values);
      if (values.date_mode === "month" && !dateParams.month) {
        toast.error("Select a month");
        return;
      }

      const reservationNo = values.reservation_no.trim();
      if (values.collection_type === "reservation" && !reservationNo) {
        toast.error("Reservation number is required for reservation type");
        return;
      }

      const bookingNo = values.booking_no.trim();
      if (values.collection_type === "booking" && !bookingNo) {
        toast.error("Booking number is required for booking type");
        return;
      }

      setLoading(true);
      try {
        const response = await getCollectionReportAPI(
          toQueryString({
            collection_type: values.collection_type,
            ...dateParams,
            ...(values.collection_type === "reservation"
              ? { reservation_no: reservationNo }
              : {}),
            ...(values.collection_type === "booking"
              ? { booking_no: bookingNo }
              : {}),
          }),
        );
        setSearched(true);
        if (!isApiSuccess(response)) {
          setRows([]);
          setMeta(null);
          toast.error(
            apiMessage(response, "Unable to load collection report"),
          );
          return;
        }
        setRows(
          extractListRows<CollectionReportRow>(
            response as unknown as Record<string, unknown>,
          ),
        );
        setMeta({
          collection_type: response.collection_type ?? values.collection_type,
          reservation_no: response.reservation_no ?? null,
          booking_no:
            response.booking_no ??
            (values.collection_type === "booking" ? bookingNo : null),
          total_records: response.total_records ?? null,
          total_collection: response.total_collection ?? null,
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { form, rows, meta, loading, searched, runReport };
}
