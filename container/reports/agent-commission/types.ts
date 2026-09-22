export type AgentCommissionReportRow = {
  Comm_Month?: string;
  Agent_Id?: number;
  Agent_Name?: string;
  Checkout_Count?: number | string | null;
  Room_Bill?: number | string | null;
  Agent_Comm_Amount?: number | string | null;
  CheckOut_Date?: string;
  Checkout_Date?: string;
  Checkout_Id?: number;
  Bill_No?: string;
  Reservation_No?: string;
  Guest_Name?: string;
};

export type AgentCommissionReportFormValues = {
  commission_type: "all" | "agent";
  month: string;
  agent_id: number | string;
};
