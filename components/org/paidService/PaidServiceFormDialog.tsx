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
import type { PaidService, PaidServiceFormValues } from "@/container/org/paidService/types";
import TextareaField from "@/common/formFields/TextareaField";

type PaidServiceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<PaidServiceFormValues>;
  editingRow: PaidService | null;
  saving: boolean;
  onSubmit: (values: PaidServiceFormValues) => void | Promise<void>;
};

const PaidServiceFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  onSubmit,
}: PaidServiceFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Service_Id);

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit paid service" : "Add paid service"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update charges and availability for this service."
              : "Create a billable extra such as transfers or corkage."}
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
                name="service_name"
                label="Service name"
                placeholder="Corkage Fee"
                isRequired
                formItemClassName="sm:col-span-2"
              />
              <TextareaField
                control={form.control}
                name="serv_desc"
                label="Description"
                placeholder="Enter description"
                rows={3}
                formItemClassName="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="serv_charges"
                label="Charges"
                type="number"
                placeholder="100"
                isRequired
                formItemClassName="sm:col-span-2"
              />
            </div>

            {/* {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive services stay hidden from new bookings."
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

export default PaidServiceFormDialog;
