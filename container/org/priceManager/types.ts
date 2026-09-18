export type RegularRate = {
  Rate_Id_Reg: number;
  Room_TId: number;
  Room_TName: string;
  Rate_Mon: string | number;
  Rate_Tue: string | number;
  Rate_Wed: string | number;
  Rate_Thu: string | number;
  Rate_Fri: string | number;
  Rate_Sat: string | number;
  Rate_Sun: string | number;
};

export type RegularRateFormValues = {
  room_tid: number | string;
  rate_mon: number | string;
  rate_tue: number | string;
  rate_wed: number | string;
  rate_thu: number | string;
  rate_fri: number | string;
  rate_sat: number | string;
  rate_sun: number | string;
};

export type RegularRatePayload = {
  room_tid: number;
  rate_mon: number;
  rate_tue: number;
  rate_wed: number;
  rate_thu: number;
  rate_fri: number;
  rate_sat: number;
  rate_sun: number;
};

export type SpecialRate = {
  Rate_Id_Spl: number;
  Room_TId: number;
  Room_TName: string;
  Event_Name: string;
  Date_From: string;
  Date_Upto: string;
  Rate_Spl: string | number;
  Status: number;
};

export type SpecialRateFormValues = {
  room_tid: number | string;
  event_name: string;
  date_from: Date | string | null;
  date_upto: Date | string | null;
  rate_spl: number | string;
  status: boolean;
};

export type SpecialRatePayload = {
  room_tid: number;
  event_name: string;
  date_from: string;
  date_upto: string;
  rate_spl: number;
  status?: number;
};
