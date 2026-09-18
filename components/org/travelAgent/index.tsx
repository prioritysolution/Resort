"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import TravelAgentToolbar from "@/components/org/travelAgent/TravelAgentToolbar";
import TravelAgentTable from "@/components/org/travelAgent/TravelAgentTable";
import TravelAgentFormDialog from "@/components/org/travelAgent/TravelAgentFormDialog";
import TravelAgentDeleteDialog from "@/components/org/travelAgent/TravelAgentDeleteDialog";
import type { TravelAgent, TravelAgentFormValues } from "@/container/org/travelAgent/types";

export type TravelAgentViewProps = {
  rows: TravelAgent[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: TravelAgent | null;
  deleteTarget: TravelAgent | null;
  setDeleteTarget: Dispatch<SetStateAction<TravelAgent | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<TravelAgentFormValues>;
  openCreate: () => void;
  openEdit: (row: TravelAgent) => void;
  closeDialog: () => void;
  handleSubmit: (values: TravelAgentFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const TravelAgentView = ({
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
}: TravelAgentViewProps) => {
  return (
    <ListPageFrame
      title="Travel Agent"
      description="Manage partner agents, contacts, and commission rates."
      toolbar={
        <TravelAgentToolbar
          search={search}
          setSearch={setSearch}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} agent${rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <TravelAgentFormDialog
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

          <TravelAgentDeleteDialog
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
      <TravelAgentTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default TravelAgentView;
