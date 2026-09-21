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
import DropdownField from "@/common/formFields/DropdownField";
import TextareaField from "@/common/formFields/TextareaField";
import type {
  Reservation,
  ReservationFormValues,
} from "@/container/guest/reservation/types";
type Props = {
  open: boolean;
  form: UseFormReturn<ReservationFormValues>;
  editing: Reservation | null;
  saving: boolean;
  rooms: Array<{ Id: number; Name: string }>;
  agents: Array<{ Id: number; Name: string }>;
  onClose: () => void;
  onSubmit: (v: ReservationFormValues) => void;
};
export default function ReservationFormDialog({
  open,
  form,
  editing,
  saving,
  rooms,
  agents,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit reservation" : "Add reservation"}
          </DialogTitle>
          <DialogDescription>
            Leave booking number blank for a walk-in. Use additional room IDs
            for multi-room stays.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <InputField
              control={form.control}
              name="booking_no"
              label="Booking number"
            />
            <InputField
              control={form.control}
              name="guest_name"
              label="Guest name"
              isRequired
            />
            <InputField
              control={form.control}
              name="contact_no"
              label="Contact number"
              maxLength={25}
              isRequired
            />
            <InputField
              control={form.control}
              name="aadhar_no"
              label="Aadhar number"
            />
            <InputField
              control={form.control}
              name="address_1"
              label="Address line 1"
            />
            <InputField
              control={form.control}
              name="address_2"
              label="Address line 2"
            />
            <InputField
              control={form.control}
              name="checkin_date"
              label="Check-in date"
              type="date"
              isRequired
            />
            <InputField
              control={form.control}
              name="checkout_date"
              label="Planned checkout"
              type="date"
              isRequired
            />
            <InputField
              control={form.control}
              name="adult_no"
              label="Adults"
              type="number"
              isRequired
            />
            <InputField
              control={form.control}
              name="child_no"
              label="Children"
              type="number"
            />
            <DropdownField
              control={form.control}
              name="room_id"
              label="Room"
              options={rooms}
              optionLabelKey="Name"
            />
            <InputField
              control={form.control}
              name="room_ids"
              label="Additional room IDs"
              placeholder="13,14"
              hint="Comma-separated; replaces the single room selection."
            />
            <InputField
              control={form.control}
              name="extra_bed_no"
              label="Extra beds"
              type="number"
            />
            <DropdownField
              control={form.control}
              name="agent_id"
              label="Travel agent"
              options={agents}
              optionLabelKey="Name"
            />
            <div className="sm:col-span-2">
              <TextareaField
                control={form.control}
                name="special_request"
                label="Special request"
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
