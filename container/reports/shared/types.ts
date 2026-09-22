import { format } from "date-fns";

export type ReportDateMode = "range" | "month";

export type ReportDateFilterValues = {
  date_mode: ReportDateMode;
  from_date: string | Date;
  to_date: string | Date;
  month: string;
};

export type ReportListMeta = {
  total_records?: number | string | null;
  total_advance?: number | string | null;
  total_amount_paid?: number | string | null;
  total_collection?: number | string | null;
  total_room_bill?: number | string | null;
  total_commission?: number | string | null;
  collection_type?: string | null;
  commission_type?: string | null;
  reservation_no?: string | null;
  month?: string | null;
  agent_id?: number | string | null;
};

export const toReportDate = (value: string | Date | undefined | null) => {
  if (!value) return "";
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : format(value, "yyyy-MM-dd");
  }
  const s = String(value).trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : format(d, "yyyy-MM-dd");
};

export const toQueryString = (
  params: Record<string, string | number | undefined | null>,
) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;
    const text = String(value).trim();
    if (!text) return;
    search.set(key, text);
  });
  return search.toString();
};

/** Build from_date/to_date or month query params. */
export const buildDateQueryParams = (
  values: Pick<
    ReportDateFilterValues,
    "date_mode" | "from_date" | "to_date" | "month"
  >,
) => {
  if (values.date_mode === "month") {
    const month = toReportDate(values.month).slice(0, 7);
    return month ? { month } : {};
  }
  const from_date = toReportDate(values.from_date);
  const to_date = toReportDate(values.to_date);
  return {
    ...(from_date ? { from_date } : {}),
    ...(to_date ? { to_date } : {}),
  };
};

export const formatReportMoney = (value: unknown) => {
  if (value === "" || value == null) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const emptyDateFilterValues = (): ReportDateFilterValues => {
  const now = new Date();
  const month = format(now, "yyyy-MM");
  return {
    date_mode: "month",
    from_date: "",
    to_date: "",
    month,
  };
};

export const REPORT_DATE_MODE_OPTIONS = [
  { value: "month", label: "By month" },
  { value: "range", label: "Date range" },
] as const;

export const COLLECTION_TYPE_OPTIONS = [
  { value: "summary", label: "Summary (all)" },
  { value: "reservation", label: "By reservation" },
] as const;

export const COMMISSION_TYPE_OPTIONS = [
  { value: "all", label: "All agents" },
  { value: "agent", label: "One agent" },
] as const;
