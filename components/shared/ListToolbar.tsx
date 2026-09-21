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
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full min-w-0 sm:max-w-xs sm:flex-1 md:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-[0.625rem] border-border bg-background pl-9"
            autoComplete="off"
          />
        </div>
        {filters ? (
          <div className="flex w-full min-w-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            {filters}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-row flex-wrap items-center justify-end gap-2">
        {countLabel ? (
          <span className="inline-flex h-9 items-center rounded-[0.625rem] border border-border bg-secondary/60 px-2.5 text-xs font-medium whitespace-nowrap text-foreground tabular-nums sm:h-10 sm:px-3 sm:text-sm">
            {countLabel}
          </span>
        ) : null}
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            className="h-9 shrink-0 cursor-pointer rounded-[0.625rem] sm:h-10"
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
            className="h-9 shrink-0 cursor-pointer rounded-[0.625rem] whitespace-nowrap sm:h-10"
            onClick={onAdd}
          >
            <Plus className="size-4" />
            <span className="max-[360px]:sr-only">{addLabel}</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ListToolbar;
