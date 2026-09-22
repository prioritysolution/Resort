export type Checkout = {
  Checkout_Id?: number;
  Bill_Id?: number;
  Bill_No?: string;
  Reservation_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  /** API list/details field */
  CheckOut_Date?: string;
  /** Legacy alias */
  Checkout_Date?: string;
  Room_Bill?: number | string | null;
  Room_Gst?: number | string | null;
  Food_Bill?: number | string | null;
  Food_Gst?: number | string | null;
  Service_Bill?: number | string | null;
  Service_Gst?: number | string | null;
  Total_Bill?: number | string | null;
  Total_Gst?: number | string | null;
  Grand_Total?: number | string | null;
  Amount_Paid?: number | string | null;
  Agent_Comm_Amount?: number | string | null;
  Round_Off?: number | string | null;
  Net_Amount?: number | string | null;
  Balance_Amount?: number | string | null;
  /** Legacy aliases */
  Room_Amount?: number | string;
  Food_Amount?: number | string;
  Service_Amount?: number | string;
  Gst_Amount?: number | string;
  Paid_Amount?: number | string;
  Total_Amount?: number | string;
  /** 1 = active checkout, 0 = cancelled */
  Status?: number | string;
  Checkout_Status?: number | string;
  Created_By?: number;
  Created_At?: string;
};

/** Due = max(0, Net_Amount - Amount_Paid) — not stored on list rows */
export const checkoutDueAmount = (row: Checkout) => {
  if (row.Balance_Amount != null && row.Balance_Amount !== "") {
    const bal = Number(row.Balance_Amount);
    if (Number.isFinite(bal)) return Math.max(0, bal);
  }
  const net = Number(row.Net_Amount ?? row.Grand_Total ?? 0);
  const paid = Number(row.Amount_Paid ?? row.Paid_Amount ?? 0);
  if (!Number.isFinite(net)) return null;
  return Math.max(0, net - (Number.isFinite(paid) ? paid : 0));
};

export const checkoutDateOf = (row: Checkout) =>
  row.CheckOut_Date || row.Checkout_Date || "";

/** Bill preview from GET /checkout/summary */
export type CheckoutSummary = {
  Reservation_No?: string;
  Guest_Name?: string;
  Room_Bill?: number | string | null;
  Room_Gst?: number | string | null;
  Food_Bill?: number | string | null;
  Food_Gst?: number | string | null;
  Service_Bill?: number | string | null;
  Service_Gst?: number | string | null;
  Total_Bill?: number | string | null;
  Total_Gst?: number | string | null;
  Grand_Total?: number | string | null;
  Amount_Paid?: number | string | null;
  Agent_Comm_Amount?: number | string | null;
  Round_Off?: number | string | null;
  Net_Amount?: number | string | null;
  Balance_Amount?: number | string | null;
  [key: string]: unknown;
};

export type CheckoutFormValues = {
  reservation_no: string;
  checkout_date: string | Date;
};

export type CheckoutPayload = {
  reservation_no: string;
  checkout_date?: string;
};

export const CHECKOUT_SUMMARY_FIELDS: Array<{
  key: keyof CheckoutSummary;
  label: string;
}> = [
  { key: "Room_Bill", label: "Room bill" },
  { key: "Room_Gst", label: "Room GST" },
  { key: "Food_Bill", label: "Food bill" },
  { key: "Food_Gst", label: "Food GST" },
  { key: "Service_Bill", label: "Service bill" },
  { key: "Service_Gst", label: "Service GST" },
  { key: "Total_Bill", label: "Total bill" },
  { key: "Total_Gst", label: "Total GST" },
  { key: "Grand_Total", label: "Grand total" },
  { key: "Amount_Paid", label: "Amount paid" },
  { key: "Agent_Comm_Amount", label: "Agent commission" },
  { key: "Round_Off", label: "Round off" },
  { key: "Net_Amount", label: "Net amount" },
  { key: "Balance_Amount", label: "Balance" },
];
