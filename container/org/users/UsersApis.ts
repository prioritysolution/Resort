import {
  doDeleteApiCall,
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { AppUser, AppUserAddPayload, AppUserUpdatePayload } from "./types";

export const getUsersListAPI = () =>
  doGetApiCall<ApiListResponse<AppUser>>({
    url: endPoints.usersList,
  });

export const searchUsersAPI = (keyword: string) =>
  doGetApiCall<ApiListResponse<AppUser>>({
    url: endPoints.usersSearch(keyword),
  });

export const addUserAPI = (body: AppUserAddPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.usersAdd,
    bodyData: body,
  });

export const updateUserAPI = (
  id: number | string,
  body: AppUserUpdatePayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.usersUpdate(id),
    bodyData: body,
  });

export const deleteUserAPI = (id: number | string) =>
  doDeleteApiCall<ApiCudResponse>({ url: endPoints.usersDelete(id) });
