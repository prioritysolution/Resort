export type FoodOrderItem = {
  Menu_Id?: number;
  Item_Id?: number;
  Menu_Name?: string;
  Quantity?: number;
  menu_id?: number | string;
  quantity?: number | string;
};
export type FoodOrder = {
  Food_Ord_Id?: number;
  FoodOrd_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  Order_Date?: string;
  Order_Time?: string;
  Room_Service?: boolean | number;
  Room_Id?: number;
  Room_No?: string;
  Special_Ins?: string | null;
  Bill_Amount?: number | string;
  Gst_Amount?: number | string;
  Tot_Amount?: number | string;
  FoodBill_Amount?: number | string;
  FoodBill_GST?: number | string;
  Order_Status?: number;
  Delivered_By?: number | null;
  Items?: FoodOrderItem[];
  items?: FoodOrderItem[];
};
export type FoodOrderFormValues = {
  reservation_no: string;
  order_date: string | Date;
  order_time: string;
  room_service: boolean;
  room_id: number | string;
  special_ins: string;
  items: Array<{ menu_id: number | string; quantity: number | string }>;
};
export type FoodOrderPayload = {
  reservation_no: string;
  order_date?: string;
  order_time?: string;
  room_service?: boolean;
  room_id?: number;
  special_ins?: string;
  items: Array<{ menu_id: number; quantity: number }>;
  order_status?: number;
  delivered_by?: number;
};
