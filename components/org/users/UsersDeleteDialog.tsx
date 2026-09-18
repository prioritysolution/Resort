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
import type { AppUser } from "@/container/org/users/types";

type UsersDeleteDialogProps = {
  open: boolean;
  target: AppUser | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const UsersDeleteDialog = ({
  open,
  target,
  deleting,
  onCancel,
  onConfirm,
}: UsersDeleteDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate{" "}
            <span className="font-medium text-foreground">
              {target?.User_Name || "this user"}
            </span>
            . You cannot delete your own account.
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
              "Deactivate"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UsersDeleteDialog;
