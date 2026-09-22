"use client";

import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import {
  formatMoney,
  PAYMENT_COLL_MODES,
  type Payment,
} from "@/container/guest/payment/types";

const modeLabel = (mode: unknown) => {
  const n = Number(mode);
  return PAYMENT_COLL_MODES.find((m) => m.value === n)?.label || String(mode ?? "—");
};

const columns: GuestColumn<Payment>[] = [
  { label: "Reservation no.", value: (r) => r.Reservation_No },
  { label: "Guest", value: (r) => r.Guest_Name || "—" },
  { label: "Date", value: (r) => r.Coll_Date || "—" },
  { label: "Amount", value: (r) => formatMoney(r.Coll_Amount) },
  { label: "Mode", value: (r) => modeLabel(r.Coll_Mode) },
  {
    label: "Final",
    value: (r) =>
      r.Final_Coll === true || Number(r.Final_Coll) === 1 ? "Yes" : "No",
  },
  {
    label: "Checkout",
    value: (r) =>
      Number(r.Checkout_Status) === 1
        ? "Done"
        : r.Checkout_Status == null
          ? "—"
          : "Pending",
  },
  {
    label: "Due",
    value: (r) =>
      Number(r.Checkout_Status) === 1
        ? formatMoney(r.Due_Amount)
        : "—",
  },
];

type Props = {
  rows: Payment[];
  loading: boolean;
  onEdit: (row: Payment) => void;
  onDelete: (row: Payment) => void;
};

export default function PaymentTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Collection_Id || r.Coll_Id || i}
      emptyTitle="No payments found"
      onEdit={props.onEdit}
      onDelete={props.onDelete}
      deleteLabel="Delete"
    />
  );
}
