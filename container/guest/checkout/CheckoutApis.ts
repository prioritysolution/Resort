import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "@/container/guest/shared/types";
import type { Checkout, CheckoutPayload, CheckoutSummary } from "./types";

export const getCheckoutListAPI = (filter?: string) =>
  doGetApiCall<ApiListResponse<Checkout>>({
    url: endPoints.checkoutList(filter),
  });
export const getCheckoutDetailsAPI = (value: string | number) =>
  doGetApiCall<GuestDataResponse<unknown>>({
    url: endPoints.checkoutDetails(value),
  });
export const addCheckoutAPI = (body: CheckoutPayload) =>
  doPostApiCall<ApiCudResponse>({ url: endPoints.checkoutAdd, bodyData: body });

export const deleteCheckoutAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.checkoutDelete(id) });

export const getCheckoutSummaryAPI = (reservationNo: string) =>
  doGetApiCall<GuestDataResponse<CheckoutSummary>>({
    url: endPoints.checkoutSummary(reservationNo),
  });
