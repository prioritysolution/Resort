"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useBookingRegister } from "@/container/reports/booking-register/Hooks";
import BookingRegisterToolbar from "./BookingRegisterToolbar";
import BookingRegisterTable from "./BookingRegisterTable";

type Props = ReturnType<typeof useBookingRegister>;

export function BookingRegisterView(props: Props) {
  return (
    <ListPageFrame
      title="Booking register"
      description="Booking created-date report by month or date range."
      toolbar={
        <BookingRegisterToolbar
          form={props.form}
          loading={props.loading}
          onSubmit={props.runReport}
        />
      }
    >
      <ReportMetaBar
        items={[
          { label: "Total records", value: props.meta?.total_records },
          {
            label: "Total advance",
            value: props.meta?.total_advance,
            emphasize: true,
          },
        ]}
      />
      <BookingRegisterTable
        rows={props.rows}
        loading={props.loading}
        searched={props.searched}
      />
    </ListPageFrame>
  );
}

export default BookingRegisterView;
