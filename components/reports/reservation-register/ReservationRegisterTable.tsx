"use client";

import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import { formatReportMoney } from "@/container/reports/shared/types";
import type { ReservationReportRow } from "@/container/reports/reservation-register/types";

const columns: GuestColumn<ReservationReportRow>[] = [
  { label: "Reservation no.", value: (r) => r.Reservation_No || "—" },
  { label: "Booking no.", value: (r) => r.Booking_No || "—" },
  { label: "Guest", value: (r) => r.Guest_Name || "—" },
  {
    label: "Check-in",
    value: (r) => r.CheckIn_Date || r.Checkin_Date || "—",
  },
  { label: "Rooms", value: (r) => r.Room_Nos || "—" },
  { label: "Agent", value: (r) => r.Agent_Name || "—" },
  { label: "Amount paid", value: (r) => formatReportMoney(r.Amount_Paid) },
  {
    label: "Checkout",
    value: (r) =>
      Number(r.Checkout_Status) === 1
        ? "Done"
        : r.Checkout_Status == null
          ? "—"
          : "Pending",
  },
];

type Props = {
  rows: ReservationReportRow[];
  loading: boolean;
  searched: boolean;
};

export default function ReservationRegisterTable({
  rows,
  loading,
  searched,
}: Props) {
  return (
    <GuestTable
      rows={rows}
      loading={loading}
      columns={columns}
      rowKey={(r, i) => r.Reservation_No || i}
      emptyTitle={
        searched
          ? "No reservations found for this filter"
          : "Run a report to view reservations"
      }
    />
  );
}
