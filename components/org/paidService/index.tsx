"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import PaidServiceToolbar from "@/components/org/paidService/PaidServiceToolbar";
import PaidServiceTable from "@/components/org/paidService/PaidServiceTable";
import PaidServiceFormDialog from "@/components/org/paidService/PaidServiceFormDialog";
import PaidServiceDeleteDialog from "@/components/org/paidService/PaidServiceDeleteDialog";
import type { PaidService, PaidServiceFormValues } from "@/container/org/paidService/types";

export type PaidServiceViewProps = {
  rows: PaidService[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: PaidService | null;
  deleteTarget: PaidService | null;
  setDeleteTarget: Dispatch<SetStateAction<PaidService | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<PaidServiceFormValues>;
  openCreate: () => void;
  openEdit: (row: PaidService) => void;
  closeDialog: () => void;
  handleSubmit: (values: PaidServiceFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const PaidServiceView = ({
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
}: PaidServiceViewProps) => {
  return (
    <ListPageFrame
      title="Paid Service"
      description="Manage billable extras such as transfers, corkage, and charging."
      toolbar={
        <PaidServiceToolbar
          search={search}
          setSearch={setSearch}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} service${rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <PaidServiceFormDialog
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

          <PaidServiceDeleteDialog
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
      <PaidServiceTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default PaidServiceView;
