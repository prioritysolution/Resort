export type Payment = {
  Collection_Id?: number;
  Coll_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  Coll_Date?: string;
  Coll_Amount?: number | string;
  Coll_Mode?: number;
  Final_Coll?: boolean | number;
  Status?: number | string;
};
export type PaymentFormValues = {
  reservation_no: string;
  coll_date: string;
  coll_amount: number | string;
  coll_mode: number | string;
  final_coll: boolean;
};
export type PaymentPayload = {
  reservation_no: string;
  coll_date?: string;
  coll_amount: number;
  coll_mode: number;
  final_coll?: boolean;
};
