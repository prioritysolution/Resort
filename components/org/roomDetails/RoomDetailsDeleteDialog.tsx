"use client";

import { PageLoader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { RoomDetail } from "@/container/org/roomDetails/types";

type RoomDetailsDeleteDialogProps = {
  open: boolean;
  target: RoomDetail | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const RoomDetailsDeleteDialog = ({
  open,
  target,
  deleting,
  onCancel,
  onConfirm,
}: RoomDetailsDeleteDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete room?</AlertDialogTitle>
          <AlertDialogDescription>
            This will soft-delete room{" "}
            <span className="font-medium text-foreground">
              {target?.Room_No || "this room"}
            </span>
            . Linked reservations or orders may block deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-10 cursor-pointer rounded-[0.625rem]"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-10 min-w-28 cursor-pointer rounded-[0.625rem]"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <PageLoader variant="button" light className="!min-h-0 !w-auto !p-0" />
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoomDetailsDeleteDialog;
