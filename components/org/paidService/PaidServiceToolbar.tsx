"use client";

import { ListToolbar } from "@/components/shared";

type PaidServiceToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const PaidServiceToolbar = ({
  search,
  setSearch,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: PaidServiceToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search paid service…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add service"
      countLabel={countLabel}
    />
  );
};

export default PaidServiceToolbar;
