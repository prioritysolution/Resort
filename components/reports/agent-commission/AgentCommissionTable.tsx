"use client";

import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import { formatReportMoney } from "@/container/reports/shared/types";
import type { AgentCommissionReportRow } from "@/container/reports/agent-commission/types";

const allColumns: GuestColumn<AgentCommissionReportRow>[] = [
  { label: "Month", value: (r) => r.Comm_Month || "—" },
  { label: "Agent", value: (r) => r.Agent_Name || "—" },
  { label: "Checkouts", value: (r) => r.Checkout_Count ?? "—" },
  { label: "Room bill", value: (r) => formatReportMoney(r.Room_Bill) },
  {
    label: "Commission",
    value: (r) => formatReportMoney(r.Agent_Comm_Amount),
  },
];

const agentColumns: GuestColumn<AgentCommissionReportRow>[] = [
  { label: "Month", value: (r) => r.Comm_Month || "—" },
  {
    label: "Checkout date",
    value: (r) => r.CheckOut_Date || r.Checkout_Date || "—",
  },
  { label: "Bill no.", value: (r) => r.Bill_No || "—" },
  { label: "Reservation no.", value: (r) => r.Reservation_No || "—" },
  { label: "Guest", value: (r) => r.Guest_Name || "—" },
  { label: "Agent", value: (r) => r.Agent_Name || "—" },
  { label: "Room bill", value: (r) => formatReportMoney(r.Room_Bill) },
  {
    label: "Commission",
    value: (r) => formatReportMoney(r.Agent_Comm_Amount),
  },
];

type Props = {
  rows: AgentCommissionReportRow[];
  loading: boolean;
  searched: boolean;
  commissionType: "all" | "agent";
};

export default function AgentCommissionTable({
  rows,
  loading,
  searched,
  commissionType,
}: Props) {
  return (
    <GuestTable
      rows={rows}
      loading={loading}
      columns={commissionType === "agent" ? agentColumns : allColumns}
      rowKey={(r, i) =>
        r.Checkout_Id || `${r.Agent_Id || r.Agent_Name}-${i}`
      }
      emptyTitle={
        searched
          ? "No commission rows found for this filter"
          : "Run a report to view agent commission"
      }
    />
  );
}
