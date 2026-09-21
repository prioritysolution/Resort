"use client";
import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import type { Booking } from "@/container/guest/booking/types";
const columns: GuestColumn<Booking>[] = [
  { label: "Booking no.", value: (r: Booking) => r.Booking_No },
  { label: "Guest", value: (r: Booking) => r.Guest_Name },
  { label: "Contact", value: (r: Booking) => r.Contact_No },
  { label: "Room type", value: (r: Booking) => r.Room_TName || r.Room_TId },
  {
    label: "Check-in",
    value: (r: Booking) => r.CheckIn_Date || r.Checkin_Date,
  },
  { label: "Status", value: (r: Booking) => r.Status },
];
type Props = {
  rows: Booking[];
  loading: boolean;
  onEdit: (row: Booking) => void;
  onDelete: (row: Booking) => void;
};
export default function BookingTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Booking_Id || r.Booking_No || i}
      emptyTitle="No bookings found"
      onEdit={props.onEdit}
      onDelete={props.onDelete}
      deleteLabel="Cancel"
    />
  );
}
