"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import {
  apiMessage,
  isApiSuccess,
} from "@/container/guest/shared/types";
import {
  addCheckoutAPI,
  deleteCheckoutAPI,
  getCheckoutDetailsAPI,
  getCheckoutListAPI,
  getCheckoutSummaryAPI,
} from "./CheckoutApis";
import { parseCheckoutBill } from "./checkoutBill";
import {
  checkoutDateOf,
  type Checkout,
  type CheckoutFormValues,
  type CheckoutPayload,
  type CheckoutSummary,
} from "./types";

const toApiDate = (value: string | Date | undefined | null) => {
  if (!value) return "";
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : format(value, "yyyy-MM-dd");
  }
  const s = String(value).trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : format(d, "yyyy-MM-dd");
};

const emptyValues: CheckoutFormValues = {
  reservation_no: "",
  checkout_date: "",
};

const schema = yup.object({
  reservation_no: yup.string().required("Reservation number is required"),
  checkout_date: yup.mixed<string | Date>().default(""),
});

export function useCheckout() {
  const form = useForm<CheckoutFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<CheckoutFormValues>,
    defaultValues: emptyValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [bill, setBill] = useState<Checkout | null>(null);
  const [billOpen, setBillOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
      checkout_date: checkoutDateOf(r),
    }),
    toPayload: (v) => {
      const date = toApiDate(v.checkout_date);
      return {
        reservation_no: v.reservation_no.trim(),
        ...(date ? { checkout_date: date } : {}),
      };
    },
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
      if (isApiSuccess(response) && response.data) {
        setSummary(response.data as CheckoutSummary);
      } else {
        setSummary(null);
        toast.error(apiMessage(response, "Unable to load summary"));
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

  const closeBill = () => {
    setBillOpen(false);
    setBill(null);
  };

  const handleSubmit = async (values: CheckoutFormValues) => {
    setSaving(true);
    try {
      const date = toApiDate(values.checkout_date);
      const response = await addCheckoutAPI({
        reservation_no: values.reservation_no.trim(),
        ...(date ? { checkout_date: date } : {}),
      });

      if (!isApiSuccess(response)) {
        toast.error(apiMessage(response, "Checkout failed"));
        return;
      }

      const guestFallback =
        summary?.Guest_Name != null ? String(summary.Guest_Name) : undefined;
      const parsed =
        parseCheckoutBill(response.data, guestFallback) ||
        parseCheckoutBill(response, guestFallback) ||
        ({
          Reservation_No: values.reservation_no.trim(),
          CheckOut_Date: date || undefined,
          Guest_Name: guestFallback,
        } satisfies Checkout);

      setSummary(null);
      crud.closeDialog();

      // Open bill immediately — don't wait on list reload
      setBill(parsed);
      setBillOpen(true);

      void crud.reload().catch(() => {
        /* list refresh is best-effort after bill is shown */
      });
    } catch {
      toast.error("Checkout failed");
    } finally {
      setSaving(false);
    }
  };

  return {
    ...crud,
    saving: saving || crud.saving,
    openCreate,
    closeDialog,
    handleSubmit,
    summary,
    summaryLoading,
    previewSummary,
    bill,
    billOpen,
    closeBill,
  };
}
