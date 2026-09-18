"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import RoomDetailsToolbar from "./RoomDetailsToolbar";
import RoomDetailsTable from "./RoomDetailsTable";
import RoomDetailsFormDialog from "./RoomDetailsFormDialog";
import RoomDetailsDeleteDialog from "./RoomDetailsDeleteDialog";
import type { RoomDetail, RoomDetailFormValues } from "@/container/org/roomDetails/types";
import type { RoomType } from "@/container/org/roomType/types";

export type RoomDetailsViewProps = {
  rows: RoomDetail[];
  roomTypeOptions: RoomType[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  roomTypeFilter: number | string;
  setRoomTypeFilter: Dispatch<SetStateAction<number | string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingRow: RoomDetail | null;
  deleteTarget: RoomDetail | null;
  setDeleteTarget: Dispatch<SetStateAction<RoomDetail | null>>;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  form: UseFormReturn<RoomDetailFormValues>;
  openCreate: () => void;
  openEdit: (row: RoomDetail) => void;
  closeDialog: () => void;
  handleSubmit: (values: RoomDetailFormValues) => void | Promise<void>;
  confirmDelete: () => void | Promise<void>;
  reload: () => void;
};

const RoomDetailsView = ({
  rows,
  roomTypeOptions,
  loading,
  saving,
  deleting,
  search,
  setSearch,
  roomTypeFilter,
  setRoomTypeFilter,
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
}: RoomDetailsViewProps) => {
  return (
    <ListPageFrame
      title="Room Details"
      description="Configure individual rooms, occupancy, and booking availability."
      toolbar={
        <RoomDetailsToolbar
          search={search}
          setSearch={setSearch}
          roomTypeFilter={roomTypeFilter}
          setRoomTypeFilter={setRoomTypeFilter}
          roomTypeOptions={roomTypeOptions}
          onAdd={openCreate}
          onRefresh={reload}
          loading={loading}
          countLabel={`${rows.length} room${rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <RoomDetailsFormDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) closeDialog();
              else setDialogOpen(true);
            }}
            form={form}
            editingRow={editingRow}
            saving={saving}
            roomTypeOptions={roomTypeOptions}
            onSubmit={handleSubmit}
          />

          <RoomDetailsDeleteDialog
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
      <RoomDetailsTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />
    </ListPageFrame>
  );
};

export default RoomDetailsView;
