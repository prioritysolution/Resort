"use client";

import GuestConfirmDialog from "@/components/guest/shared/GuestConfirmDialog";
import type { Booking } from "@/container/guest/booking/types";

type Props = {
  target: Booking | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function BookingCancelDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <GuestConfirmDialog
      open={Boolean(target)}
      title="Cancel booking?"
      description="This action updates the guest stay record and cannot be undone from this screen."
      busy={busy}
      confirmLabel="Cancel"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
