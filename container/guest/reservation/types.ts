export type ReservationGuest = {
  Guest_Name?: string;
  Contact_No?: string;
  Age?: number;
  Gender?: string;
  Aadhar_No?: string | null;
  Address?: string | null;
  guest_name?: string;
  contact_no?: string;
  age?: number;
  gender?: string;
  aadhar_no?: string;
  address?: string;
};

export type ReservationRoomRow = {
  Room_Id?: number;
  room_id?: number;
  Extra_Bed_No?: number | string | null;
  extra_bed_no?: number | string | null;
};

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
  Age?: number | null;
  Gender?: string | null;
  Is_Primary?: number | boolean | null;
  /** API field */
  CheckIn_Date?: string;
  /** Legacy alias */
  Checkin_Date?: string;
  Checkout_Date?: string;
  Adult_No?: number;
  Child_No?: number;
  Room_Id?: number | number[];
  Room_Ids?: number[];
  room_id?: number | number[];
  Rooms?: ReservationRoomRow[];
  rooms?: ReservationRoomRow[];
  Room_No?: string;
  /** API field */
  NoOf_Room?: number;
  /** Legacy alias */
  No_Of_Room?: number;
  Extra_Bed_No?: number;
  Adv_Amount?: number | string | null;
  Advance_Amount?: number | string | null;
  advance_amount?: number | string | null;
  Amount?: number | string | null;
  amount?: number | string | null;
  Mode?: number | string | null;
  mode?: number | string | null;
  Agent_Id?: number | null;
  Agent_Name?: string | null;
  Special_Request?: string | null;
  Guests?: ReservationGuest[];
  guests?: ReservationGuest[];
  Status?: number | string;
  Created_By?: number;
  Created_At?: string;
};

export type ReservationGuestFormValues = {
  guest_name: string;
  contact_no: string;
  age: number | string;
  gender: string;
  aadhar_no: string;
  address: string;
};

export type ReservationRoomFormValues = {
  room_id: number;
  extra_bed_no: number;
};

export type ReservationFormValues = {
  booking_no: string;
  guest_name: string;
  contact_no: string;
  aadhar_no: string;
  address_1: string;
  address_2: string;
  age: number | string;
  gender: string;
  is_primary: boolean;
  checkin_date: string | Date;
  checkout_date: string | Date;
  adult_no: number | string;
  child_no: number | string;
  /** Selected rooms with per-room extra beds */
  rooms: ReservationRoomFormValues[];
  advance_amount: number | string;
  amount: number | string;
  /** 1 = Cash, 2 = Bank, 3 = Credit */
  mode: number;
  agent_id: number | string;
  special_request: string;
  guests: ReservationGuestFormValues[];
};

export type ReservationGuestPayload = {
  guest_name: string;
  contact_no: string;
  age: number;
  gender: string;
  aadhar_no?: string;
  address?: string;
};

export type ReservationRoomPayload = {
  room_id: number;
  extra_bed_no: number;
};

export type ReservationPayload = {
  booking_no?: string;
  guest_name: string;
  contact_no: string;
  aadhar_no?: string;
  address_1?: string;
  address_2?: string;
  age?: number;
  gender?: string;
  is_primary?: number;
  checkin_date: string;
  checkout_date: string;
  adult_no: number;
  child_no?: number;
  rooms: ReservationRoomPayload[];
  advance_amount?: number;
  amount?: number;
  mode?: number;
  agent_id?: number | null;
  special_request?: string;
  guests?: ReservationGuestPayload[];
};

export const RESERVATION_PAYMENT_MODES = [
  { value: 1, label: "Cash" },
  { value: 2, label: "Bank" },
  { value: 3, label: "Credit" },
] as const;

export const RESERVATION_GENDER_OPTIONS = [
  { Id: "M", Name: "Male" },
  { Id: "F", Name: "Female" },
] as const;

export const emptyGuestValues: ReservationGuestFormValues = {
  guest_name: "",
  contact_no: "",
  age: "",
  gender: "M",
  aadhar_no: "",
  address: "",
};
