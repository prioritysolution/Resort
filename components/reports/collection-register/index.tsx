"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useCollectionRegister } from "@/container/reports/collection-register/Hooks";
import CollectionRegisterToolbar from "./CollectionRegisterToolbar";
import CollectionRegisterTable, { collectionColumns } from "./CollectionRegisterTable";
import { PrintDownloadActions } from "../shared/PrintDownloadActions";

type Props = ReturnType<typeof useCollectionRegister>;

export function CollectionRegisterView(props: Props) {
  const printColumns = collectionColumns.map(c => c.label);
  const printData = props.rows.map(row => {
    const newRow: any = {};
    collectionColumns.forEach(c => {
      newRow[c.label] = c.value(row);
    });
    return newRow;
  });

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
      action={<PrintDownloadActions title="Collection register" columns={printColumns} data={printData} />}
    >
      {/* <ReportMetaBar
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
      /> */}
      <CollectionRegisterTable
        rows={props.rows}
        loading={props.loading}
        searched={props.searched}
      />
    </ListPageFrame>
  );
}

export default CollectionRegisterView;
