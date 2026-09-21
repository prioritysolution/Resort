"use client";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import {
  addPaymentAPI,
  deletePaymentAPI,
  getPaymentDetailsAPI,
  getPaymentListAPI,
  updatePaymentAPI,
} from "./PaymentApis";
import type { Payment, PaymentFormValues, PaymentPayload } from "./types";
const emptyValues: PaymentFormValues = {
  reservation_no: "",
  coll_date: "",
  coll_amount: "",
  coll_mode: 1,
  final_coll: false,
};
const schema = yup.object({
  reservation_no: yup.string().required(),
  coll_date: yup.string().default(""),
  coll_amount: yup.number().min(0.01).required(),
  coll_mode: yup.number().integer().min(1).required(),
  final_coll: yup.boolean().required(),
});
export function usePayment() {
  const form = useForm<PaymentFormValues>({
    resolver: yupResolver(schema) as Resolver<PaymentFormValues>,
    defaultValues: emptyValues,
  });
  return useGuestCrud<Payment, PaymentFormValues, PaymentPayload>({
    form,
    emptyValues,
    getList: getPaymentListAPI,
    getDetails: (r) => getPaymentDetailsAPI(r.Collection_Id || r.Coll_Id || ""),
    detailKeys: ["payment", "collection"],
    add: addPaymentAPI,
    update: updatePaymentAPI,
    remove: deletePaymentAPI,
    getId: (r) => r.Collection_Id || r.Coll_Id,
    entityName: "payments",
    toValues: (r) => ({
      reservation_no: r.Reservation_No || "",
      coll_date: r.Coll_Date || "",
      coll_amount: r.Coll_Amount || "",
      coll_mode: r.Coll_Mode || 1,
      final_coll: Boolean(r.Final_Coll),
    }),
    toPayload: (v) => ({
      reservation_no: v.reservation_no.trim(),
      ...(v.coll_date ? { coll_date: v.coll_date } : {}),
      coll_amount: Number(v.coll_amount),
      coll_mode: Number(v.coll_mode),
      final_coll: v.final_coll,
    }),
  });
}
