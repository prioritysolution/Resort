"use client";

import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { formatMoney } from "@/container/guest/payment/types";
import type { usePayment } from "@/container/guest/payment/Hooks";
import PaymentToolbar from "./PaymentToolbar";
import PaymentTable from "./PaymentTable";
import PaymentFormDialog from "./PaymentFormDialog";
import PaymentBillDialog from "./PaymentBillDialog";
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
          {props.dialogOpen ? (
            <PaymentFormDialog
              open
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
          ) : null}
          {props.receiptOpen ? (
            <PaymentBillDialog
              open
              receipt={props.receipt}
              onClose={props.closeReceipt}
            />
          ) : null}
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
        <div className="shrink-0 space-y-3 border-b border-border bg-chrome px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Checkout complete — due available
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Net amount</p>
              <p className="text-sm font-medium">
                {formatMoney(meta?.net_amount)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Amount paid</p>
              <p className="text-sm font-medium">
                {formatMoney(meta?.amount_paid)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Due amount</p>
              <p className="text-sm font-medium text-primary">
                {formatMoney(meta?.due_amount)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Checkout</p>
              <p className="text-sm font-medium">Done</p>
            </div>
          </div>
        </div>
      ) : null}
      <PaymentTable rows={props.rows} loading={props.loading} />
    </ListPageFrame>
  );
}

export default PaymentView;
