import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { RegularRate, RegularRatePayload, SpecialRate, SpecialRatePayload } from "./types";

export const getRegularRateListAPI = (roomTid?: number | string) =>
  doGetApiCall<ApiListResponse<RegularRate>>({
    url: endPoints.regularRateList(roomTid),
  });

export const searchRegularRateAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<RegularRate>>({
    url: endPoints.regularRateSearch(keyword),
  });

export const addRegularRateAPI = (body: RegularRatePayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.regularRateAdd,
    bodyData: body,
  });

export const updateRegularRateAPI = (
  id: number | string,
  body: RegularRatePayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.regularRateUpdate(id),
    bodyData: body,
  });

export const deleteRegularRateAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.regularRateDelete(id) });

export const getSpecialRateListAPI = (roomTid?: number | string) =>
  doGetApiCall<ApiListResponse<SpecialRate>>({
    url: endPoints.specialRateList(roomTid),
  });

export const searchSpecialRateAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<SpecialRate>>({
    url: endPoints.specialRateSearch(keyword),
  });

export const addSpecialRateAPI = (body: SpecialRatePayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.specialRateAdd,
    bodyData: body,
  });

export const updateSpecialRateAPI = (
  id: number | string,
  body: SpecialRatePayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.specialRateUpdate(id),
    bodyData: body,
  });

export const deleteSpecialRateAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.specialRateDelete(id) });
