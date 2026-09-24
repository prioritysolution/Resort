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
import { Copy } from "lucide-react";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import TextareaField from "@/common/formFields/TextareaField";
import { preventEnterSubmit } from "@/common/formFields/preventEnterSubmit";
import {
  RESERVATION_GENDER_OPTIONS,
  type ReservationGuestFormValues,
} from "@/container/guest/reservation/types";

type Props = {
  open: boolean;
  form: UseFormReturn<ReservationGuestFormValues>;
  editing: boolean;
  /** Primary guest address (address_1 + address_2) */
  primaryAddress?: string;
  onClose: () => void;
  onSubmit: (v: ReservationGuestFormValues) => void;
};

export default function ReservationGuestDialog({
  open,
  form,
  editing,
  primaryAddress = "",
  onClose,
  onSubmit,
}: Props) {
  const handleCopyPrimaryAddress = () => {
    const address = primaryAddress.trim();
    if (!address) return;
    form.setValue("address", address, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="shrink-0 px-4 pt-4">
          <DialogTitle>
            {editing ? "Edit additional guest (Optional)" : "Add additional guest (Optional)"}
          </DialogTitle>
          {/* <DialogDescription>
            Optional companion details. Total additional guests cannot exceed
            adults + children − 1.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            onKeyDown={preventEnterSubmit}
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
                  maxLength={25}
                  digitsOnly
                  isRequired
                  placeholder="Enter contact number"
                />
                <InputField
                  control={form.control}
                  name="age"
                  label="Age"
                  type="number"
                  isRequired
                  placeholder="Enter age"
                />
                <DropdownField
                  control={form.control}
                  name="gender"
                  label="Gender"
                  options={[...RESERVATION_GENDER_OPTIONS]}
                  optionLabelKey="Name"
                  isRequired
                />
                <div className="sm:col-span-2">
                  <InputField
                    control={form.control}
                    name="aadhar_no"
                    label="Aadhar number"
                    placeholder="Enter 12-digit aadhar number"
                    digitsOnly
                    maxLength={12}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Address
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!primaryAddress.trim()}
                      onClick={handleCopyPrimaryAddress}
                    >
                      <Copy className="size-3.5" />
                      Use primary address
                    </Button>
                  </div>
                  <TextareaField
                    control={form.control}
                    name="address"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mx-0 mb-0 shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editing ? "Update guest" : "Add guest"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
