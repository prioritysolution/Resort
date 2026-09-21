"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import { getPaidServiceListAPI } from "@/container/org/paidService/PaidServiceApis";
import {
  addServiceOrderAPI,
  deleteServiceOrderAPI,
  getServiceOrderDetailsAPI,
  getServiceOrderListAPI,
  updateServiceOrderAPI,
} from "./ServiceOrderApis";
import type {
  ServiceOrder,
  ServiceOrderFormValues,
  ServiceOrderPayload,
} from "./types";
import { format, isValid } from "date-fns";

const toApiDate = (value: Date | string | null | undefined) => {
  if (!value) return "";
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : "";
  }
  const parsed = new Date(String(value));
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : String(value);
};

const emptyValues: ServiceOrderFormValues = {
  reservation_no: "",
  order_date: "",
  service_id: "",
  quantity: 1,
  remarks: "",
};
const schema = yup.object({
  reservation_no: yup.string().required(),
  order_date: yup.mixed<string | Date>().nullable().default(""),
  service_id: yup.mixed().required(),
  quantity: yup.number().integer().min(1).default(1),
  remarks: yup.string().default(""),
});
export function useServiceOrder() {
  const form = useForm<ServiceOrderFormValues>({
    resolver: yupResolver(
      schema,
    ) as unknown as Resolver<ServiceOrderFormValues>,
    defaultValues: emptyValues,
  });
  const [services, setServices] = useState<Array<{ Id: number; Name: string }>>(
    [],
  );
  useEffect(() => {
    void getPaidServiceListAPI().then((r) =>
      setServices(
        (r.data || [])
          .filter((x) => Number(x.Status) === 1)
          .map((x) => ({ Id: x.Service_Id, Name: x.Service_Name })),
      ),
    );
  }, []);
  const crud = useGuestCrud<
    ServiceOrder,
    ServiceOrderFormValues,
    ServiceOrderPayload
  >({
    form,
    emptyValues,
    getList: getServiceOrderListAPI,
    getDetails: (r) =>
      getServiceOrderDetailsAPI(r.Serv_Ord_Id || r.Service_Order_Id || ""),
    detailKeys: ["service_order", "order"],
    add: addServiceOrderAPI,
    update: updateServiceOrderAPI,
    remove: deleteServiceOrderAPI,
    getId: (r) => r.Serv_Ord_Id || r.Service_Order_Id,
    entityName: "service orders",
    toValues: (r) => ({
      reservation_no: r.Reservation_No || "",
      order_date: r.Order_Date || "",
      service_id: r.Service_Id || "",
      quantity: r.Quantity || 1,
      remarks: r.Remarks || "",
    }),
    toPayload: (v) => {
      const orderDate = toApiDate(v.order_date);
      return {
        reservation_no: v.reservation_no.trim(),
        ...(orderDate ? { order_date: orderDate } : {}),
        service_id: Number(v.service_id),
        quantity: Number(v.quantity || 1),
        ...(v.remarks.trim() ? { remarks: v.remarks.trim() } : {}),
      };
    },
  });
  return { ...crud, services };
}
