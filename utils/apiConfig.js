import axios from "axios";
import { clearAuthCookies } from "@/utils/secureCookieHelper";
import getCookieData from "@/utils/getCookieData";

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  clearAuthCookies();
  window.location.href = "/login";
};

const getHeaders = () => {
  const token = getCookieData("prioBankClientToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = (res) => {
  if (res?.status === 401) {
    redirectToLogin();
    return { message: "Unauthorized" };
  }
  return res?.data ?? res;
};

const handleError = (error) => {
  if (error?.response?.status === 401) {
    redirectToLogin();
  }
  return {
    message:
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong",
  };
};

export const doGetApiCall = async ({ url }) => {
  try {
    const res = await axios.get(url, { headers: getHeaders() });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const doPostApiCall = async ({ url, bodyData }) => {
  try {
    const res = await axios.post(url, bodyData, { headers: getHeaders() });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};
