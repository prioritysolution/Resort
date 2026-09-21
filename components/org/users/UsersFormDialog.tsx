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
import type { AppUser, AppUserFormValues } from "@/container/org/users/types";

type UsersFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AppUserFormValues>;
  editingRow: AppUser | null;
  saving: boolean;
  onSubmit: (values: AppUserFormValues) => void | Promise<void>;
};

const UsersFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  onSubmit,
}: UsersFormDialogProps) => {
  const isEdit = Boolean(editingRow?.User_Id);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal
    >
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit user" : "Add user"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update name and user code. Password cannot be changed here."
              : "Create a user for the current organisation and branch."}
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
                name="user_name"
                label="User name"
                placeholder="Sourav Mondal"
                isRequired
                maxLength={100}
                className="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="short_name"
                label="Short name"
                placeholder="Sourav"
                isRequired
                maxLength={25}
              />
              <InputField
                control={form.control}
                name="user_code"
                label="User code"
                placeholder="0112"
                isRequired
                maxLength={25}
              />
              {!isEdit ? (
                <InputField
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Min 6 characters"
                  isRequired
                  className="sm:col-span-2"
                />
              ) : null}
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 cursor-pointer rounded-[0.625rem]"
                onMouseDown={(event) => {
                  // Prevent the closing click from landing on "+ Add user" underneath
                  event.preventDefault();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onOpenChange(false);
                }}
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

export default UsersFormDialog;
