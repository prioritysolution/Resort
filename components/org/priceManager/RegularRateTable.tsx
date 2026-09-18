"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, PageLoader } from "@/components/shared";
import type { RegularRate } from "@/container/org/priceManager/types";

type RegularRateTableProps = {
  rows?: RegularRate[];
  loading: boolean;
  onEdit: (row: RegularRate) => void;
  onDelete: (row: RegularRate) => void;
};

const formatMoney = (value: string | number) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const RegularRateTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: RegularRateTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No regular rates found"
        description="Add weekday rates for each room type."
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
            <TableHead className="min-w-[5rem] text-right">Mon</TableHead>
            <TableHead className="min-w-[5rem] text-right">Tue</TableHead>
            <TableHead className="min-w-[5rem] text-right">Wed</TableHead>
            <TableHead className="min-w-[5rem] text-right">Thu</TableHead>
            <TableHead className="min-w-[5rem] text-right">Fri</TableHead>
            <TableHead className="min-w-[5rem] text-right">Sat</TableHead>
            <TableHead className="min-w-[5rem] text-right">Sun</TableHead>
            <TableHead className="min-w-[7rem] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.Rate_Id_Reg}>
              <TableCell className="text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {row.Room_TName}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Mon)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Tue)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Wed)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Thu)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Fri)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Sat)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.Rate_Sun)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={() => onEdit(row)}
                    aria-label={`Edit rates for ${row.Room_TName}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(row)}
                    aria-label={`Delete rates for ${row.Room_TName}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegularRateTable;
