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
import SwitchField from "@/common/formFields/SwitchField";
import type { RoomDetail, RoomDetailFormValues } from "@/container/org/roomDetails/types";
import type { RoomType } from "@/container/org/roomType/types";

type RoomDetailsFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<RoomDetailFormValues>;
  editingRow: RoomDetail | null;
  saving: boolean;
  roomTypeOptions: RoomType[];
  onSubmit: (values: RoomDetailFormValues) => void | Promise<void>;
};

const RoomDetailsFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  roomTypeOptions,
  onSubmit,
}: RoomDetailsFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Room_Id);

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
            {isEdit ? "Edit room" : "Add room"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update room number, occupancy, and booking settings."
              : "Create a room under a type with occupancy limits."}
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
                name="room_type"
                label="Room type"
                options={dropdownOptions}
                optionLabelKey="Option_Value"
                optionValueKey="Room_TId"
                isRequired
                className="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="room_no"
                label="Room number"
                placeholder="101"
                isRequired
                maxLength={10}
              />
              <InputField
                control={form.control}
                name="room_desc"
                label="Description"
                placeholder="Cottage"
                maxLength={150}
              />
              <InputField
                control={form.control}
                name="adult"
                label="Adult"
                type="number"
                placeholder="2"
                isRequired
              />
              <InputField
                control={form.control}
                name="child"
                label="Child"
                type="number"
                placeholder="1"
              />
            </div>

            <SwitchField
              control={form.control}
              name="booking_allowed"
              label="Booking allowed"
              description="When off, this room stays unavailable for new bookings."
            />

            {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive rooms stay hidden from operations."
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

export default RoomDetailsFormDialog;
