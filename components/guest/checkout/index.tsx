"use client";

import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import type { useCheckout } from "@/container/guest/checkout/Hooks";
import CheckoutToolbar from "./CheckoutToolbar";
import CheckoutTable from "./CheckoutTable";
import CheckoutFormDialog from "./CheckoutFormDialog";
import CheckoutCancelDialog from "./CheckoutCancelDialog";

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
          <SuccessMessage
            open={props.successOpen}
            onClose={() => props.setSuccessOpen(false)}
            message={props.successMessage}
          />
        </>
      }
    >
      <CheckoutTable
        rows={props.rows}
        loading={props.loading}
        onDelete={props.setDeleteTarget}
      />
    </ListPageFrame>
  );
}

export default CheckoutView;
