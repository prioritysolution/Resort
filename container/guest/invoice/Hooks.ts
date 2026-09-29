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
  type: yup.string().oneOf(["room", "food"]).required(),
});

export function useInvoice() {
  const form = useForm<InvoiceFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<InvoiceFormValues>,
    defaultValues: { reservation_no: "", type: "room" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [bills, setBills] = useState<any[]>([]); // Assuming 'any' for now since the new API structure is different
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
      const response = await getInvoiceListAPI(reservationNo, values.type);
      if (!isApiSuccess(response)) {
        setBills([]);
        toast.error(apiMessage(response, "Invoice not found"));
        return;
      }
      
      // The API returns a single invoice object, so we put it in an array to map over it in the view, or we can change how bills are handled.
      // Based on API doc, response format is { Error_Code: 0, Message: "Success", invoice: { ... } }
      const invoiceData = (response as any).invoice;
      if (invoiceData) {
        setBills([{ ...invoiceData, _type: values.type }]); // Added _type to help InvoiceBill differentiate if needed
      } else {
        setBills([]);
      }
    } catch (error) {
      setBills([]);
      toast.error("Failed to fetch invoice");
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }, []);

  return { form, bills, loading, searched, search };
}
