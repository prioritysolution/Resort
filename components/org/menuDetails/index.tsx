"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import MenuDetailsToolbar from "@/components/org/menuDetails/MenuDetailsToolbar";
import MenuDetailsTable from "@/components/org/menuDetails/MenuDetailsTable";
import MenuDetailsFormDialog from "@/components/org/menuDetails/MenuDetailsFormDialog";
import MenuDetailsDeleteDialog from "@/components/org/menuDetails/MenuDetailsDeleteDialog";
import type { MenuCategory } from "@/container/org/menuCategory/types";
import type { MenuDetail, MenuDetailFormValues } from "@/container/org/menuDetails/types";

export type MenuDetailsViewProps = {
  rows: MenuDetail[];
  categoryOptions: MenuCategory[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  categoryFilter: number | string;
  setCategoryFilter: Dispatch<SetStateAction<number | string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: MenuDetail | null;
  deleteTarget: MenuDetail | null;
  setDeleteTarget: Dispatch<SetStateAction<MenuDetail | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<MenuDetailFormValues>;
  openCreate: () => void;
  openEdit: (row: MenuDetail) => void;
  closeDialog: () => void;
  handleSubmit: (values: MenuDetailFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const MenuDetailsView = ({
  rows,
  categoryOptions,
  loading,
  saving,
  deleting,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
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
}: MenuDetailsViewProps) => {
  return (
    <ListPageFrame
      title="Menu Details"
      description="Manage food and beverage menu items by category."
      toolbar={
        <MenuDetailsToolbar
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categoryOptions={categoryOptions}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} item${rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <MenuDetailsFormDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) closeDialog();
              else setDialogOpen(true);
            }}
            form={form}
            editingRow={editingRow}
            saving={saving}
            categoryOptions={categoryOptions}
            onSubmit={handleSubmit}
          />

          <MenuDetailsDeleteDialog
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
      <MenuDetailsTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default MenuDetailsView;
