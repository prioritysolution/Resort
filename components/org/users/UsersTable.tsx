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
import type { AppUser } from "@/container/org/users/types";

type UsersTableProps = {
  rows?: AppUser[];
  loading: boolean;
  onEdit: (row: AppUser) => void;
  onDelete: (row: AppUser) => void;
};

const UsersTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: UsersTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No users found"
        description="Add a user to grant access for this organisation and branch."
      />
    );
  }

  return (
    <div className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[4rem] whitespace-nowrap">#</TableHead>
            {/* <TableHead className="min-w-[5rem]">ID</TableHead> */}
            <TableHead className="min-w-[12rem]">Name</TableHead>
            <TableHead className="min-w-[8rem]">Short name</TableHead>
            <TableHead className="min-w-[6rem]">Code</TableHead>
            <TableHead className="min-w-[10rem]">Branch</TableHead>
            <TableHead className="min-w-[10rem]">Resort</TableHead>
            <TableHead className="min-w-[6rem]">Active</TableHead>
            <TableHead className="min-w-[6rem]">Status</TableHead>
            <TableHead className="min-w-[7rem] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const active = Number(row.Is_Active) === 1;
            return (
              <TableRow key={row.User_Id}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                {/* <TableCell className="tabular-nums text-muted-foreground">
                  {row.User_Id}
                </TableCell> */}
                <TableCell className="font-medium text-foreground">
                  {row.User_Name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.Short_Name}
                </TableCell>
                <TableCell className="tabular-nums">{row.User_Code}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.Branch_Name || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.Resort_Name || "—"}
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
                <TableCell className="text-muted-foreground">
                  {row.Status || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary"
                      onClick={() => onEdit(row)}
                      aria-label={`Edit ${row.User_Name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(row)}
                      aria-label={`Delete ${row.User_Name}`}
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

export default UsersTable;
