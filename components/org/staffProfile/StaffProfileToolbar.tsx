"use client";

import { ListToolbar } from "@/components/shared";

type StaffProfileToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const StaffProfileToolbar = ({
  search,
  setSearch,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: StaffProfileToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search name, designation…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add staff"
      countLabel={countLabel}
    />
  );
};

export default StaffProfileToolbar;
