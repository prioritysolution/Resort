"use client";
import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import type { ServiceOrder } from "@/container/guest/service-order/types";
const columns: GuestColumn<ServiceOrder>[] = [
  { label: "Reservation no.", value: (r: ServiceOrder) => r.Reservation_No },
  { label: "Guest", value: (r: ServiceOrder) => r.Guest_Name },
  { label: "Order date", value: (r: ServiceOrder) => r.Order_Date },
  {
    label: "Service",
    value: (r: ServiceOrder) => r.Service_Name || r.Service_Id,
  },
  { label: "Quantity", value: (r: ServiceOrder) => r.Quantity },
  {
    label: "Status",
    value: (r: ServiceOrder) =>
      Number(r.Order_Status) === 1 ? "Complete" : "Booked",
  },
];
type Props = {
  rows: ServiceOrder[];
  loading: boolean;
  onEdit: (row: ServiceOrder) => void;
  onDelete: (row: ServiceOrder) => void;
};
export default function ServiceOrderTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Serv_Ord_Id || r.Service_Order_Id || i}
      emptyTitle="No service orders found"
      onEdit={props.onEdit}
      onDelete={props.onDelete}
      deleteLabel="Delete"
    />
  );
}
