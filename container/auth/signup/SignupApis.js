import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { demoSignup } from "@/utils/demoAuth";

export const signupUserAPI = async (bodyData) => {
  if (!process.env.NEXT_PUBLIC_BASE_API_URL) {
    return demoSignup(bodyData);
  }
  return doPostApiCall({ url: endPoints.signup, bodyData });
};
