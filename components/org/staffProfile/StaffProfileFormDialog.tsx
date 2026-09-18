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
import TextareaField from "@/common/formFields/TextareaField";
import SwitchField from "@/common/formFields/SwitchField";
import type { StaffProfile, StaffProfileFormValues } from "@/container/org/staffProfile/types";

const genderOptions = [
  { Id: 1, Option_Value: "Male", Gender_Cd: 1 },
  { Id: 2, Option_Value: "Female", Gender_Cd: 2 },
  { Id: 3, Option_Value: "Others", Gender_Cd: 3 },
];

type StaffProfileFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<StaffProfileFormValues>;
  editingRow: StaffProfile | null;
  saving: boolean;
  onSubmit: (values: StaffProfileFormValues) => void | Promise<void>;
};

const StaffProfileFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  onSubmit,
}: StaffProfileFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Staff_Id);

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit staff profile" : "Add staff profile"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update personal, employment, and release details."
              : "Create a staff record with contact and employment info."}
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
                name="staff_name"
                label="Staff name"
                placeholder="Ramesh Kumar"
                isRequired
                maxLength={100}
              />
              <InputField
                control={form.control}
                name="nick_name"
                label="Nick name"
                placeholder="Ramesh"
                maxLength={25}
              />
              <InputField
                control={form.control}
                name="guardian_name"
                label="Guardian name"
                placeholder="Suresh Kumar"
                maxLength={75}
              />
              <InputField
                control={form.control}
                name="cont_no"
                label="Contact no"
                placeholder="9876543210"
                maxLength={15}
              />
              <DropdownField
                control={form.control}
                name="gender_cd"
                label="Gender"
                options={genderOptions}
                optionLabelKey="Option_Value"
                optionValueKey="Gender_Cd"
                isRequired
              />
              <InputField
                control={form.control}
                name="age"
                label="Age"
                placeholder="28"
                maxLength={2}
              />
              <InputField
                control={form.control}
                name="aadhar_no"
                label="Aadhar no"
                placeholder="1234-5678-9012"
                maxLength={20}
              />
              <DatePicker
                control={form.control}
                name="join_date"
                label="Join date"
                placeholder="Select join date"
              />
              <InputField
                control={form.control}
                name="designation"
                label="Designation"
                placeholder="Manager"
                maxLength={25}
              />
              <InputField
                control={form.control}
                name="salary"
                label="Salary"
                type="number"
                placeholder="15000"
              />
              <InputField
                control={form.control}
                name="bank_dtls"
                label="Bank details"
                placeholder="SBI 123456"
                maxLength={25}
                formItemClassName="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <TextareaField
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Purulia"
                  rows={2}
                />
              </div>
              <InputField
                control={form.control}
                name="remarks"
                label="Remarks"
                placeholder="Optional notes"
                maxLength={50}
                formItemClassName="sm:col-span-2"
              />
            </div>

            {isEdit ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePicker
                  control={form.control}
                  name="release_date"
                  label="Release date"
                  placeholder="Select release date"
                />
                <SwitchField
                  control={form.control}
                  name="status"
                  label="Active"
                  description="Inactive staff stay hidden from operations."
                />
              </div>
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

export default StaffProfileFormDialog;
