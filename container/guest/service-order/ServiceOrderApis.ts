import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "@/container/guest/shared/types";
import type { ServiceOrder, ServiceOrderPayload } from "./types";

export const getServiceOrderListAPI = (filter?: string) =>
  doGetApiCall<ApiListResponse<ServiceOrder>>({
    url: endPoints.serviceOrderList(filter),
  });
export const getServiceOrderDetailsAPI = (value: string | number) =>
  doGetApiCall<GuestDataResponse<unknown>>({
    url: endPoints.serviceOrderDetails(value),
  });
export const addServiceOrderAPI = (body: ServiceOrderPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.serviceOrderAdd,
    bodyData: body,
  });

export const updateServiceOrderAPI = (
  id: number | string,
  body: ServiceOrderPayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.serviceOrderUpdate(id),
    bodyData: body,
  });

export const deleteServiceOrderAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.serviceOrderDelete(id) });
