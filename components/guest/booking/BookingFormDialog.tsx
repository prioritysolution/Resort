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
  Booking,
  BookingFormValues,
} from "@/container/guest/booking/types";
type Props = {
  open: boolean;
  form: UseFormReturn<BookingFormValues>;
  editing: Booking | null;
  saving: boolean;
  roomTypes: Array<{ Id: number; Name: string }>;
  agents: Array<{ Id: number; Name: string }>;
  onClose: () => void;
  onSubmit: (v: BookingFormValues) => void;
};
export default function BookingFormDialog({
  open,
  form,
  editing,
  saving,
  roomTypes,
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
          <DialogTitle>{editing ? "Edit booking" : "Add booking"}</DialogTitle>
          <DialogDescription>
            Capture guest, room type, and planned stay details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
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
              maxLength={15}
              isRequired
            />
            <DropdownField
              control={form.control}
              name="room_tid"
              label="Room type"
              options={roomTypes}
              optionLabelKey="Name"
              isRequired
            />
            <InputField
              control={form.control}
              name="no_of_room"
              label="Rooms"
              type="number"
              isRequired
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
              name="stay_duration"
              label="Stay duration (nights)"
              type="number"
              isRequired
            />
            <InputField
              control={form.control}
              name="exp_chkout_dt"
              label="Expected checkout"
              type="date"
            />
            <DropdownField
              control={form.control}
              name="agent_id"
              label="Travel agent"
              options={agents}
              optionLabelKey="Name"
            />
            <div className="sm:col-span-2">
              <TextareaField control={form.control} name="note" label="Note" />
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
