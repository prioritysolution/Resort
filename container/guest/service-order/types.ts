export type ServiceOrder = {
  Serv_Ord_Id?: number;
  Service_Order_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  Order_Date?: string;
  Service_Id?: number;
  Service_Name?: string;
  Quantity?: number;
  Remarks?: string | null;
  OthrSrv_Amount?: number | string;
  OthrSrv_GST?: number | string;
  Order_Status?: number | string;
};
export type ServiceOrderFormValues = {
  reservation_no: string;
  order_date: string | Date;
  service_id: number | string;
  quantity: number | string;
  remarks: string;
};
export type ServiceOrderPayload = {
  reservation_no: string;
  order_date?: string;
  service_id: number;
  quantity?: number;
  remarks?: string;
};
