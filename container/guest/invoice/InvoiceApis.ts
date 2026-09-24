import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiListResponse } from "@/types/api";
import type { Checkout } from "@/container/guest/checkout/types";

export const getInvoiceListAPI = (reservationNo: string) =>
  doGetApiCall<ApiListResponse<Checkout>>({
    url: endPoints.checkoutList(reservationNo),
  });
