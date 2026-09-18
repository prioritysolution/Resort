export type RoomDetail = {
  Room_Id: number;
  Room_Type: number;
  Room_TName: string;
  Room_No: string;
  Room_Desc: string | null;
  Adult: number;
  Child: number;
  Booking_Allowed: number;
  Status: number;
};

export type RoomDetailFormValues = {
  room_type: number | string;
  room_no: string;
  room_desc: string;
  adult: number | string;
  child: number | string;
  booking_allowed: boolean;
  status: boolean;
};

export type RoomDetailPayload = {
  room_type: number;
  room_no: string;
  room_desc?: string;
  adult: number;
  child?: number;
  booking_allowed?: number;
  status?: number;
};
