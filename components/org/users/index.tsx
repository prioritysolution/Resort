"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import UsersToolbar from "@/components/org/users/UsersToolbar";
import UsersTable from "@/components/org/users/UsersTable";
import UsersFormDialog from "@/components/org/users/UsersFormDialog";
import UsersDeleteDialog from "@/components/org/users/UsersDeleteDialog";
import type { AppUser, AppUserFormValues } from "@/container/org/users/types";

export type UsersViewProps = {
  rows: AppUser[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: AppUser | null;
  deleteTarget: AppUser | null;
  setDeleteTarget: Dispatch<SetStateAction<AppUser | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<AppUserFormValues>;
  openCreate: () => void;
  openEdit: (row: AppUser) => void;
  closeDialog: () => void;
  handleSubmit: (values: AppUserFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const UsersView = ({
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
}: UsersViewProps) => {
  return (
    <ListPageFrame
      title="Users"
      description="Manage organisation users, codes, and access status."
      toolbar={
        <UsersToolbar
          search={search}
          setSearch={setSearch}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} user${rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <UsersFormDialog
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

          <UsersDeleteDialog
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
      <UsersTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default UsersView;
