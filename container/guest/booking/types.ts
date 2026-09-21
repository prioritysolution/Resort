export type Booking = {
  Booking_Id?: number;
  Booking_No?: string;
  Guest_Name?: string;
  Contact_No?: string;
  Room_TId?: number;
  Room_TName?: string;
  /** API field */
  NoOf_Room?: number;
  /** Legacy alias */
  No_Of_Room?: number;
  /** API field */
  CheckIn_Date?: string;
  /** Legacy alias */
  Checkin_Date?: string;
  Stay_Duration?: number;
  /** API field */
  ExpChkOut_Dt?: string;
  /** Legacy alias */
  Exp_Chkout_Dt?: string;
  Agent_Id?: number | null;
  Agent_Name?: string | null;
  Note?: string | null;
  /** API fields (list response) */
  Adv_Amount?: number | string | null;
  Adv_Mode?: number | string | null;
  Advance_Amount?: number | string | null;
  Advance_Mode?: number | string | null;
  advance_amount?: number | string | null;
  advance_mode?: number | string | null;
  Is_Refundable?: number | boolean | null;
  is_refundable?: number | boolean | null;
  Status?: number | string;
  Created_By?: number;
  Created_At?: string;
};

export type BookingFormValues = {
  guest_name: string;
  contact_no: string;
  room_tid: number | string;
  no_of_room: number | string;
  checkin_date: string | Date;
  stay_duration: number | string;
  exp_chkout_dt: string | Date;
  agent_id: number | string;
  note: string;
  advance_amount: number | string;
  /** 1 = Cash, 2 = Bank, 3 = Credit */
  advance_mode: number;
  is_refundable: boolean;
};

export type BookingPayload = {
  guest_name: string;
  contact_no: string;
  room_tid: number;
  no_of_room: number;
  checkin_date: string;
  stay_duration: number;
  exp_chkout_dt?: string;
  agent_id?: number | null;
  note?: string;
  advance_amount?: number;
  advance_mode?: number;
  is_refundable?: boolean;
};

/** Advance payment modes for booking form */
export const BOOKING_ADVANCE_MODES = [
  { value: 1, label: "Cash" },
  { value: 2, label: "Bank" },
  { value: 3, label: "Credit" },
] as const;
