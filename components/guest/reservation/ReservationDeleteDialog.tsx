"use client";

import GuestConfirmDialog from "@/components/guest/shared/GuestConfirmDialog";
import type { Reservation } from "@/container/guest/reservation/types";

type Props = {
  target: Reservation | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ReservationDeleteDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <GuestConfirmDialog
      open={Boolean(target)}
      title="Delete reservation?"
      description="This action updates the guest stay record and cannot be undone from this screen."
      busy={busy}
      confirmLabel="Delete"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
