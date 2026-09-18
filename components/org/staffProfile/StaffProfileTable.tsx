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
import type { StaffProfile } from "@/container/org/staffProfile/types";

type StaffProfileTableProps = {
  rows?: StaffProfile[];
  loading: boolean;
  onEdit: (row: StaffProfile) => void;
  onDelete: (row: StaffProfile) => void;
};

const genderLabel = (code: number) => {
  if (Number(code) === 1) return "Male";
  if (Number(code) === 2) return "Female";
  if (Number(code) === 3) return "Others";
  return "—";
};

const formatMoney = (value: string | number | null) => {
  if (value === "" || value == null) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const StaffProfileTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: StaffProfileTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No staff profiles found"
        description="Add a staff member to keep employment records here."
      />
    );
  }

  return (
    <div className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[4rem] whitespace-nowrap">#</TableHead>
            <TableHead className="min-w-[10rem]">Name</TableHead>
            <TableHead className="min-w-[8rem]">Designation</TableHead>
            <TableHead className="min-w-[8rem]">Contact</TableHead>
            <TableHead className="min-w-[6rem]">Gender</TableHead>
            <TableHead className="min-w-[7rem]">Join date</TableHead>
            <TableHead className="min-w-[7rem] text-right">Salary</TableHead>
            <TableHead className="min-w-[6rem]">Status</TableHead>
            <TableHead className="min-w-[7rem] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const active = Number(row.Status) === 1;
            return (
              <TableRow key={row.Staff_Id}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <div className="flex flex-col">
                    <span>{row.Staff_Name}</span>
                    {row.Nick_Name ? (
                      <span className="text-xs text-muted-foreground">
                        {row.Nick_Name}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{row.Designation || "—"}</TableCell>
                <TableCell>{row.Cont_No || "—"}</TableCell>
                <TableCell>{genderLabel(row.Gender_Cd)}</TableCell>
                <TableCell>{row.Join_Date || "—"}</TableCell>
                <TableCell className="text-right tabular-nums">
                  ₹ {formatMoney(row.Salary)}
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
                      aria-label={`Edit ${row.Staff_Name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(row)}
                      aria-label={`Delete ${row.Staff_Name}`}
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

export default StaffProfileTable;
