"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import MenuCategoryToolbar from "@/components/org/menuCategory/MenuCategoryToolbar";
import MenuCategoryTable from "@/components/org/menuCategory/MenuCategoryTable";
import MenuCategoryFormDialog from "@/components/org/menuCategory/MenuCategoryFormDialog";
import MenuCategoryDeleteDialog from "@/components/org/menuCategory/MenuCategoryDeleteDialog";
import type { MenuCategory, MenuCategoryFormValues } from "@/container/org/menuCategory/types";

export type MenuCategoryViewProps = {
  rows: MenuCategory[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: MenuCategory | null;
  deleteTarget: MenuCategory | null;
  setDeleteTarget: Dispatch<SetStateAction<MenuCategory | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<MenuCategoryFormValues>;
  openCreate: () => void;
  openEdit: (row: MenuCategory) => void;
  closeDialog: () => void;
  handleSubmit: (values: MenuCategoryFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const MenuCategoryView = ({
  rows,
  loading,
  saving,
  deleting,
  search,
  setSearch,
  dialogOpen,
  setDialogOpen,
  editingRow,
  deleteTarget,
  setDeleteTarget,
  successOpen,
  setSuccessOpen,
  successMessage,
  form,
  openCreate,
  openEdit,
  closeDialog,
  handleSubmit,
  confirmDelete,
  reload,
}: MenuCategoryViewProps) => {
  return (
    <ListPageFrame
      title="Menu Category"
      description="Organize food and beverage items into categories."
      toolbar={
        <MenuCategoryToolbar
          search={search}
          setSearch={setSearch}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} categor${rows.length === 1 ? "y" : "ies"}`}
        />
      }
      overlays={
        <>
          <MenuCategoryFormDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) closeDialog();
              else setDialogOpen(true);
            }}
            form={form}
            editingRow={editingRow}
            saving={saving}
            onSubmit={handleSubmit}
          />

          <MenuCategoryDeleteDialog
            open={Boolean(deleteTarget)}
            target={deleteTarget}
            deleting={deleting}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />

          <SuccessMessage
            open={successOpen}
            onClose={() => setSuccessOpen(false)}
            title="Saved"
            message={successMessage}
          />
        </>
      }
    >
      <MenuCategoryTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default MenuCategoryView;
