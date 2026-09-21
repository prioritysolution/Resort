"use client";
import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import type { Reservation } from "@/container/guest/reservation/types";

const columns: GuestColumn<Reservation>[] = [
  { label: "Reservation no.", value: (r: Reservation) => r.Reservation_No },
  {
    label: "Booking",
    value: (r: Reservation) => r.Booking_No || r.Booking_Id || "—",
  },
  { label: "Guest", value: (r: Reservation) => r.Guest_Name },
  { label: "Contact", value: (r: Reservation) => r.Contact_No },
  {
    label: "Rooms",
    value: (r: Reservation) =>
      r.NoOf_Room ?? r.No_Of_Room ?? r.Room_No ?? r.Room_Id ?? "—",
  },
  {
    label: "Check-in",
    value: (r: Reservation) => r.CheckIn_Date || r.Checkin_Date,
  },
  { label: "Status", value: (r: Reservation) => r.Status },
];

type Props = {
  rows: Reservation[];
  loading: boolean;
  onEdit: (row: Reservation) => void;
  onDelete?: (row: Reservation) => void;
};

export default function ReservationTable(props: Props) {
  return (
    <GuestTable
      rows={props.rows}
      loading={props.loading}
      columns={columns}
      rowKey={(r, i) => r.Reservation_Id || r.Reservation_No || i}
      emptyTitle="No reservations found"
      onEdit={props.onEdit}
    />
  );
}
