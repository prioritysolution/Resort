"use client";

import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import { PAYMENT_COLL_MODES } from "@/container/guest/payment/types";
import { formatReportMoney } from "@/container/reports/shared/types";
import type { CollectionReportRow } from "@/container/reports/collection-register/types";

const modeLabel = (mode: unknown) => {
  const n = Number(mode);
  return (
    PAYMENT_COLL_MODES.find((m) => m.value === n)?.label ||
    String(mode ?? "—")
  );
};

const columns: GuestColumn<CollectionReportRow>[] = [
  { label: "Register date", value: (r) => r.Register_Date || "—" },
  { label: "Collection ID", value: (r) => r.Collection_Id ?? "—" },
  { label: "Reservation no.", value: (r) => r.Reservation_No || "—" },
  { label: "Guest", value: (r) => r.Guest_Name || "—" },
  { label: "Amount", value: (r) => formatReportMoney(r.Coll_Amount) },
  { label: "Mode", value: (r) => modeLabel(r.Coll_Mode) },
  {
    label: "Final",
    value: (r) =>
      r.Final_Coll === true || Number(r.Final_Coll) === 1 ? "Yes" : "No",
  },
  { label: "Agent", value: (r) => r.Agent_Name || "—" },
];

type Props = {
  rows: CollectionReportRow[];
  loading: boolean;
  searched: boolean;
};

export default function CollectionRegisterTable({
  rows,
  loading,
  searched,
}: Props) {
  return (
    <GuestTable
      rows={rows}
      loading={loading}
      columns={columns}
      rowKey={(r, i) => r.Collection_Id || i}
      emptyTitle={
        searched
          ? "No collections found for this filter"
          : "Run a report to view collections"
      }
    />
  );
}
