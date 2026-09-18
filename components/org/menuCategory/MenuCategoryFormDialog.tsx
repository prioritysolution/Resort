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
import type { MenuCategory, MenuCategoryFormValues } from "@/container/org/menuCategory/types";

type MenuCategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MenuCategoryFormValues>;
  editingRow: MenuCategory | null;
  saving: boolean;
  onSubmit: (values: MenuCategoryFormValues) => void | Promise<void>;
};

const MenuCategoryFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  onSubmit,
}: MenuCategoryFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Category_Id);

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit category" : "Add category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category name and availability."
              : "Create a new menu category for food and beverage items."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            autoComplete="off"
          >
            <InputField
              control={form.control}
              name="categ_name"
              label="Category name"
              placeholder="Breakfast"
              isRequired
            />

            {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive categories stay hidden from menu setup."
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

export default MenuCategoryFormDialog;
