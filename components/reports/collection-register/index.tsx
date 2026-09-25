"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useCollectionRegister } from "@/container/reports/collection-register/Hooks";
import CollectionRegisterToolbar from "./CollectionRegisterToolbar";
import CollectionRegisterTable from "./CollectionRegisterTable";

type Props = ReturnType<typeof useCollectionRegister>;

export function CollectionRegisterView(props: Props) {
  return (
    <ListPageFrame
      title="Collection register"
      description="Collections by date or month, for one reservation, or for one booking."
      toolbar={
        <CollectionRegisterToolbar
          form={props.form}
          loading={props.loading}
          onSubmit={props.runReport}
        />
      }
    >
      <ReportMetaBar
        items={[
          { label: "Type", value: props.meta?.collection_type },
          { label: "Reservation", value: props.meta?.reservation_no },
          { label: "Booking", value: props.meta?.booking_no },
          { label: "Total records", value: props.meta?.total_records },
          {
            label: "Total collection",
            value: props.meta?.total_collection,
            emphasize: true,
          },
        ]}
      />
      <CollectionRegisterTable
        rows={props.rows}
        loading={props.loading}
        searched={props.searched}
      />
    </ListPageFrame>
  );
}

export default CollectionRegisterView;
