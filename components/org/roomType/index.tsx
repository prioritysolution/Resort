"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import RoomTypeToolbar from "@/components/org/roomType/RoomTypeToolbar";
import RoomTypeTable from "@/components/org/roomType/RoomTypeTable";
import RoomTypeFormDialog from "@/components/org/roomType/RoomTypeFormDialog";
import RoomTypeDeleteDialog from "@/components/org/roomType/RoomTypeDeleteDialog";
import type { RoomType, RoomTypeFormValues } from "@/container/org/roomType/types";

export type RoomTypeViewProps = {
  rows: RoomType[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: RoomType | null;
  deleteTarget: RoomType | null;
  setDeleteTarget: Dispatch<SetStateAction<RoomType | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<RoomTypeFormValues>;
  openCreate: () => void;
  openEdit: (row: RoomType) => void;
  closeDialog: () => void;
  handleSubmit: (values: RoomTypeFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const RoomTypeView = ({
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
}: RoomTypeViewProps) => {
  return (
    <ListPageFrame
      title="Room Type"
      description="Define room categories, base charges, and extra bed rates."
      toolbar={
        <RoomTypeToolbar
          search={search}
          setSearch={setSearch}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} type${rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <RoomTypeFormDialog
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

          <RoomTypeDeleteDialog
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
      <RoomTypeTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default RoomTypeView;
