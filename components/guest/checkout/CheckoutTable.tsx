"use client";
import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import type { Checkout } from "@/container/guest/checkout/types";
const columns: GuestColumn<Checkout>[] = [
  { label: "Bill no.", value: (r: Checkout) => r.Bill_No },
  { label: "Reservation no.", value: (r: Checkout) => r.Reservation_No },
  { label: "Guest", value: (r: Checkout) => r.Guest_Name },
  { label: "Checkout date", value: (r: Checkout) => r.Checkout_Date },
  { label: "Total", value: (r: Checkout) => r.Total_Amount },
  {
    label: "Status",
    value: (r: Checkout) => (Number(r.Status) === 0 ? "Cancelled" : r.Status),
  },
];
type Props = {
  rows: Checkout[];
  loading: boolean;
  onEdit: (row: Checkout) => void;
  onDelete: (row: Checkout) => void;
};
export default function CheckoutTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Checkout_Id || r.Bill_Id || i}
      emptyTitle="No checkouts found"
      onDelete={props.onDelete}
      deleteLabel="Cancel"
    />
  );
}
