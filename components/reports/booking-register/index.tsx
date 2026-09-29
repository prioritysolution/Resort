"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useBookingRegister } from "@/container/reports/booking-register/Hooks";
import BookingRegisterToolbar from "./BookingRegisterToolbar";
import BookingRegisterTable, { bookingColumns } from "./BookingRegisterTable";
import { PrintDownloadActions } from "../shared/PrintDownloadActions";

type Props = ReturnType<typeof useBookingRegister>;

export function BookingRegisterView(props: Props) {
  const printColumns = bookingColumns.map(c => c.label);
  const printData = props.rows.map(row => {
    const newRow: any = {};
    bookingColumns.forEach(c => {
      newRow[c.label] = c.value(row);
    });
    return newRow;
  });

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
      action={<PrintDownloadActions title="Booking register" columns={printColumns} data={printData} />}
    >
      {/* <ReportMetaBar
        items={[
          { label: "Total records", value: props.meta?.total_records },
          {
            label: "Total advance",
            value: props.meta?.total_advance,
            emphasize: true,
          },
        ]}
      /> */}
      <BookingRegisterTable
        rows={props.rows}
        loading={props.loading}
        searched={props.searched}
      />
    </ListPageFrame>
  );
}

export default BookingRegisterView;
