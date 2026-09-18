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
import type { RegularRate } from "@/container/org/priceManager/types";

type RegularRateDeleteDialogProps = {
  open: boolean;
  target: RegularRate | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const RegularRateDeleteDialog = ({
  open,
  target,
  deleting,
  onCancel,
  onConfirm,
}: RegularRateDeleteDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete regular rate?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the weekday rate card for{" "}
            <span className="font-medium text-foreground">
              {target?.Room_TName || "this room type"}
            </span>
            .
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

export default RegularRateDeleteDialog;
