"use client";

import { ListToolbar } from "@/components/shared";

type MenuCategoryToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const MenuCategoryToolbar = ({
  search,
  setSearch,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: MenuCategoryToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search category…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add category"
      countLabel={countLabel}
    />
  );
};

export default MenuCategoryToolbar;
