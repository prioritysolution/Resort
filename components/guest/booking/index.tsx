"use client";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import type { useBooking } from "@/container/guest/booking/Hooks";
import BookingToolbar from "./BookingToolbar";
import BookingTable from "./BookingTable";
import BookingFormDialog from "./BookingFormDialog";
import BookingCancelDialog from "./BookingCancelDialog";
type Props = ReturnType<typeof useBooking>;
export function BookingView(props: Props) {
  return (
    <ListPageFrame
      title="Booking"
      description="Manage upcoming guest bookings and cancellations."
      toolbar={
        <BookingToolbar
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
          <BookingFormDialog
            open={props.dialogOpen}
            form={props.form}
            editing={props.editingRow}
            saving={props.saving}
            roomTypes={props.roomTypes}
            agents={props.agents}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
          />
          <BookingCancelDialog
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
      <BookingTable
        rows={props.rows}
        loading={props.loading}
        onEdit={props.openEdit}
        onDelete={props.setDeleteTarget}
      />
    </ListPageFrame>
  );
}

export default BookingView;
