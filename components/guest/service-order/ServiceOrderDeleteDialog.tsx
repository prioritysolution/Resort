"use client";

import GuestConfirmDialog from "@/components/guest/shared/GuestConfirmDialog";
import type { ServiceOrder } from "@/container/guest/service-order/types";

type Props = {
  target: ServiceOrder | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ServiceOrderDeleteDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <GuestConfirmDialog
      open={Boolean(target)}
      title="Delete service order?"
      description="This action updates the guest stay record and cannot be undone from this screen."
      busy={busy}
      confirmLabel="Delete"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
