"use client";

import { ListToolbar } from "@/components/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoomType } from "@/container/org/roomType/types";

type PriceManagerToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  roomTypeFilter: number | string;
  setRoomTypeFilter: (value: number | string) => void;
  roomTypeOptions: RoomType[];
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  addLabel: string;
  searchPlaceholder: string;
  countLabel?: string;
};

const PriceManagerToolbar = ({
  search,
  setSearch,
  roomTypeFilter,
  setRoomTypeFilter,
  roomTypeOptions,
  onAdd,
  onRefresh,
  loading,
  addLabel,
  searchPlaceholder,
  countLabel,
}: PriceManagerToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder={searchPlaceholder}
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel={addLabel}
      countLabel={countLabel}
      filters={
        <Select
          value={roomTypeFilter === "" ? "all" : String(roomTypeFilter)}
          onValueChange={(value) =>
            setRoomTypeFilter(value === "all" ? "" : Number(value))
          }
        >
          <SelectTrigger className="h-10 w-full rounded-[0.625rem] sm:w-48">
            <SelectValue placeholder="All room types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All room types</SelectItem>
            {roomTypeOptions.map((option) => (
              <SelectItem key={option.Room_TId} value={String(option.Room_TId)}>
                {option.Room_TName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
};

export default PriceManagerToolbar;
