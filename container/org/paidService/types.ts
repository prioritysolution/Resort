export type PaidService = {
  Service_Id: number;
  Service_Name: string;
  Serv_Desc: string | null;
  Serv_Charges: string | number;
  Status: number;
};

export type PaidServiceFormValues = {
  service_name: string;
  serv_desc: string;
  serv_charges: number | string;
  // status: boolean;
};

export type PaidServicePayload = {
  service_name: string;
  serv_desc?: string;
  serv_charges: number;
  status?: number;
};
