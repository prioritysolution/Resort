"use client";

import type { ReactNode } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ListToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  addLabel?: string;
  /** Total rows label shown beside actions (e.g. "12 rooms") */
  countLabel?: string;
  /** Extra filters between search and actions (selects, etc.) */
  filters?: ReactNode;
  className?: string;
};

/**
 * Shared search + refresh + add row used on all list pages.
 */
export function ListToolbar({
  search,
  setSearch,
  searchPlaceholder = "Search…",
  onAdd,
  onRefresh,
  loading = false,
  addLabel = "Add",
  countLabel,
  filters,
  className,
}: ListToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs sm:shrink-0">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 rounded-[0.625rem] border-border bg-background pl-9"
            autoComplete="off"
          />
        </div>
        {filters ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {filters}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-row flex-nowrap items-center justify-end gap-2">
        {countLabel ? (
          <span className="mr-1 inline-flex h-10 items-center rounded-[0.625rem] border border-border bg-secondary/60 px-3 text-sm font-medium whitespace-nowrap text-foreground tabular-nums">
            {countLabel}
          </span>
        ) : null}
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 cursor-pointer rounded-[0.625rem]"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className="size-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        ) : null}
        {onAdd ? (
          <Button
            type="button"
            className="h-10 shrink-0 cursor-pointer rounded-[0.625rem] whitespace-nowrap"
            onClick={onAdd}
          >
            <Plus className="size-4" />
            {addLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ListToolbar;
