import Cookies from "js-cookie";
import { decryptData } from "@/utils/secureCookieHelper";

const getCookieData = (key) => {
  if (!key || typeof window === "undefined") return "";
  const raw = Cookies.get(key);
  if (!raw) return "";
  const decrypted = decryptData(raw);
  return decrypted ?? raw;
};

export default getCookieData;
