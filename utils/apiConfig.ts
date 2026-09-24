import axios, { type AxiosError } from "axios";
import { clearAuthCookies } from "@/utils/secureCookieHelper";
import getCookieData from "@/utils/getCookieData";
import type { ApiCudResponse } from "@/types/api";

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  clearAuthCookies();
  window.location.href = "/login";
};

const getHeaders = () => {
  const token = getCookieData("resortToken");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = <T>(res: { status?: number; data?: T }) => {
  if (res?.status === 401) {
    redirectToLogin();
    return { Error_Code: 1, Message: "Unauthorized", message: "Unauthorized" } as T &
      ApiCudResponse;
  }
  return (res?.data ?? res) as T;
};

const handleError = (error: unknown): ApiCudResponse => {
  const axiosError = error as AxiosError<ApiCudResponse & { message?: string }>;
  if (axiosError?.response?.status === 401) {
    redirectToLogin();
  }
  const data = axiosError?.response?.data;
  const message =
    data?.Message ||
    data?.message ||
    axiosError?.message ||
    "Something went wrong";
  return {
    Error_Code: data?.Error_Code ?? 1,
    Message: message,
    message,
    errors: data?.errors,
  };
};

type RequestArgs = {
  url: string;
  bodyData?: unknown;
};

/** Same GET started again while the first is running (or just finished) shares one request. */
const inflightGets = new Map<string, Promise<unknown>>();
const GET_REUSE_MS = 400;

export const doGetApiCall = async <T = unknown>({
  url,
}: Pick<RequestArgs, "url">) => {
  const existing = inflightGets.get(url);
  if (existing) return existing as Promise<T>;

  const request = (async () => {
    try {
      const res = await axios.get<T>(url, { headers: getHeaders() });
      return handleResponse<T>(res);
    } catch (error) {
      return handleError(error) as T & ApiCudResponse;
    } finally {
      setTimeout(() => {
        if (inflightGets.get(url) === request) inflightGets.delete(url);
      }, GET_REUSE_MS);
    }
  })();

  inflightGets.set(url, request);
  return request as Promise<T>;
};

export const doPostApiCall = async <T = unknown>({
  url,
  bodyData,
}: RequestArgs) => {
  try {
    const res = await axios.post<T>(url, bodyData, { headers: getHeaders() });
    return handleResponse<T>(res);
  } catch (error) {
    return handleError(error) as T & ApiCudResponse;
  }
};

export const doPutApiCall = async <T = unknown>({
  url,
  bodyData,
}: RequestArgs) => {
  try {
    const res = await axios.put<T>(url, bodyData, { headers: getHeaders() });
    return handleResponse<T>(res);
  } catch (error) {
    return handleError(error) as T & ApiCudResponse;
  }
};

export const doDeleteApiCall = async <T = unknown>({
  url,
}: Pick<RequestArgs, "url">) => {
  try {
    const res = await axios.delete<T>(url, { headers: getHeaders() });
    return handleResponse<T>(res);
  } catch (error) {
    return handleError(error) as T & ApiCudResponse;
  }
};
