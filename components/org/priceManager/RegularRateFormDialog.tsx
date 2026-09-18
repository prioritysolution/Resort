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
import type { RegularRate, RegularRateFormValues } from "@/container/org/priceManager/types";
import type { RoomType } from "@/container/org/roomType/types";

type RegularRateFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<RegularRateFormValues>;
  editingRow: RegularRate | null;
  saving: boolean;
  roomTypeOptions: RoomType[];
  onSubmit: (values: RegularRateFormValues) => void | Promise<void>;
};

const dayFields = [
  { name: "rate_mon" as const, label: "Monday" },
  { name: "rate_tue" as const, label: "Tuesday" },
  { name: "rate_wed" as const, label: "Wednesday" },
  { name: "rate_thu" as const, label: "Thursday" },
  { name: "rate_fri" as const, label: "Friday" },
  { name: "rate_sat" as const, label: "Saturday" },
  { name: "rate_sun" as const, label: "Sunday" },
];

const RegularRateFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  roomTypeOptions,
  onSubmit,
}: RegularRateFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Rate_Id_Reg);

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
            {isEdit ? "Edit regular rate" : "Add regular rate"}
          </DialogTitle>
          <DialogDescription>
            Set Monday–Sunday rates for one room type. Only one regular rate per
            type is allowed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            autoComplete="off"
          >
            <DropdownField
              control={form.control}
              name="room_tid"
              label="Room type"
              options={dropdownOptions}
              optionLabelKey="Option_Value"
              optionValueKey="Room_TId"
              isRequired
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dayFields.map((field) => (
                <InputField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  label={field.label}
                  type="number"
                  placeholder="3750"
                  isRequired
                />
              ))}
            </div>

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

export default RegularRateFormDialog;
