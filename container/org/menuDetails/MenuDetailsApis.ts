import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { MenuDetail, MenuDetailPayload } from "./types";

export const getMenuDetailsListAPI = (categoryId?: number | string) =>
  doGetApiCall<ApiListResponse<MenuDetail>>({
    url: endPoints.menuDetailsList(categoryId),
  });

export const searchMenuDetailsAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<MenuDetail>>({
    url: endPoints.menuDetailsSearch(keyword),
  });

export const addMenuDetailsAPI = (body: MenuDetailPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.menuDetailsAdd,
    bodyData: body,
  });

export const updateMenuDetailsAPI = (
  id: number | string,
  body: MenuDetailPayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.menuDetailsUpdate(id),
    bodyData: body,
  });

export const deleteMenuDetailsAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.menuDetailsDelete(id) });
