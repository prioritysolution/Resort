import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { RoomDetail, RoomDetailPayload } from "./types";

export const getRoomDetailsListAPI = (roomType?: number | string) =>
  doGetApiCall<ApiListResponse<RoomDetail>>({
    url: endPoints.roomDetailsList(roomType),
  });

export const searchRoomDetailsAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<RoomDetail>>({
    url: endPoints.roomDetailsSearch(keyword),
  });

export const addRoomDetailsAPI = (body: RoomDetailPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.roomDetailsAdd,
    bodyData: body,
  });

export const updateRoomDetailsAPI = (
  id: number | string,
  body: RoomDetailPayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.roomDetailsUpdate(id),
    bodyData: body,
  });

export const deleteRoomDetailsAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.roomDetailsDelete(id) });
