"use client";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import { isApiSuccess } from "@/container/guest/shared/types";
import {
  addCheckoutAPI,
  deleteCheckoutAPI,
  getCheckoutDetailsAPI,
  getCheckoutListAPI,
  getCheckoutSummaryAPI,
} from "./CheckoutApis";
import type {
  Checkout,
  CheckoutFormValues,
  CheckoutPayload,
  CheckoutSummary,
} from "./types";
const emptyValues: CheckoutFormValues = {
  reservation_no: "",
  checkout_date: "",
};
const schema = yup.object({
  reservation_no: yup.string().required(),
  checkout_date: yup.string().default(""),
});
export function useCheckout() {
  const form = useForm<CheckoutFormValues>({
    resolver: yupResolver(schema) as Resolver<CheckoutFormValues>,
    defaultValues: emptyValues,
  });
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const crud = useGuestCrud<Checkout, CheckoutFormValues, CheckoutPayload>({
    form,
    emptyValues,
    getList: getCheckoutListAPI,
    getDetails: (r) => getCheckoutDetailsAPI(r.Checkout_Id || r.Bill_Id || ""),
    detailKeys: ["checkout", "bill"],
    add: addCheckoutAPI,
    remove: deleteCheckoutAPI,
    getId: (r) => r.Checkout_Id || r.Bill_Id,
    entityName: "checkouts",
    toValues: (r) => ({
      reservation_no: r.Reservation_No || "",
      checkout_date: r.Checkout_Date || "",
    }),
    toPayload: (v) => ({
      reservation_no: v.reservation_no.trim(),
      ...(v.checkout_date ? { checkout_date: v.checkout_date } : {}),
    }),
  });
  const previewSummary = async () => {
    const no = form.getValues("reservation_no").trim();
    if (!no) {
      form.setError("reservation_no", {
        message: "Reservation number is required",
      });
      return;
    }
    setSummaryLoading(true);
    try {
      const response = await getCheckoutSummaryAPI(no);
      if (isApiSuccess(response) && response.data) setSummary(response.data);
      else {
        setSummary(null);
        toast.error(
          response.Message || response.message || "Unable to load summary",
        );
      }
    } finally {
      setSummaryLoading(false);
    }
  };
  const openCreate = () => {
    setSummary(null);
    crud.openCreate();
  };
  const closeDialog = () => {
    setSummary(null);
    crud.closeDialog();
  };
  return {
    ...crud,
    openCreate,
    closeDialog,
    summary,
    summaryLoading,
    previewSummary,
  };
}
