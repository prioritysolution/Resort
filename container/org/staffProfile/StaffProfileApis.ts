import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { StaffProfile, StaffProfilePayload } from "./types";

export const getStaffProfileListAPI = () =>
  doGetApiCall<ApiListResponse<StaffProfile>>({
    url: endPoints.staffProfileList,
  });

export const searchStaffProfileAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<StaffProfile>>({
    url: endPoints.staffProfileSearch(keyword),
  });

export const addStaffProfileAPI = (body: StaffProfilePayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.staffProfileAdd,
    bodyData: body,
  });

export const updateStaffProfileAPI = (
  id: number | string,
  body: StaffProfilePayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.staffProfileUpdate(id),
    bodyData: body,
  });

export const deleteStaffProfileAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.staffProfileDelete(id) });
