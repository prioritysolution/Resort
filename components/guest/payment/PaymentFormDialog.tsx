"use client";
import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLoader } from "@/components/shared";
import InputField from "@/common/formFields/InputField";
import SwitchField from "@/common/formFields/SwitchField";
import type {
  Payment,
  PaymentFormValues,
} from "@/container/guest/payment/types";
type Props = {
  open: boolean;
  form: UseFormReturn<PaymentFormValues>;
  editing: Payment | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (v: PaymentFormValues) => void;
};
export default function PaymentFormDialog({
  open,
  form,
  editing,
  saving,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit payment" : "Add payment"}</DialogTitle>
          <DialogDescription>
            Record a collection against a reservation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <InputField
              control={form.control}
              name="reservation_no"
              label="Reservation number"
              isRequired
            />
            <InputField
              control={form.control}
              name="coll_date"
              label="Collection date"
              type="date"
            />
            <InputField
              control={form.control}
              name="coll_amount"
              label="Amount"
              type="number"
              isRequired
            />
            <InputField
              control={form.control}
              name="coll_mode"
              label="Collection mode"
              type="number"
              isRequired
            />
            <div className="sm:col-span-2">
              <SwitchField
                control={form.control}
                name="final_coll"
                label="Final collection"
              />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <PageLoader variant="button" light />
                ) : editing ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
