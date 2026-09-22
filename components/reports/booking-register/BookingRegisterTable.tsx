"use client";

import GuestTable, {
  type GuestColumn,
} from "@/components/guest/shared/GuestTable";
import { formatReportMoney } from "@/container/reports/shared/types";
import type { BookingReportRow } from "@/container/reports/booking-register/types";

const columns: GuestColumn<BookingReportRow>[] = [
  { label: "Register date", value: (r) => r.Register_Date || "—" },
  { label: "Booking no.", value: (r) => r.Booking_No || "—" },
  { label: "Guest", value: (r) => r.Guest_Name || "—" },
  { label: "Contact", value: (r) => r.Contact_No || "—" },
  { label: "Room type", value: (r) => r.Room_TName || "—" },
  { label: "Rooms", value: (r) => r.NoOf_Room ?? "—" },
  {
    label: "Check-in",
    value: (r) => r.CheckIn_Date || r.Checkin_Date || "—",
  },
  {
    label: "Exp. checkout",
    value: (r) => r.ExpChkOut_Dt || r.Exp_Chkout_Dt || "—",
  },
  { label: "Agent", value: (r) => r.Agent_Name || "—" },
  { label: "Advance", value: (r) => formatReportMoney(r.Adv_Amount) },
];

type Props = {
  rows: BookingReportRow[];
  loading: boolean;
  searched: boolean;
};

export default function BookingRegisterTable({
  rows,
  loading,
  searched,
}: Props) {
  return (
    <GuestTable
      rows={rows}
      loading={loading}
      columns={columns}
      rowKey={(r, i) => r.Booking_No || i}
      emptyTitle={
        searched ? "No bookings found for this filter" : "Run a report to view bookings"
      }
    />
  );
}
