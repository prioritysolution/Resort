"use client";

import { ListToolbar } from "@/components/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MenuCategory } from "@/container/org/menuCategory/types";

type MenuDetailsToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: number | string;
  setCategoryFilter: (value: number | string) => void;
  categoryOptions: MenuCategory[];
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const MenuDetailsToolbar = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: MenuDetailsToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search menu, category…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add item"
      countLabel={countLabel}
      filters={
        <Select
          value={categoryFilter === "" ? "all" : String(categoryFilter)}
          onValueChange={(value) =>
            setCategoryFilter(value === "all" ? "" : Number(value))
          }
        >
          <SelectTrigger className="h-10 w-full rounded-[0.625rem] sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem
                key={option.Category_Id}
                value={String(option.Category_Id)}
              >
                {option.Categ_Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
};

export default MenuDetailsToolbar;
