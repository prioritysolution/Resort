"use client";

import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import {
  checkoutDateOf,
  checkoutDueAmount,
  type Checkout,
} from "@/container/guest/checkout/types";

const money = (value: unknown) => {
  if (value === "" || value == null) return "—";
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : String(value);
};

const columns: GuestColumn<Checkout>[] = [
  { label: "Bill no.", value: (r) => r.Bill_No || "—" },
  { label: "Reservation no.", value: (r) => r.Reservation_No },
  { label: "Guest", value: (r) => r.Guest_Name || "—" },
  { label: "Checkout date", value: (r) => checkoutDateOf(r) || "—" },
  {
    label: "Net amount",
    value: (r) => money(r.Net_Amount ?? r.Grand_Total),
  },
  {
    label: "Amount paid",
    value: (r) => money(r.Amount_Paid),
  },
  {
    label: "Due",
    value: (r) => money(checkoutDueAmount(r)),
  },
  {
    label: "Status",
    value: (r) => (Number(r.Status) === 0 ? "Cancelled" : "Active"),
  },
];

type Props = {
  rows: Checkout[];
  loading: boolean;
};

export default function CheckoutTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Checkout_Id || r.Bill_Id || i}
      emptyTitle="No checkouts found"
    />
  );
}
