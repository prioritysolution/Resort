export type ReservationReportRow = {
  Reservation_No?: string;
  Booking_No?: string;
  Guest_Name?: string;
  CheckIn_Date?: string;
  Checkin_Date?: string;
  Room_Nos?: string;
  Agent_Name?: string;
  Amount_Paid?: number | string | null;
  Checkout_Status?: number | string | null;
};

export type ReservationReportFormValues = {
  date_mode: "range" | "month";
  from_date: string | Date;
  to_date: string | Date;
  month: string;
  reservation_no: string;
};
