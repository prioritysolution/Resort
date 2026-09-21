export type Checkout = {
  Checkout_Id?: number;
  Bill_Id?: number;
  Bill_No?: string;
  Reservation_No?: string;
  Guest_Name?: string;
  Checkout_Date?: string;
  Room_Amount?: number | string;
  Food_Amount?: number | string;
  Service_Amount?: number | string;
  Gst_Amount?: number | string;
  Paid_Amount?: number | string;
  Total_Amount?: number | string;
  Balance_Amount?: number | string;
  Status?: number | string;
};
export type CheckoutSummary = Record<string, unknown>;
export type CheckoutFormValues = {
  reservation_no: string;
  checkout_date: string;
};
export type CheckoutPayload = {
  reservation_no: string;
  checkout_date?: string;
};
