import Cookies from "js-cookie";
import { AES, Utf8 } from "crypto-es";

const COOKIE_KEY = "innap-client-obfuscation-key";

export const encryptData = (data) => {
  return AES.encrypt(JSON.stringify(data), COOKIE_KEY).toString();
};

export const decryptData = (cipher) => {
  if (!cipher) return null;
  try {
    const bytes = AES.decrypt(cipher, COOKIE_KEY);
    const text = bytes.toString(Utf8);
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const setSecureCookie = (key, value, options = {}) => {
  Cookies.set(key, encryptData(value), {
    sameSite: "lax",
    ...options,
  });
};

export const clearAuthCookies = () => {
  [
    "prioBankClientToken",
    "orgId",
    "userBranchId",
    "finId",
    "beg_date",
    "fin_start_date",
    "fin_end_date",
    "userName",
    "userOrgName",
  ].forEach((key) => Cookies.remove(key));
};
