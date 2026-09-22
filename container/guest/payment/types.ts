export type Payment = {
  Collection_Id?: number;
  Coll_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  Coll_Date?: string;
  Coll_Amount?: number | string;
  Coll_Mode?: number;
  /** 1 = this payment closes the due */
  Final_Coll?: boolean | number;
  /** Payment row: 1 = active, 0 = deleted */
  Status?: number | string;
  Due_Amount?: number | string | null;
  Checkout_Id?: number | null;
  /** Checkout: 1 = checked out, 0 = not checked out */
  Checkout_Status?: number | string | null;
};

/** GET /payment/due — open payment screen with this */
export type PaymentDue = {
  Reservation_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  Net_Amount?: number | string | null;
  Amount_Paid?: number | string | null;
  Due_Amount?: number | string | null;
  Checkout_Id?: number | null;
  /** 1 = checkout done — show due; 0 = hide due */
  Checkout_Status?: number | string | null;
};

export type PaymentDueResponse = {
  Error_Code?: number;
  Message?: string;
  message?: string;
  due_amount?: number | string | null;
  checkout_status?: number | string | null;
  data?: PaymentDue | null;
};

export type PaymentListMeta = {
  due_amount?: number | string | null;
  amount_paid?: number | string | null;
  net_amount?: number | string | null;
  checkout_status?: number | string | null;
};

export type PaymentFormValues = {
  reservation_no: string;
  coll_date: string | Date;
  /** Amount being paid now (API: remaining_amount on add) */
  remaining_amount: number | string;
  coll_mode: number;
  final_coll: boolean;
};

export type PaymentPayload = {
  reservation_no: string;
  coll_date?: string;
  remaining_amount?: number;
  coll_amount?: number;
  coll_mode: number;
  final_coll?: boolean;
};

export const PAYMENT_COLL_MODES = [
  { value: 1, label: "Cash" },
  { value: 2, label: "Bank" },
  { value: 3, label: "Credit" },
] as const;

export const formatMoney = (value: unknown) => {
  if (value === "" || value == null) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
