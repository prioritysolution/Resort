"use client";

import type { UseFormReturn } from "react-hook-form";
import { PageLoader } from "@/components/shared";
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
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import DatePicker from "@/common/formFields/DatePicker";
import SwitchField from "@/common/formFields/SwitchField";
import type { RoomType } from "@/container/org/roomType/types";
import type { SpecialRate, SpecialRateFormValues } from "@/container/org/priceManager/types";

type SpecialRateFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<SpecialRateFormValues>;
  editingRow: SpecialRate | null;
  saving: boolean;
  roomTypeOptions: RoomType[];
  onSubmit: (values: SpecialRateFormValues) => void | Promise<void>;
};

const SpecialRateFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  roomTypeOptions,
  onSubmit,
}: SpecialRateFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Rate_Id_Spl);

  const dropdownOptions = roomTypeOptions.map((item) => ({
    Id: item.Room_TId,
    Option_Value: item.Room_TName,
    Room_TId: item.Room_TId,
  }));

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit special rate" : "Add special rate"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update event dates, amount, and status."
              : "Create an event rate with a date range for a room type."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DropdownField
                control={form.control}
                name="room_tid"
                label="Room type"
                options={dropdownOptions}
                optionLabelKey="Option_Value"
                optionValueKey="Room_TId"
                isRequired
                className="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="event_name"
                label="Event name"
                placeholder="Durga Pujo 2026"
                isRequired
                maxLength={100}
                formItemClassName="sm:col-span-2"
              />
              <DatePicker
                control={form.control}
                name="date_from"
                label="Date from"
                placeholder="Select start date"
                isRequired
              />
              <DatePicker
                control={form.control}
                name="date_upto"
                label="Date upto"
                placeholder="Select end date"
                isRequired
              />
              <InputField
                control={form.control}
                name="rate_spl"
                label="Special rate"
                type="number"
                placeholder="4250"
                isRequired
                formItemClassName="sm:col-span-2"
              />
            </div>

            {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive special rates stay hidden from bookings."
              />
            ) : null}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 cursor-pointer rounded-[0.625rem]"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-28 cursor-pointer rounded-[0.625rem]"
                disabled={saving}
              >
                {saving ? (
                  <PageLoader variant="button" light className="!min-h-0 !w-auto !p-0" />
                ) : isEdit ? (
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
};

export default SpecialRateFormDialog;
