import Cookies from "js-cookie";
import { AES, Utf8 } from "crypto-es";

const COOKIE_KEY = "innap-client-obfuscation-key";

export const AUTH_COOKIE_KEYS = [
  "resortToken",
  "resortTokenType",
  "resortUserId",
  "resortOrgId",
  "resortBranchId",
  "resortUserName",
  "resortShortName",
  "resortUserCode",
  "resortIsActive",
  "resortStatus",
  "resortBranchCode",
  "resortBranchName",
  "resortName",
  "resortOrgSchema",
  "resortDatabaseName",
] as const;

export type AuthCookieKey = (typeof AUTH_COOKIE_KEYS)[number];

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
};

export const encryptData = (data: unknown): string => {
  return AES.encrypt(JSON.stringify(data), COOKIE_KEY).toString();
};

export const decryptData = (cipher: string): unknown | null => {
  if (!cipher) return null;
  try {
    const bytes = AES.decrypt(cipher, COOKIE_KEY);
    const text = bytes.toString(Utf8);
    if (!text) return null;
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

export const setSecureCookie = (
  key: string,
  value: unknown,
  options: CookieOptions = {},
) => {
  Cookies.set(key, encryptData(value), {
    sameSite: "lax",
    ...options,
  });
};

export const clearAuthCookies = () => {
  AUTH_COOKIE_KEYS.forEach((key) => Cookies.remove(key));
};
