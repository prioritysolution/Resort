import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type { MenusApiResponse } from "./types";

export const getMenusAPI = () =>
  doGetApiCall<MenusApiResponse>({ url: endPoints.menus });
