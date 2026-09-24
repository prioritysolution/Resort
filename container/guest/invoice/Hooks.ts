"use client";

import { useCallback, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import type { Checkout } from "@/container/guest/checkout/types";
import {
  apiMessage,
  extractListRows,
  isApiSuccess,
} from "@/container/guest/shared/types";
import { getInvoiceListAPI } from "./InvoiceApis";
import type { InvoiceFormValues } from "./types";

const schema = yup.object({
  reservation_no: yup
    .string()
    .trim()
    .required("Reservation number is required"),
});

export function useInvoice() {
  const form = useForm<InvoiceFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<InvoiceFormValues>,
    defaultValues: { reservation_no: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [bills, setBills] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (values: InvoiceFormValues) => {
    const reservationNo = values.reservation_no.trim();
    if (!reservationNo) {
      toast.error("Reservation number is required");
      return;
    }

    setLoading(true);
    try {
      const response = await getInvoiceListAPI(reservationNo);
      if (!isApiSuccess(response)) {
        setBills([]);
        toast.error(apiMessage(response, "Invoice not found"));
        return;
      }
      setBills(
        extractListRows<Checkout>(response as unknown as Record<string, unknown>),
      );
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }, []);

  return { form, bills, loading, searched, search };
}
