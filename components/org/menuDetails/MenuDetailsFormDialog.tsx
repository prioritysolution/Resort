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
import type { MenuCategory } from "@/container/org/menuCategory/types";
import type { MenuDetail, MenuDetailFormValues } from "@/container/org/menuDetails/types";
import TextareaField from "@/common/formFields/TextareaField";

type MenuDetailsFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MenuDetailFormValues>;
  editingRow: MenuDetail | null;
  saving: boolean;
  categoryOptions: MenuCategory[];
  onSubmit: (values: MenuDetailFormValues) => void | Promise<void>;
};

const MenuDetailsFormDialog = ({
  open,
  onOpenChange,
  form,
  editingRow,
  saving,
  categoryOptions,
  onSubmit,
}: MenuDetailsFormDialogProps) => {
  const isEdit = Boolean(editingRow?.Item_Id);

  const dropdownOptions = categoryOptions.map((item) => ({
    Id: item.Category_Id,
    Option_Value: item.Categ_Name,
    Category_Id: item.Category_Id,
  }));

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit menu item" : "Add menu item"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update category, name, and pricing for this item."
              : "Create a menu item under a category with rate and details."}
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
                name="category_id"
                label="Category"
                options={dropdownOptions}
                optionLabelKey="Option_Value"
                optionValueKey="Category_Id"
                isRequired
                className="sm:col-span-2"
              />
              <InputField
                control={form.control}
                name="menu_name"
                label="Menu name"
                placeholder="Toast Butter/Jam"
                isRequired
                maxLength={150}
              />
              <InputField
                control={form.control}
                name="menu_code"
                label="Menu code"
                type="number"
                placeholder="101"
              />
              <InputField
                control={form.control}
                name="menu_shortnm"
                label="Short name"
                placeholder="Toast"
                maxLength={25}
              />
              <InputField
                control={form.control}
                name="rate"
                label="Rate"
                type="number"
                placeholder="45"
                isRequired
              />
              <TextareaField
                control={form.control}
                name="menu_desc"
                label="Description"
                placeholder="Enter description"
                rows={3}
                className="sm:col-span-2"
              />
            </div>

            {/* {isEdit ? (
              <SwitchField
                control={form.control}
                name="status"
                label="Active"
                description="Inactive items stay hidden from menu operations."
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

export default MenuDetailsFormDialog;
