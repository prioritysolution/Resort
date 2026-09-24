"use client";

import { ListPageFrame } from "@/components/shared";
import type { useCheckout } from "@/container/guest/checkout/Hooks";
import CheckoutToolbar from "./CheckoutToolbar";
import CheckoutTable from "./CheckoutTable";
import CheckoutFormDialog from "./CheckoutFormDialog";
import CheckoutCancelDialog from "./CheckoutCancelDialog";
import CheckoutBillDialog from "./CheckoutBillDialog";

type Props = ReturnType<typeof useCheckout>;

export function CheckoutView(props: Props) {
  return (
    <ListPageFrame
      title="Checkout"
      description="Preview bills, complete checkout, or cancel a checkout. Due can remain after checkout."
      toolbar={
        <CheckoutToolbar
          search={props.search}
          setSearch={props.setSearch}
          onAdd={props.openCreate}
          onRefresh={props.reload}
          loading={props.loading}
          count={props.rows.length}
        />
      }
      overlays={
        <>
          <CheckoutFormDialog
            open={props.dialogOpen}
            form={props.form}
            saving={props.saving}
            summary={props.summary}
            summaryLoading={props.summaryLoading}
            onPreview={props.previewSummary}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
          />
          <CheckoutCancelDialog
            target={props.deleteTarget}
            busy={props.deleting}
            onCancel={() => props.setDeleteTarget(null)}
            onConfirm={props.confirmDelete}
          />
          <CheckoutBillDialog
            open={props.billOpen}
            bill={props.bill}
            onClose={props.closeBill}
          />
        </>
      }
    >
      <CheckoutTable rows={props.rows} loading={props.loading} />
    </ListPageFrame>
  );
}

export default CheckoutView;
