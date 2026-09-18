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
import type { TravelAgent } from "@/container/org/travelAgent/types";

type TravelAgentDeleteDialogProps = {
  open: boolean;
  target: TravelAgent | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const TravelAgentDeleteDialog = ({
  open,
  target,
  deleting,
  onCancel,
  onConfirm,
}: TravelAgentDeleteDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete travel agent?</AlertDialogTitle>
          <AlertDialogDescription>
            This will soft-delete{" "}
            <span className="font-medium text-foreground">
              {target?.Agent_Name || "this travel agent"}
            </span>
            . Linked bookings or reservations may block deletion.
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

export default TravelAgentDeleteDialog;
