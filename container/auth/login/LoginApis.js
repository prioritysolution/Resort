import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { demoLogin } from "@/utils/demoAuth";

export const loginUserAPI = async (bodyData) => {
  if (!process.env.NEXT_PUBLIC_BASE_API_URL) {
    return demoLogin(bodyData);
  }
  return doPostApiCall({ url: endPoints.login, bodyData });
};

export const logoutUserAPI = async () => {
  if (!process.env.NEXT_PUBLIC_BASE_API_URL) {
    return { message: "Success" };
  }
  return doPostApiCall({ url: endPoints.logout, bodyData: {} });
};
