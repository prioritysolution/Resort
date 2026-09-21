export type Reservation = {
  Reservation_Id?: number;
  Reservation_No?: string;
  Booking_Id?: number | null;
  Booking_No?: string | null;
  Guest_Name?: string;
  Contact_No?: string;
  Aadhar_No?: string | null;
  Address_1?: string | null;
  Address_2?: string | null;
  /** API field */
  CheckIn_Date?: string;
  /** Legacy alias */
  Checkin_Date?: string;
  Checkout_Date?: string;
  Adult_No?: number;
  Child_No?: number;
  Room_Id?: number;
  Room_Ids?: number[];
  Room_No?: string;
  /** API field */
  NoOf_Room?: number;
  /** Legacy alias */
  No_Of_Room?: number;
  Extra_Bed_No?: number;
  Agent_Id?: number | null;
  Agent_Name?: string | null;
  Special_Request?: string | null;
  Status?: number | string;
  Created_By?: number;
  Created_At?: string;
};

export type ReservationFormValues = {
  booking_no: string;
  guest_name: string;
  contact_no: string;
  aadhar_no: string;
  address_1: string;
  address_2: string;
  checkin_date: string;
  checkout_date: string;
  adult_no: number | string;
  child_no: number | string;
  room_id: number | string;
  room_ids: string;
  extra_bed_no: number | string;
  agent_id: number | string;
  special_request: string;
};

export type ReservationPayload = {
  booking_no?: string;
  guest_name: string;
  contact_no: string;
  aadhar_no?: string;
  address_1?: string;
  address_2?: string;
  checkin_date: string;
  checkout_date: string;
  adult_no: number;
  child_no?: number;
  room_id?: number;
  room_ids?: number[];
  no_of_room?: number;
  extra_bed_no?: number;
  agent_id?: number | null;
  special_request?: string;
};
