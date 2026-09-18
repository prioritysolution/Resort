import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { PaidService, PaidServicePayload } from "./types";

export const getPaidServiceListAPI = () =>
  doGetApiCall<ApiListResponse<PaidService>>({
    url: endPoints.paidServiceList,
  });

export const searchPaidServiceAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<PaidService>>({
    url: endPoints.paidServiceSearch(keyword),
  });

export const addPaidServiceAPI = (body: PaidServicePayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.paidServiceAdd,
    bodyData: body,
  });

export const updatePaidServiceAPI = (
  id: number | string,
  body: PaidServicePayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.paidServiceUpdate(id),
    bodyData: body,
  });

export const deletePaidServiceAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.paidServiceDelete(id) });
