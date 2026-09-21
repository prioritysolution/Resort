import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "@/container/guest/shared/types";
import type { Booking, BookingPayload } from "./types";

export const getBookingListAPI = () =>
  doGetApiCall<ApiListResponse<Booking>>({ url: endPoints.bookingList });
export const getBookingDetailsAPI = (value: string | number) =>
  doGetApiCall<GuestDataResponse<unknown>>({
    url: endPoints.bookingDetails(String(value)),
  });
export const addBookingAPI = (body: BookingPayload) =>
  doPostApiCall<ApiCudResponse>({ url: endPoints.bookingAdd, bodyData: body });

export const updateBookingAPI = (id: number | string, body: BookingPayload) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.bookingUpdate(id),
    bodyData: body,
  });

export const cancelBookingAPI = (id: number | string) =>
  doPutApiCall<ApiCudResponse>({
    url: endPoints.bookingCancel(id),
    bodyData: {},
  });
