"use client";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
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
import SwitchField from "@/common/formFields/SwitchField";
import type {
  FoodOrder,
  FoodOrderFormValues,
} from "@/container/guest/food-order/types";
import DatePicker from "@/common/formFields/DatePicker";
import TimePicker from "@/common/formFields/TimePicker";
type Props = {
  open: boolean;
  form: UseFormReturn<FoodOrderFormValues>;
  editing: FoodOrder | null;
  saving: boolean;
  menus: Array<{ Id: number; Name: string }>;
  rooms: Array<{ Id: number; Name: string }>;
  onClose: () => void;
  onSubmit: (v: FoodOrderFormValues) => void;
};
export default function FoodOrderFormDialog({
  open,
  form,
  editing,
  saving,
  menus,
  rooms,
  onClose,
  onSubmit,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit food order" : "Add food order"}
          </DialogTitle>
          <DialogDescription>
            Server-side GST is calculated after saving.
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
            <DatePicker
              control={form.control}
              name="order_date"
              label="Order date"
            />
            <TimePicker
              control={form.control}
              name="order_time"
              label="Order time"
              placeholder="Select time"
              isManualInput
            />
            <DropdownField
              control={form.control}
              name="room_id"
              label="Room"
              options={rooms}
              optionLabelKey="Name"
            />
            <SwitchField
              control={form.control}
              name="room_service"
              label="Room service"
            />
            <div className="sm:col-span-2">
              <TextareaField
                control={form.control}
                name="special_ins"
                label="Special instructions"
              />
            </div>
            <div className="grid gap-3 sm:col-span-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_8rem_auto] items-end gap-2"
                >
                  <DropdownField
                    control={form.control}
                    name={`items.${index}.menu_id`}
                    label="Menu item"
                    options={menus}
                    optionLabelKey="Name"
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    label="Quantity"
                    type="number"
                    isRequired
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() => append({ menu_id: "", quantity: 1 })}
              >
                Add item
              </Button>
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
