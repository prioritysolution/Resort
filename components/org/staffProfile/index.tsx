"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import StaffProfileToolbar from "@/components/org/staffProfile/StaffProfileToolbar";
import StaffProfileTable from "@/components/org/staffProfile/StaffProfileTable";
import StaffProfileFormDialog from "@/components/org/staffProfile/StaffProfileFormDialog";
import StaffProfileDeleteDialog from "@/components/org/staffProfile/StaffProfileDeleteDialog";
import type { StaffProfile, StaffProfileFormValues } from "@/container/org/staffProfile/types";

export type StaffProfileViewProps = {
  rows: StaffProfile[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: StaffProfile | null;
  deleteTarget: StaffProfile | null;
  setDeleteTarget: Dispatch<SetStateAction<StaffProfile | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<StaffProfileFormValues>;
  openCreate: () => void;
  openEdit: (row: StaffProfile) => void;
  closeDialog: () => void;
  handleSubmit: (values: StaffProfileFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const StaffProfileView = ({
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
}: StaffProfileViewProps) => {
  return (
    <ListPageFrame
      title="Staff Profile"
      description="Maintain employee details, designation, and employment status."
      toolbar={
        <StaffProfileToolbar
          search={search}
          setSearch={setSearch}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} staff`}
        />
      }
      overlays={
        <>
          <StaffProfileFormDialog
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

          <StaffProfileDeleteDialog
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
      <StaffProfileTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default StaffProfileView;
