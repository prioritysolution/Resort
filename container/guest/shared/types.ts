import type { ApiCudResponse } from "@/types/api";

export type GuestDataResponse<T> = ApiCudResponse & {
  data?: T;
  rooms?: unknown[];
  [key: string]: unknown;
};

export const isApiSuccess = (response?: ApiCudResponse | null) => {
  if (!response) return false;
  if (Number(response.Error_Code) === 0) return true;
  if (response.Message === "Success") return true;
  const msg = String(response.message || response.Message || "").toLowerCase();
  if (!msg) return false;
  if (/fail|error|invalid|unauthor/.test(msg)) return false;
  return /success|fetched|created|updated|deleted|cancelled|canceled|saved|added/.test(
    msg,
  );
};

export const extractListRows = <T>(
  response: Record<string, unknown> | null | undefined,
): T[] => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data as T[];
  for (const key of Object.keys(response)) {
    if (
      key === "errors" ||
      key === "Message" ||
      key === "message" ||
      key === "Error_Code"
    ) {
      continue;
    }
    if (Array.isArray(response[key])) return response[key] as T[];
  }
  return [];
};

export const extractDetails = <T extends object>(
  value: unknown,
  nestedKeys: string[],
): T | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of nestedKeys) {
    const nested = record[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      return nested as T;
    }
  }
  return record as T;
};

export const apiMessage = (response?: ApiCudResponse | null, fallback = "") =>
  response?.Message || response?.message || fallback;
