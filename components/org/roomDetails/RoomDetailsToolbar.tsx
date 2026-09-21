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

type RoomDetailsToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  roomTypeFilter: number | string;
  setRoomTypeFilter: (value: number | string) => void;
  roomTypeOptions: RoomType[];
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const RoomDetailsToolbar = ({
  search,
  setSearch,
  roomTypeFilter,
  setRoomTypeFilter,
  roomTypeOptions,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: RoomDetailsToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search room no, type…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add room"
      countLabel={countLabel}
      filters={
        <Select
          value={roomTypeFilter === "" ? "all" : String(roomTypeFilter)}
          onValueChange={(value) =>
            setRoomTypeFilter(value === "all" ? "" : Number(value))
          }
        >
          <SelectTrigger className="h-10 w-full min-w-0 rounded-[0.625rem] sm:w-44 md:w-52">
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

export default RoomDetailsToolbar;
