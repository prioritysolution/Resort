"use client";
import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import type { Payment } from "@/container/guest/payment/types";
const columns: GuestColumn<Payment>[] = [
  { label: "Reservation no.", value: (r: Payment) => r.Reservation_No },
  { label: "Guest", value: (r: Payment) => r.Guest_Name },
  { label: "Date", value: (r: Payment) => r.Coll_Date },
  { label: "Amount", value: (r: Payment) => r.Coll_Amount },
  { label: "Mode", value: (r: Payment) => r.Coll_Mode },
  { label: "Final", value: (r: Payment) => Boolean(r.Final_Coll) },
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
