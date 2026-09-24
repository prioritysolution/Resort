"use client";

import { CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, PageLoader } from "@/components/shared";
import { cn } from "@/lib/utils";

export type GuestColumn<T> = {
  label: string;
  value: (row: T) => unknown;
  className?: string;
};

type Props<T extends object> = {
  rows?: T[];
  loading: boolean;
  columns: GuestColumn<T>[];
  rowKey: (row: T, index: number) => string | number;
  emptyTitle: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  deleteLabel?: string;
  onSecondary?: (row: T) => void;
  secondaryLabel?: string;
  secondaryDisabled?: (row: T) => boolean;
};

const display = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

export default function GuestTable<T extends object>({
  rows = [],
  loading,
  columns,
  rowKey,
  emptyTitle,
  onEdit,
  onDelete,
  deleteLabel = "Delete",
  onSecondary,
  secondaryLabel = "Complete",
  secondaryDisabled,
}: Props<T>) {
  const hasActions = Boolean(onEdit || onDelete || onSecondary);

  if (loading) return <PageLoader variant="section" label="Loading…" />;
  if (!rows.length)
    return (
      <EmptyState
        title={emptyTitle}
        description="Use the action above to add the first record."
      />
    );
  return (
    <div className="w-full min-w-0">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 px-3">#</TableHead>
            {columns.map((column) => (
              <TableHead
                key={column.label}
                className={cn("px-3", column.className)}
              >
                {column.label}
              </TableHead>
            ))}
            {hasActions ? (
              <TableHead className="px-3 text-right">Actions</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={rowKey(row, index)}>
              <TableCell className="px-3 py-3 text-muted-foreground">
                {index + 1}
              </TableCell>
              {columns.map((column) => {
                const value = column.value(row);
                const status = column.label.toLowerCase() === "status";
                return (
                  <TableCell
                    key={column.label}
                    className={cn("px-3 py-3 whitespace-normal", column.className)}
                  >
                    {status ? (
                      <Badge variant="secondary">{display(value)}</Badge>
                    ) : (
                      display(value)
                    )}
                  </TableCell>
                );
              })}
              {hasActions ? (
                <TableCell className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {onSecondary && !secondaryDisabled?.(row) ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onSecondary(row)}
                      >
                        <CheckCircle2 className="size-4" />
                        {secondaryLabel}
                      </Button>
                    ) : null}
                    {onEdit ? (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-primary"
                        onClick={() => onEdit(row)}
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => onDelete(row)}
                        aria-label={deleteLabel}
                      >
                        {deleteLabel === "Cancel" ? (
                          <XCircle className="size-4" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
