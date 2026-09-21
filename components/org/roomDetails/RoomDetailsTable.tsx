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
import type { RoomDetail } from "@/container/org/roomDetails/types";

type RoomDetailsTableProps = {
  rows?: RoomDetail[];
  loading: boolean;
  onEdit: (row: RoomDetail) => void;
  onDelete: (row: RoomDetail) => void;
};

const RoomDetailsTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: RoomDetailsTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No rooms found"
        description="Add a room to start assigning numbers and occupancy limits."
      />
    );
  }

  return (
    <Table className="min-w-[52rem]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="sticky left-0 z-10 w-12 bg-card whitespace-nowrap">
            #
          </TableHead>
          <TableHead className="min-w-[9rem]">Room type</TableHead>
          <TableHead className="min-w-[5rem]">Room no</TableHead>
          <TableHead className="min-w-[8rem]">Description</TableHead>
          <TableHead className="min-w-[4.5rem] text-right">Adult</TableHead>
          <TableHead className="min-w-[4.5rem] text-right">Child</TableHead>
          <TableHead className="min-w-[6.5rem]">Booking</TableHead>
          <TableHead className="min-w-[5.5rem]">Status</TableHead>
          <TableHead className="sticky right-0 z-10 min-w-[6.5rem] bg-card text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => {
          const active = Number(row.Status) === 1;
          const bookingAllowed = Number(row.Booking_Allowed) === 1;
          return (
            <TableRow key={row.Room_Id}>
              <TableCell className="sticky left-0 z-10 bg-card text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {row.Room_TName}
              </TableCell>
              <TableCell className="tabular-nums">{row.Room_No}</TableCell>
              <TableCell className="max-w-[12rem] truncate text-muted-foreground">
                {row.Room_Desc || "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.Adult}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.Child}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-md border-0 font-medium",
                    bookingAllowed
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {bookingAllowed ? "Allowed" : "Blocked"}
                </Badge>
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
              <TableCell className="sticky right-0 z-10 bg-card text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={() => onEdit(row)}
                    aria-label={`Edit room ${row.Room_No}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(row)}
                    aria-label={`Delete room ${row.Room_No}`}
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
  );
};

export default RoomDetailsTable;
