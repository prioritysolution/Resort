import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "@/container/guest/shared/types";
import type { Reservation, ReservationPayload } from "./types";

export const getReservationListAPI = (filter?: string) =>
  doGetApiCall<ApiListResponse<Reservation>>({
    url: endPoints.reservationList(filter),
  });
export const getReservationDetailsAPI = (value: string | number) =>
  doGetApiCall<GuestDataResponse<unknown>>({
    url: endPoints.reservationDetails(String(value)),
  });
export const addReservationAPI = (body: ReservationPayload) =>
  doPostApiCall<ApiCudResponse>({
    url: endPoints.reservationAdd,
    bodyData: body,
  });

export const updateReservationAPI = (
  id: number | string,
  body: ReservationPayload,
) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.reservationUpdate(id),
    bodyData: body,
  });
