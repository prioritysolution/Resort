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
import SwitchField from "@/common/formFields/SwitchField";
import type { RoomType, RoomTypeFormValues } from "@/container/org/roomType/types";

type RoomTypeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<RoomTypeFormValues>;
  editingRow: RoomType | null;
  saving: boolean;
  onSubmit: (values: RoomTypeFormValues) => void | Promise<void>;
};

const RoomTypeFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  onSubmit,
}: RoomTypeFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Room_TId);

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit room type" : "Add room type"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update charges and availability for this room type."
              : "Create a new room type with base and extra bed charges."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                control={form.control}
                name="room_tname"
                label="Room type name"
                placeholder="Deluxe Cottage"
                isRequired
                formItemClassName="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="room_charges"
                label="Room charges"
                type="number"
                placeholder="Enter room charges"
                isRequired
              />
              <InputField
                control={form.control}
                name="extra_bed_charges"
                label="Extra bed charges"
                type="number"
                placeholder="Enter extra bed charges"
                isRequired
              />
            </div>

            {/* {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive types stay hidden from new bookings."
              />
            ) : null} */}

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

export default RoomTypeFormDialog;
