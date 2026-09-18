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
import type { MenuDetail } from "@/container/org/menuDetails/types";

type MenuDetailsDeleteDialogProps = {
  open: boolean;
  target: MenuDetail | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const MenuDetailsDeleteDialog = ({
  open,
  target,
  deleting,
  onCancel,
  onConfirm,
}: MenuDetailsDeleteDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will soft-delete{" "}
            <span className="font-medium text-foreground">
              {target?.Menu_Name || "this item"}
            </span>
            . Linked orders may block deletion.
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

export default MenuDetailsDeleteDialog;
