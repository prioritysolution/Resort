export type RoomType = {
  Room_TId: number;
  Room_TName: string;
  Room_Charges: string | number;
  Extra_Bed_Charges: string | number;
  Status: number;
};

export type RoomTypeFormValues = {
  room_tname: string;
  room_charges: number | string;
  extra_bed_charges: number | string;
  status: boolean;
};

export type RoomTypePayload = {
  room_tname: string;
  room_charges: number;
  extra_bed_charges: number;
  status?: number;
};
