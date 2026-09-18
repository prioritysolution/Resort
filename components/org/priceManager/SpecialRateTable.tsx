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
import type { SpecialRate } from "@/container/org/priceManager/types";

type SpecialRateTableProps = {
  rows?: SpecialRate[];
  loading: boolean;
  onEdit: (row: SpecialRate) => void;
  onDelete: (row: SpecialRate) => void;
};

const formatMoney = (value: string | number) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const SpecialRateTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: SpecialRateTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No special rates found"
        description="Add event-based rates for seasonal or festival pricing."
      />
    );
  }

  return (
    <div className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[4rem]">#</TableHead>
            <TableHead className="min-w-[10rem]">Room type</TableHead>
            <TableHead className="min-w-[10rem]">Event</TableHead>
            <TableHead className="min-w-[7rem]">From</TableHead>
            <TableHead className="min-w-[7rem]">Upto</TableHead>
            <TableHead className="min-w-[7rem] text-right">Rate</TableHead>
            <TableHead className="min-w-[6rem]">Status</TableHead>
            <TableHead className="min-w-[7rem] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const active = Number(row.Status) === 1;
            return (
              <TableRow key={row.Rate_Id_Spl}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {row.Room_TName}
                </TableCell>
                <TableCell>{row.Event_Name}</TableCell>
                <TableCell>{row.Date_From || "—"}</TableCell>
                <TableCell>{row.Date_Upto || "—"}</TableCell>
                <TableCell className="text-right tabular-nums">
                  ₹ {formatMoney(row.Rate_Spl)}
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
                      aria-label={`Edit ${row.Event_Name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(row)}
                      aria-label={`Delete ${row.Event_Name}`}
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

export default SpecialRateTable;
