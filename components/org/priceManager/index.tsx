"use client";

import type { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { ListPageFrame } from "@/components/shared";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { Button } from "@/components/ui/button";
import PriceManagerToolbar from "@/components/org/priceManager/PriceManagerToolbar";
import RegularRateTable from "@/components/org/priceManager/RegularRateTable";
import SpecialRateTable from "@/components/org/priceManager/SpecialRateTable";
import RegularRateFormDialog from "@/components/org/priceManager/RegularRateFormDialog";
import SpecialRateFormDialog from "@/components/org/priceManager/SpecialRateFormDialog";
import RegularRateDeleteDialog from "@/components/org/priceManager/RegularRateDeleteDialog";
import SpecialRateDeleteDialog from "@/components/org/priceManager/SpecialRateDeleteDialog";
import type {
  PriceManagerTab,
  useRegularRates,
  useSpecialRates,
} from "@/container/org/priceManager/Hooks";
import type { RoomType } from "@/container/org/roomType/types";

type RegularHook = ReturnType<typeof useRegularRates>;
type SpecialHook = ReturnType<typeof useSpecialRates>;

export type PriceManagerViewProps = {
  activeTab: PriceManagerTab;
  setActiveTab: Dispatch<SetStateAction<PriceManagerTab>>;
  roomTypeOptions: RoomType[];
  regular: RegularHook;
  special: SpecialHook;
};

const PriceManagerView = ({
  activeTab,
  setActiveTab,
  roomTypeOptions,
  regular,
  special,
}: PriceManagerViewProps) => {
  const isRegular = activeTab === "regular";
  const active = isRegular ? regular : special;

  return (
    <ListPageFrame
      title="Price Manager"
      description="Configure weekday regular rates and special event pricing by room type."
      beforeSection={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={isRegular ? "default" : "outline"}
            className={cn(
              "h-10 cursor-pointer rounded-[0.625rem]",
              !isRegular && "bg-background",
            )}
            onClick={() => setActiveTab("regular")}
          >
            Regular rates
          </Button>
          <Button
            type="button"
            variant={!isRegular ? "default" : "outline"}
            className={cn(
              "h-10 cursor-pointer rounded-[0.625rem]",
              isRegular && "bg-background",
            )}
            onClick={() => setActiveTab("special")}
          >
            Special rates
          </Button>
        </div>
      }
      toolbar={
        <PriceManagerToolbar
          search={active.search}
          setSearch={active.setSearch}
          roomTypeFilter={active.roomTypeFilter}
          setRoomTypeFilter={active.setRoomTypeFilter}
          roomTypeOptions={roomTypeOptions}
          onAdd={active.openCreate}
          onRefresh={active.reload}
          loading={active.loading}
          addLabel={isRegular ? "Add regular rate" : "Add special rate"}
          searchPlaceholder={
            isRegular
              ? "Search room type…"
              : "Search event or room type…"
          }
          countLabel={`${active.rows.length} rate${active.rows.length === 1 ? "" : "s"}`}
        />
      }
      overlays={
        <>
          <RegularRateFormDialog
            open={regular.dialogOpen}
            onOpenChange={(open) => {
              if (!open) regular.closeDialog();
              else regular.setDialogOpen(true);
            }}
            form={regular.form}
            editingRow={regular.editingRow}
            saving={regular.saving}
            roomTypeOptions={roomTypeOptions}
            onSubmit={regular.handleSubmit}
          />

          <SpecialRateFormDialog
            open={special.dialogOpen}
            onOpenChange={(open) => {
              if (!open) special.closeDialog();
              else special.setDialogOpen(true);
            }}
            form={special.form}
            editingRow={special.editingRow}
            saving={special.saving}
            roomTypeOptions={roomTypeOptions}
            onSubmit={special.handleSubmit}
          />

          <RegularRateDeleteDialog
            open={Boolean(regular.deleteTarget)}
            target={regular.deleteTarget}
            deleting={regular.deleting}
            onCancel={() => regular.setDeleteTarget(null)}
            onConfirm={regular.confirmDelete}
          />

          <SpecialRateDeleteDialog
            open={Boolean(special.deleteTarget)}
            target={special.deleteTarget}
            deleting={special.deleting}
            onCancel={() => special.setDeleteTarget(null)}
            onConfirm={special.confirmDelete}
          />

          <SuccessMessage
            open={regular.successOpen}
            onClose={() => regular.setSuccessOpen(false)}
            title="Saved"
            message={regular.successMessage}
          />

          <SuccessMessage
            open={special.successOpen}
            onClose={() => special.setSuccessOpen(false)}
            title="Saved"
            message={special.successMessage}
          />
        </>
      }
    >
      {isRegular ? (
        <RegularRateTable
          rows={regular.rows}
          loading={regular.loading}
          onEdit={regular.openEdit}
          onDelete={regular.setDeleteTarget}
        />
      ) : (
        <SpecialRateTable
          rows={special.rows}
          loading={special.loading}
          onEdit={special.openEdit}
          onDelete={special.setDeleteTarget}
        />
      )}
    </ListPageFrame>
  );
};

export default PriceManagerView;
