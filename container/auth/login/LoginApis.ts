import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { LoginRequest, LoginResponse } from "./types";

export const loginUserAPI = (bodyData: LoginRequest) =>
  doPostApiCall<LoginResponse>({
    url: endPoints.login,
    bodyData,
  });

export const logoutUserAPI = async () => {
  return { message: "Success", Error_Code: 0 };
};
