"use client";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import type { useReservation } from "@/container/guest/reservation/Hooks";
import ReservationToolbar from "./ReservationToolbar";
import ReservationTable from "./ReservationTable";
import ReservationFormDialog from "./ReservationFormDialog";
type Props = ReturnType<typeof useReservation>;
export function ReservationView(props: Props) {
  return (
    <ListPageFrame
      title="Reservation"
      description="Allot rooms for walk-ins or existing bookings."
      toolbar={
        <ReservationToolbar
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
          <ReservationFormDialog
            open={props.dialogOpen}
            form={props.form}
            editing={props.editingRow}
            saving={props.saving}
            rooms={props.rooms}
            agents={props.agents}
            guestForm={props.guestForm}
            guestDialogOpen={props.guestDialogOpen}
            editingGuestIndex={props.editingGuestIndex}
            maxAdditionalGuests={props.maxAdditionalGuests}
            onClose={props.closeDialog}
            onSubmit={props.handleSubmit}
            onOpenGuestDialog={props.openGuestDialog}
            onCloseGuestDialog={props.closeGuestDialog}
            onSaveGuest={props.saveGuest}
            onRemoveGuest={props.removeGuest}
            onSelectBooking={props.applySelectedBooking}
          />
          <SuccessMessage
            open={props.successOpen}
            onClose={() => props.setSuccessOpen(false)}
            message={props.successMessage}
          />
        </>
      }
    >
      <ReservationTable
        rows={props.rows}
        loading={props.loading}
        onEdit={props.openEdit}
        onDelete={props.setDeleteTarget}
      />
    </ListPageFrame>
  );
}

export default ReservationView;
