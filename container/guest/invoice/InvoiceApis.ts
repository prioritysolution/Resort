import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiListResponse } from "@/types/api";
import type { Checkout } from "@/container/guest/checkout/types";

export const getInvoiceListAPI = (reservationNo: string, type: "room" | "food") => {
  const url = type === "room" ? endPoints.invoiceRoom(reservationNo) : endPoints.invoiceFood(reservationNo);
  return doGetApiCall<any>({ url });
};
