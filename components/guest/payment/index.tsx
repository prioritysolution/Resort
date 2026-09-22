"use client";

import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { formatMoney } from "@/container/guest/payment/types";
import type { usePayment } from "@/container/guest/payment/Hooks";
import PaymentToolbar from "./PaymentToolbar";
import PaymentTable from "./PaymentTable";
import PaymentFormDialog from "./PaymentFormDialog";
import PaymentDeleteDialog from "./PaymentDeleteDialog";

type Props = ReturnType<typeof usePayment>;

export function PaymentView(props: Props) {
  const meta = props.listMeta;
  const showListDue = meta && Number(meta.checkout_status) === 1;

  return (
    <ListPageFrame
      title="Payment"
      description="Record collections against reservations. Due shows only after checkout."
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
            dueInfo={props.dueInfo}
            dueLoading={props.dueLoading}
            checkoutDone={props.checkoutDone}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
            onLoadDue={props.loadDue}
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
      {showListDue ? (
        <div className="mb-3 grid grid-cols-2 gap-3 rounded-[0.625rem] border border-border bg-chrome p-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Net amount</p>
            <p className="text-sm font-medium">
              {formatMoney(meta?.net_amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Amount paid</p>
            <p className="text-sm font-medium">
              {formatMoney(meta?.amount_paid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due amount</p>
            <p className="text-sm font-medium text-primary">
              {formatMoney(meta?.due_amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Checkout</p>
            <p className="text-sm font-medium">Done</p>
          </div>
        </div>
      ) : null}
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
