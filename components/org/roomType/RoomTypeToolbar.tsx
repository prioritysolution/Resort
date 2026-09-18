"use client";

import { ListToolbar } from "@/components/shared";

type RoomTypeToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const RoomTypeToolbar = ({
  search,
  setSearch,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: RoomTypeToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search room type…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add room type"
      countLabel={countLabel}
    />
  );
};

export default RoomTypeToolbar;
