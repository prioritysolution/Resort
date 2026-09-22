export type CollectionReportRow = {
  Register_Date?: string;
  Collection_Id?: number;
  Reservation_No?: string;
  Guest_Name?: string;
  Coll_Amount?: number | string | null;
  Coll_Mode?: number | string | null;
  Final_Coll?: boolean | number | null;
  Agent_Name?: string;
};

export type CollectionReportFormValues = {
  collection_type: "summary" | "reservation";
  date_mode: "range" | "month";
  from_date: string | Date;
  to_date: string | Date;
  month: string;
  reservation_no: string;
};
