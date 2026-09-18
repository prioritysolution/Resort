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
import type { TravelAgent } from "@/container/org/travelAgent/types";

type TravelAgentTableProps = {
  rows?: TravelAgent[];
  loading: boolean;
  onEdit: (row: TravelAgent) => void;
  onDelete: (row: TravelAgent) => void;
};

const formatPercent = (value: string | number | null) => {
  if (value == null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return `${num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
};

const TravelAgentTable = ({
  rows = [],
  loading,
  onEdit,
  onDelete,
}: TravelAgentTableProps) => {
  if (loading) {
    return <PageLoader variant="section" label="Loading…" />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No travel agents found"
        description="Add a travel agent to track partners and commission rates."
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
            <TableHead className="min-w-[10rem]">Agent</TableHead>
            <TableHead className="min-w-[10rem]">Org</TableHead>
            <TableHead className="min-w-[10rem]">Address</TableHead>
            <TableHead className="min-w-[8rem]">Contact</TableHead>
            <TableHead className="min-w-[8rem]">GST</TableHead>
            <TableHead className="min-w-[7rem]">PAN</TableHead>
            <TableHead className="min-w-[6rem] text-right">Comm %</TableHead>
            <TableHead className="min-w-[6rem]">Status</TableHead>
            <TableHead className="min-w-[7rem] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const active = Number(row.Status) === 1;
            return (
              <TableRow key={row.Agent_Id}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {row.Agent_Id}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {row.Agent_Name}
                </TableCell>
                <TableCell>{row.Org_Name || "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.Address || "—"}
                </TableCell>
                <TableCell className="tabular-nums">
                  {row.Contact_No || "—"}
                </TableCell>
                <TableCell>{row.GST_No || "—"}</TableCell>
                <TableCell>{row.PAN_No || "—"}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPercent(row.Comm_Prcnt)}
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
                      aria-label={`Edit ${row.Agent_Name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(row)}
                      aria-label={`Delete ${row.Agent_Name}`}
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

export default TravelAgentTable;
