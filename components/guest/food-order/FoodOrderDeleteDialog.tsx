"use client";

import GuestConfirmDialog from "@/components/guest/shared/GuestConfirmDialog";
import type { FoodOrder } from "@/container/guest/food-order/types";

type Props = {
  target: FoodOrder | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function FoodOrderDeleteDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <GuestConfirmDialog
      open={Boolean(target)}
      title="Delete food order?"
      description="This action updates the guest stay record and cannot be undone from this screen."
      busy={busy}
      confirmLabel="Delete"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
