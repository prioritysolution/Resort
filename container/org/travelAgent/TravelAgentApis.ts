import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { TravelAgent, TravelAgentPayload } from "./types";

export const getTravelAgentListAPI = () =>
  doGetApiCall<ApiListResponse<TravelAgent>>({
    url: endPoints.travelAgentList,
  });

export const searchTravelAgentAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<TravelAgent>>({
    url: endPoints.travelAgentSearch(keyword),
  });

export const addTravelAgentAPI = (body: TravelAgentPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.travelAgentAdd,
    bodyData: body,
  });

export const updateTravelAgentAPI = (
  id: number | string,
  body: TravelAgentPayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.travelAgentUpdate(id),
    bodyData: body,
  });

export const deleteTravelAgentAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.travelAgentDelete(id) });
