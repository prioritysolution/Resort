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
import TextareaField from "@/common/formFields/TextareaField";
import SwitchField from "@/common/formFields/SwitchField";
import type { TravelAgent, TravelAgentFormValues } from "@/container/org/travelAgent/types";

type TravelAgentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<TravelAgentFormValues>;
  editingRow: TravelAgent | null;
  saving: boolean;
  onSubmit: (values: TravelAgentFormValues) => void | Promise<void>;
};

const TravelAgentFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  onSubmit,
}: TravelAgentFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Agent_Id);

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit travel agent" : "Add travel agent"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update agent details and commission percent."
              : "Create a partner travel agent with optional commission."}
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
                name="agent_name"
                label="Agent name"
                placeholder="Rajesh Travels"
                isRequired
                maxLength={100}
                formItemClassName="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="org_name"
                label="Organization"
                placeholder="Rajesh Tours & Travels"
                maxLength={150}
                formItemClassName="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <TextareaField
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Kolkata"
                  rows={2}
                />
              </div>
              <InputField
                control={form.control}
                name="contact_no"
                label="Contact no"
                placeholder="9876543210"
                maxLength={25}
              />
              <InputField
                control={form.control}
                name="comm_prcnt"
                label="Commission %"
                type="number"
                placeholder="10"
              />
              <InputField
                control={form.control}
                name="gst_no"
                label="GST no"
                placeholder="GSTIN"
                maxLength={25}
              />
              <InputField
                control={form.control}
                name="pan_no"
                label="PAN no"
                placeholder="ABCDE1234F"
                maxLength={15}
                isUpper
              />
            </div>

            {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive agents stay hidden from new bookings."
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

export default TravelAgentFormDialog;
