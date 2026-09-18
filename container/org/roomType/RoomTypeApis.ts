import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { RoomType, RoomTypePayload } from "./types";

export const getRoomTypeListAPI = () =>
  doGetApiCall<ApiListResponse<RoomType>>({ url: endPoints.roomTypeList });

export const searchRoomTypeAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<RoomType>>({
    url: endPoints.roomTypeSearch(keyword),
  });

export const addRoomTypeAPI = (body: RoomTypePayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.roomTypeAdd,
    bodyData: body,
  });

export const updateRoomTypeAPI = (id: number | string, body: RoomTypePayload) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.roomTypeUpdate(id),
    bodyData: body,
  });

export const deleteRoomTypeAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.roomTypeDelete(id) });
