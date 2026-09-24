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
import ReservationSearchField from "@/common/Searchable/ReservationSearchField";
import DropdownField from "@/common/formFields/DropdownField";
import TextareaField from "@/common/formFields/TextareaField";
import { preventEnterSubmit } from "@/common/formFields/preventEnterSubmit";
import type {
  ServiceOrder,
  ServiceOrderFormValues,
} from "@/container/guest/service-order/types";
import DatePicker from "@/common/formFields/DatePicker";
type Props = {
  open: boolean;
  form: UseFormReturn<ServiceOrderFormValues>;
  editing: ServiceOrder | null;
  saving: boolean;
  services: Array<{ Id: number; Name: string }>;
  onClose: () => void;
  onSubmit: (v: ServiceOrderFormValues) => void;
};
export default function ServiceOrderFormDialog({
  open,
  form,
  editing,
  saving,
  services,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit service order" : "Add service order"}
          </DialogTitle>
          <DialogDescription>
            Add a paid service to an active reservation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onKeyDown={preventEnterSubmit}
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <ReservationSearchField
              control={form.control}
              name="reservation_no"
              label="Reservation number"
              isRequired
              placeholder="Enter or search reservation number"
            />
            <DatePicker
              control={form.control}
              name="order_date"
              label="Order date"
              placeholder="Select date"
            />
            <DropdownField
              control={form.control}
              name="service_id"
              label="Service"
              options={services}
              optionLabelKey="Name"
              isRequired
            />
            <InputField
              control={form.control}
              name="quantity"
              label="Quantity"
              type="number"
            />
            <div className="sm:col-span-2">
              <TextareaField
                control={form.control}
                name="remarks"
                label="Remarks"
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
