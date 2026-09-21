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
  Status?: number | string;
  Created_By?: number;
  Created_At?: string;
};

export type BookingFormValues = {
  guest_name: string;
  contact_no: string;
  room_tid: number | string;
  no_of_room: number | string;
  checkin_date: string;
  stay_duration: number | string;
  exp_chkout_dt: string;
  agent_id: number | string;
  note: string;
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
};
