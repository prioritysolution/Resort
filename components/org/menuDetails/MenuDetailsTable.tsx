"use client";

import { Pencil, Trash2 } from "lucide-react";
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
import type { MenuDetail } from "@/container/org/menuDetails/types";

type MenuDetailsTableProps = {
  rows?: MenuDetail[];
  loading: boolean;
  onEdit: (row: MenuDetail) => void;
  onDelete: (row: MenuDetail) => void;
};

const MenuDetailsTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: MenuDetailsTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No menu items found"
        description="Add a menu item under a category to start building your F&B list."
      />
    );
  }

  return (
    <div className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[4rem] whitespace-nowrap">#</TableHead>
            <TableHead className="min-w-[5rem]">ID</TableHead>
            <TableHead className="min-w-[10rem]">Category</TableHead>
            <TableHead className="min-w-[6rem]">Code</TableHead>
            <TableHead className="min-w-[12rem]">Name</TableHead>
            <TableHead className="min-w-[8rem]">Short name</TableHead>
            <TableHead className="min-w-[10rem]">Description</TableHead>
            <TableHead className="min-w-[6rem] text-right">Rate</TableHead>
            <TableHead className="min-w-[6rem]">Status</TableHead>
            <TableHead className="min-w-[7rem] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const active = Number(row.Status) === 1;
            return (
              <TableRow key={row.Item_Id}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {row.Item_Id}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.Categ_Name}
                </TableCell>
                <TableCell className="tabular-nums">
                  {row.Menu_Code ?? "—"}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {row.Menu_Name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.Menu_ShortNm || "—"}
                </TableCell>
                <TableCell className="max-w-[14rem] truncate text-muted-foreground" title={row.Menu_Desc || undefined}>
                  {row.Menu_Desc || "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.Rate}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-md border-0 font-medium",
                      active
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary"
                      onClick={() => onEdit(row)}
                      aria-label={`Edit ${row.Menu_Name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(row)}
                      aria-label={`Delete ${row.Menu_Name}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuDetailsTable;
