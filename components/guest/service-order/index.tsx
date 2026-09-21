"use client";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import type { useServiceOrder } from "@/container/guest/service-order/Hooks";
import ServiceOrderToolbar from "./ServiceOrderToolbar";
import ServiceOrderTable from "./ServiceOrderTable";
import ServiceOrderFormDialog from "./ServiceOrderFormDialog";
import ServiceOrderDeleteDialog from "./ServiceOrderDeleteDialog";
type Props = ReturnType<typeof useServiceOrder>;
export function ServiceOrderView(props: Props) {
  return (
    <ListPageFrame
      title="Service Order"
      description="Manage paid guest service orders."
      toolbar={
        <ServiceOrderToolbar
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
          <ServiceOrderFormDialog
            open={props.dialogOpen}
            form={props.form}
            editing={props.editingRow}
            saving={props.saving}
            services={props.services}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
          />
          <ServiceOrderDeleteDialog
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
      <ServiceOrderTable
        rows={props.rows}
        loading={props.loading}
        onEdit={props.openEdit}
        onDelete={props.setDeleteTarget}
      />
    </ListPageFrame>
  );
}

export default ServiceOrderView;
