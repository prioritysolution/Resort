"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useReservationRegister } from "@/container/reports/reservation-register/Hooks";
import ReservationRegisterToolbar from "./ReservationRegisterToolbar";
import ReservationRegisterTable from "./ReservationRegisterTable";

type Props = ReturnType<typeof useReservationRegister>;

export function ReservationRegisterView(props: Props) {
  return (
    <ListPageFrame
      title="Reservation register"
      description="Reservation report by created date, month, or reservation number."
      toolbar={
        <ReservationRegisterToolbar
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
            label: "Total amount paid",
            value: props.meta?.total_amount_paid,
            emphasize: true,
          },
        ]}
      />
      <ReservationRegisterTable
        rows={props.rows}
        loading={props.loading}
        searched={props.searched}
      />
    </ListPageFrame>
  );
}

export default ReservationRegisterView;
