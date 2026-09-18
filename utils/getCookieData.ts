import Cookies from "js-cookie";
import { decryptData } from "@/utils/secureCookieHelper";

const getCookieData = (key: string): string => {
  if (!key || typeof window === "undefined") return "";
  const raw = Cookies.get(key);
  if (!raw) return "";
  const decrypted = decryptData(raw);
  if (decrypted == null) return raw;
  return typeof decrypted === "string" ? decrypted : String(decrypted);
};

export default getCookieData;
