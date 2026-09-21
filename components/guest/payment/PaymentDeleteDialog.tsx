"use client";

import GuestConfirmDialog from "@/components/guest/shared/GuestConfirmDialog";
import type { Payment } from "@/container/guest/payment/types";

type Props = {
  target: Payment | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function PaymentDeleteDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <GuestConfirmDialog
      open={Boolean(target)}
      title="Delete payment?"
      description="This action updates the guest stay record and cannot be undone from this screen."
      busy={busy}
      confirmLabel="Delete"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
