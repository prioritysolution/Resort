import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "@/container/guest/shared/types";
import type { FoodOrder, FoodOrderPayload } from "./types";

export const getFoodOrderListAPI = (filter?: string) =>
  doGetApiCall<ApiListResponse<FoodOrder>>({
    url: endPoints.foodOrderList(filter),
  });
export const getFoodOrderDetailsAPI = (value: string | number) =>
  doGetApiCall<GuestDataResponse<unknown>>({
    url: endPoints.foodOrderDetails(value),
  });
export const addFoodOrderAPI = (body: FoodOrderPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.foodOrderAdd,
    bodyData: body,
  });

export const updateFoodOrderAPI = (
  id: number | string,
  body: FoodOrderPayload | Partial<FoodOrderPayload>,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.foodOrderUpdate(id),
    bodyData: body,
  });

export const deleteFoodOrderAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.foodOrderDelete(id) });
