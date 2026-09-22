import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "@/container/guest/shared/types";
import type {
  Payment,
  PaymentDueResponse,
  PaymentPayload,
} from "./types";

export const getPaymentListAPI = (filter?: string) =>
  doGetApiCall<
    ApiListResponse<Payment> & {
      due_amount?: number | string | null;
      amount_paid?: number | string | null;
      net_amount?: number | string | null;
      checkout_status?: number | string | null;
    }
  >({
    url: endPoints.paymentList(filter),
  });

export const getPaymentDueAPI = (reservationNo: string) =>
  doGetApiCall<PaymentDueResponse>({
    url: endPoints.paymentDue(reservationNo),
  });

export const getPaymentDetailsAPI = (value: string | number) =>
  doGetApiCall<GuestDataResponse<unknown>>({
    url: endPoints.paymentDetails(value),
  });

export const addPaymentAPI = (body: PaymentPayload) =>
  doPostApiCall<ApiCudResponse>({ url: endPoints.paymentAdd, bodyData: body });

export const updatePaymentAPI = (id: number | string, body: PaymentPayload) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.paymentUpdate(id),
    bodyData: body,
  });

export const deletePaymentAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.paymentDelete(id) });
