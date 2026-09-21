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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/shared";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import TextareaField from "@/common/formFields/TextareaField";
import SwitchField from "@/common/formFields/SwitchField";
import {
  BOOKING_ADVANCE_MODES,
  type Booking,
  type BookingFormValues,
} from "@/container/guest/booking/types";
import DatePicker from "@/common/formFields/DatePicker";

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
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <DialogHeader className="shrink-0 px-4 pt-4">
          <DialogTitle>{editing ? "Edit booking" : "Add booking"}</DialogTitle>
          <DialogDescription>
            Capture guest, room type, planned stay, and advance payment details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  control={form.control}
                  name="guest_name"
                  label="Guest name"
                  isRequired
                  placeholder="Enter guest name"
                />
                <InputField
                  control={form.control}
                  name="contact_no"
                  label="Contact number"
                  maxLength={15}
                  digitsOnly
                  isRequired
                  placeholder="Enter contact number"
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
                <DatePicker
                  control={form.control}
                  name="checkin_date"
                  label="Check-in date"
                  placeholder="Select check-in date"
                  isRequired
                />
                <InputField
                  control={form.control}
                  name="stay_duration"
                  label="Stay duration (nights)"
                  type="number"
                  isRequired
                />
                <DatePicker
                  control={form.control}
                  name="exp_chkout_dt"
                  label="Expected checkout"
                  placeholder="Select expected checkout date"
                />
                <DropdownField
                  control={form.control}
                  name="agent_id"
                  label="Travel agent"
                  options={agents}
                  optionLabelKey="Name"
                />
                <InputField
                  control={form.control}
                  name="advance_amount"
                  label="Advance amount"
                  type="number"
                  placeholder="Enter advance amount"
                />
                <FormField
                  control={form.control}
                  name="advance_mode"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm font-medium">
                        Advance mode
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          className="flex flex-wrap gap-3 pt-1"
                        >
                          {BOOKING_ADVANCE_MODES.map((mode) => (
                            <Label
                              key={mode.value}
                              className="flex cursor-pointer items-center gap-2 rounded-[0.625rem] border border-border bg-background px-3 py-2.5 text-sm font-normal has-[[data-slot=radio-group-item][data-checked]]:border-primary has-[[data-slot=radio-group-item][data-checked]]:bg-primary/5"
                            >
                              <RadioGroupItem value={String(mode.value)} />
                              {mode.label}
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-2">
                  <SwitchField
                    control={form.control}
                    name="is_refundable"
                    label="Refundable"
                    description="Turn on if the advance amount can be refunded."
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextareaField
                    control={form.control}
                    name="note"
                    label="Note"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mx-0 mb-0 shrink-0">
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
