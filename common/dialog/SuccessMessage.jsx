"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SuccessMessage = ({ open, onClose, title = "Success", message }) => {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent showCloseButton={false} className="text-center">
        <DialogHeader className="items-center">
          <CheckCircle2 className="mb-1 size-12 text-teal-600" />
          <DialogTitle>{title}</DialogTitle>
          {message ? <DialogDescription>{message}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button type="button" className="h-10 min-w-28" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessMessage;
