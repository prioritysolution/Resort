export type TravelAgent = {
  Agent_Id: number;
  Agent_Name: string;
  Org_Name: string | null;
  Address: string | null;
  Contact_No: string | null;
  GST_No: string | null;
  PAN_No: string | null;
  Comm_Prcnt: string | number | null;
  Status: number;
};

export type TravelAgentFormValues = {
  agent_name: string;
  org_name: string;
  address: string;
  contact_no: string;
  gst_no: string;
  pan_no: string;
  comm_prcnt: number | string;
  status: boolean;
};

export type TravelAgentPayload = {
  agent_name: string;
  org_name?: string | null;
  address?: string | null;
  contact_no?: string | null;
  gst_no?: string | null;
  pan_no?: string | null;
  comm_prcnt?: number | null;
  status?: number;
};
