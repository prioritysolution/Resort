"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  addPaymentAPI,
  deletePaymentAPI,
  getPaymentDetailsAPI,
  getPaymentDueAPI,
  getPaymentListAPI,
  updatePaymentAPI,
} from "./PaymentApis";
import { buildPaymentReceipt, type PaymentReceipt } from "./paymentBill";
import type {
  Payment,
  PaymentDue,
  PaymentFormValues,
  PaymentListMeta,
  PaymentPayload,
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

const emptyValues: PaymentFormValues = {
  reservation_no: "",
  coll_date: "",
  remaining_amount: "",
  coll_mode: 1,
  final_coll: false,
};

const schema = yup.object({
  reservation_no: yup.string().required("Reservation number is required"),
  coll_date: yup.mixed<string | Date>().default(""),
  remaining_amount: yup
    .mixed<number | string>()
    .required("Amount is required")
    .test("amount", "Enter a valid amount greater than 0", (value) => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0;
    }),
  coll_mode: yup
    .number()
    .oneOf([1, 2, 3], "Select payment mode")
    .required("Payment mode is required"),
  final_coll: yup.boolean().required(),
});

export function usePayment() {
  const form = useForm<PaymentFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<PaymentFormValues>,
    defaultValues: emptyValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [receiptSaving, setReceiptSaving] = useState(false);
  const [pendingReceipt, setPendingReceipt] = useState<PaymentReceipt | null>(
    null,
  );
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [dueInfo, setDueInfo] = useState<PaymentDue | null>(null);
  const [dueLoading, setDueLoading] = useState(false);
  const [listMeta, setListMeta] = useState<PaymentListMeta | null>(null);
  const lastDueReservation = useRef("");
  const prefillDueAmount = useRef(true);

  const reservationNo = form.watch("reservation_no");

  const loadDue = useCallback(
    async (reservationNoValue: string, prefillAmount = true) => {
      const no = reservationNoValue.trim();
      if (!no) {
        lastDueReservation.current = "";
        setDueInfo(null);
        return;
      }

      setDueLoading(true);
      try {
        const response = await getPaymentDueAPI(no);
        if (!isApiSuccess(response)) {
          setDueInfo(null);
          lastDueReservation.current = "";
          toast.error(apiMessage(response, "Unable to load due amount"));
          return;
        }

        const data = response.data || null;
        const checkoutStatus = Number(
          data?.Checkout_Status ?? response.checkout_status ?? 0,
        );
        const dueAmount = data?.Due_Amount ?? response.due_amount ?? null;

        const next: PaymentDue = {
          ...(data || {}),
          Reservation_No: data?.Reservation_No || no,
          Checkout_Status: checkoutStatus,
          Due_Amount: dueAmount,
        };
        setDueInfo(next);
        lastDueReservation.current = no;

        if (prefillAmount && checkoutStatus === 1 && dueAmount != null) {
          form.setValue("remaining_amount", dueAmount, {
            shouldDirty: true,
            shouldValidate: false,
          });
        }
      } catch {
        setDueInfo(null);
        lastDueReservation.current = "";
        toast.error("Unable to load due amount");
      } finally {
        setDueLoading(false);
      }
    },
    [form],
  );

  useEffect(() => {
    const value = String(reservationNo || "").trim();
    if (!value) {
      lastDueReservation.current = "";
      setDueInfo(null);
      return;
    }
    if (lastDueReservation.current === value) return;

    const shouldPrefill = prefillDueAmount.current;
    const timer = window.setTimeout(() => {
      void loadDue(value, shouldPrefill);
      prefillDueAmount.current = true;
    }, 500);
    return () => window.clearTimeout(timer);
  }, [reservationNo, loadDue]);

  const getList = useCallback(async (filter?: string) => {
    const response = await getPaymentListAPI(filter);
    if (isApiSuccess(response)) {
      setListMeta({
        due_amount: response.due_amount ?? null,
        amount_paid: response.amount_paid ?? null,
        net_amount: response.net_amount ?? null,
        checkout_status: response.checkout_status ?? null,
      });
    } else {
      setListMeta(null);
    }
    return response;
  }, []);

  const crud = useGuestCrud<Payment, PaymentFormValues, PaymentPayload>({
    form,
    emptyValues,
    getList,
    getDetails: (r) => getPaymentDetailsAPI(r.Collection_Id || r.Coll_Id || ""),
    detailKeys: ["payment", "collection"],
    add: (body) =>
      addPaymentAPI({
        reservation_no: body.reservation_no,
        ...(body.coll_date ? { coll_date: body.coll_date } : {}),
        remaining_amount: Number(body.remaining_amount ?? body.coll_amount),
        coll_mode: body.coll_mode,
        final_coll: body.final_coll,
      }),
    update: (id, body) =>
      updatePaymentAPI(id, {
        reservation_no: body.reservation_no,
        ...(body.coll_date ? { coll_date: body.coll_date } : {}),
        coll_amount: Number(body.coll_amount ?? body.remaining_amount),
        coll_mode: body.coll_mode,
        final_coll: body.final_coll,
      }),
    remove: deletePaymentAPI,
    getId: (r) => r.Collection_Id || r.Coll_Id,
    entityName: "payments",
    toValues: (r) => ({
      reservation_no: r.Reservation_No || "",
      coll_date: r.Coll_Date || "",
      remaining_amount: r.Coll_Amount || "",
      coll_mode: Number(r.Coll_Mode) || 1,
      final_coll: Boolean(
        r.Final_Coll === true || Number(r.Final_Coll) === 1,
      ),
    }),
    toPayload: (v) => {
      const amount = Number(v.remaining_amount);
      const date = toApiDate(v.coll_date);
      return {
        reservation_no: v.reservation_no.trim(),
        ...(date ? { coll_date: date } : {}),
        remaining_amount: amount,
        coll_amount: amount,
        coll_mode: Number(v.coll_mode),
        final_coll: v.final_coll,
      };
    },
  });

  const openCreate = () => {
    lastDueReservation.current = "";
    prefillDueAmount.current = true;
    setDueInfo(null);
    crud.openCreate();
  };

  const openEdit = async (row: Payment) => {
    lastDueReservation.current = "";
    prefillDueAmount.current = false;
    setDueInfo(null);
    await crud.openEdit(row);
  };

  const closeDialog = () => {
    lastDueReservation.current = "";
    prefillDueAmount.current = true;
    setDueInfo(null);
    crud.closeDialog();
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    setReceiptSaving(true);
    try {
      const amount = Number(values.remaining_amount);
      const date = toApiDate(values.coll_date);
      const editing = crud.editingRow;
      const id = editing
        ? editing.Collection_Id || editing.Coll_Id
        : undefined;
      const body = {
        reservation_no: values.reservation_no.trim(),
        ...(date ? { coll_date: date } : {}),
        coll_mode: Number(values.coll_mode),
        final_coll: values.final_coll,
      };
      const response =
        id != null
          ? await updatePaymentAPI(id, { ...body, coll_amount: amount })
          : await addPaymentAPI({ ...body, remaining_amount: amount });

      if (!isApiSuccess(response)) {
        toast.error(apiMessage(response, "Save failed"));
        return;
      }

      const next = buildPaymentReceipt(
        { ...values, coll_date: date || values.coll_date },
        dueInfo,
      );
      setPendingReceipt(next);
      closeDialog();
      void crud.reload().catch(() => {
        /* list refresh is best-effort after the receipt is shown */
      });
    } finally {
      setReceiptSaving(false);
    }
  };

  useEffect(() => {
    if (crud.dialogOpen || !pendingReceipt) return;
    setReceipt(pendingReceipt);
    setReceiptOpen(true);
    setPendingReceipt(null);
  }, [crud.dialogOpen, pendingReceipt]);

  const closeReceipt = () => {
    setReceiptOpen(false);
    setReceipt(null);
    setPendingReceipt(null);
  };

  const checkoutDone = Number(dueInfo?.Checkout_Status) === 1;

  return {
    ...crud,
    saving: receiptSaving || crud.saving,
    openCreate,
    openEdit,
    closeDialog,
    handleSubmit,
    receipt,
    receiptOpen,
    closeReceipt,
    dueInfo,
    dueLoading,
    checkoutDone,
    listMeta,
    loadDue: () => {
      lastDueReservation.current = "";
      return loadDue(form.getValues("reservation_no"), true);
    },
  };
}
