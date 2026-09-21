"use client";
import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import type { FoodOrder } from "@/container/guest/food-order/types";
const money = (value?: number | string) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const columns: GuestColumn<FoodOrder>[] = [
  { label: "Reservation no.", value: (r: FoodOrder) => r.Reservation_No },
  { label: "Guest", value: (r: FoodOrder) => r.Guest_Name },
  { label: "Order date", value: (r: FoodOrder) => r.Order_Date },
  { label: "Room", value: (r: FoodOrder) => r.Room_No || r.Room_Id },
  {
    label: "Bill",
    value: (r: FoodOrder) => money(r.Bill_Amount),
    className: "text-right tabular-nums",
  },
  {
    label: "GST",
    value: (r: FoodOrder) => money(r.Gst_Amount),
    className: "text-right tabular-nums",
  },
  {
    label: "Total",
    value: (r: FoodOrder) => money(r.Tot_Amount),
    className: "text-right tabular-nums",
  },
  {
    label: "Status",
    value: (r: FoodOrder) =>
      Number(r.Order_Status) === 1 ? "Delivered" : "Not delivered",
  },
];
type Props = {
  rows: FoodOrder[];
  loading: boolean;
  onEdit: (row: FoodOrder) => void;
  onDelete: (row: FoodOrder) => void;
  onDelivered: (row: FoodOrder) => void;
};
export default function FoodOrderTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Food_Ord_Id || r.FoodOrd_Id || i}
      emptyTitle="No food orders found"
      onEdit={props.onEdit}
      onDelete={props.onDelete}
      deleteLabel="Delete"
      onSecondary={props.onDelivered}
      secondaryLabel="Delivered"
      secondaryDisabled={(r) => Number(r.Order_Status) === 1}
    />
  );
}
