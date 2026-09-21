"use client";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import type { useFoodOrder } from "@/container/guest/food-order/Hooks";
import FoodOrderToolbar from "./FoodOrderToolbar";
import FoodOrderTable from "./FoodOrderTable";
import FoodOrderFormDialog from "./FoodOrderFormDialog";
import FoodOrderDeleteDialog from "./FoodOrderDeleteDialog";
type Props = ReturnType<typeof useFoodOrder>;
export function FoodOrderView(props: Props) {
  return (
    <ListPageFrame
      title="Food Order"
      description="Manage in-stay food orders and delivery."
      toolbar={
        <FoodOrderToolbar
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
          <FoodOrderFormDialog
            open={props.dialogOpen}
            form={props.form}
            editing={props.editingRow}
            saving={props.saving}
            menus={props.menus}
            rooms={props.rooms}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
          />
          <FoodOrderDeleteDialog
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
      <FoodOrderTable
        rows={props.rows}
        loading={props.loading}
        onEdit={props.openEdit}
        onDelete={props.setDeleteTarget}
        onDelivered={props.markDelivered}
      />
    </ListPageFrame>
  );
}

export default FoodOrderView;
