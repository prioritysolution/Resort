import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { MenuCategory, MenuCategoryPayload } from "./types";

export const getMenuCategoryListAPI = () =>
  doGetApiCall<ApiListResponse<MenuCategory>>({
    url: endPoints.menuCategoryList,
  });

export const searchMenuCategoryAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<MenuCategory>>({
    url: endPoints.menuCategorySearch(keyword),
  });

export const addMenuCategoryAPI = (body: MenuCategoryPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.menuCategoryAdd,
    bodyData: body,
  });

export const updateMenuCategoryAPI = (
  id: number | string,
  body: MenuCategoryPayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.menuCategoryUpdate(id),
    bodyData: body,
  });

export const deleteMenuCategoryAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.menuCategoryDelete(id) });
