export type BookingReportRow = {
  Register_Date?: string;
  Booking_No?: string;
  Guest_Name?: string;
  Contact_No?: string;
  Room_TName?: string;
  NoOf_Room?: number | string;
  CheckIn_Date?: string;
  Checkin_Date?: string;
  ExpChkOut_Dt?: string;
  Exp_Chkout_Dt?: string;
  Agent_Name?: string;
  Adv_Amount?: number | string | null;
};

export type BookingReportFormValues = {
  date_mode: "range" | "month";
  from_date: string | Date;
  to_date: string | Date;
  month: string;
};
