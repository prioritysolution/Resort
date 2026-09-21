"use client";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import type { usePayment } from "@/container/guest/payment/Hooks";
import PaymentToolbar from "./PaymentToolbar";
import PaymentTable from "./PaymentTable";
import PaymentFormDialog from "./PaymentFormDialog";
import PaymentDeleteDialog from "./PaymentDeleteDialog";
type Props = ReturnType<typeof usePayment>;
export function PaymentView(props: Props) {
  return (
    <ListPageFrame
      title="Payment"
      description="Track collections received against reservations."
      toolbar={
        <PaymentToolbar
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
          <PaymentFormDialog
            open={props.dialogOpen}
            form={props.form}
            editing={props.editingRow}
            saving={props.saving}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
          />
          <PaymentDeleteDialog
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
      <PaymentTable
        rows={props.rows}
        loading={props.loading}
        onEdit={props.openEdit}
        onDelete={props.setDeleteTarget}
      />
    </ListPageFrame>
  );
}

export default PaymentView;
