"use client";

import GuestConfirmDialog from "@/components/guest/shared/GuestConfirmDialog";
import type { Checkout } from "@/container/guest/checkout/types";

type Props = {
  target: Checkout | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function CheckoutCancelDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <GuestConfirmDialog
      open={Boolean(target)}
      title="Cancel checkout?"
      description="This action updates the guest stay record and cannot be undone from this screen."
      busy={busy}
      confirmLabel="Cancel"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
