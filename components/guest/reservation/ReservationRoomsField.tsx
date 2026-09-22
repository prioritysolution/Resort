"use client";

import { useMemo, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { Check, ChevronsUpDown, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReservationRoomFormValues } from "@/container/guest/reservation/types";

type Option = { Id: number | string; Name: string };

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  formItemClassName?: string;
};

function toRooms(value: unknown): ReservationRoomFormValues[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const roomId = Number((row as ReservationRoomFormValues).room_id);
      const extra = Number((row as ReservationRoomFormValues).extra_bed_no);
      if (!Number.isFinite(roomId) || roomId <= 0) return null;
      return {
        room_id: roomId,
        extra_bed_no: Number.isFinite(extra) && extra >= 0 ? extra : 0,
      };
    })
    .filter((row): row is ReservationRoomFormValues => row != null);
}

export default function ReservationRoomsField<T extends FieldValues>({
  control,
  name,
  options,
  label = "Rooms",
  placeholder = "Select one or more rooms",
  disabled = false,
  isRequired = false,
  formItemClassName,
}: Props<T>) {
  const { field, fieldState } = useController({ control, name });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const rooms = toRooms(field.value);
  const selectedIds = rooms.map((r) => r.room_id);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) =>
      String(opt.Name ?? "")
        .toLowerCase()
        .includes(q),
    );
  }, [options, search]);

  const setRooms = (next: ReservationRoomFormValues[]) => {
    field.onChange(next);
  };

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      setRooms(rooms.filter((r) => r.room_id !== id));
      return;
    }
    setRooms([...rooms, { room_id: id, extra_bed_no: 0 }]);
  };

  const remove = (id: number) => {
    setRooms(rooms.filter((r) => r.room_id !== id));
  };

  const setExtraBed = (id: number, value: number) => {
    const next = Math.max(0, Math.floor(value));
    setRooms(
      rooms.map((r) =>
        r.room_id === id ? { ...r, extra_bed_no: next } : r,
      ),
    );
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", formItemClassName)}>
      {label ? (
        <label className="text-sm font-medium text-foreground">
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "h-auto min-h-10 w-full cursor-pointer justify-between px-3 py-2 font-normal",
                fieldState.error &&
                  "border-destructive focus-visible:ring-destructive/30",
              )}
            />
          }
        >
          <span
            className={cn(
              "truncate text-left",
              rooms.length === 0 && "text-muted-foreground",
            )}
          >
            {rooms.length === 0
              ? placeholder
              : `${rooms.length} room${rooms.length > 1 ? "s" : ""} selected`}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="min-w-60 p-0 sm:w-[320px]" align="start">
          <div className="border-b p-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms…"
              className="h-9 w-full rounded-[0.625rem] border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <ScrollArea className="h-56">
            <div className="p-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No rooms found
                </p>
              ) : (
                filtered.map((opt) => {
                  const id = Number(opt.Id);
                  const checked = selectedIds.includes(id);
                  return (
                    <button
                      key={String(opt.Id)}
                      type="button"
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2 rounded-[0.625rem] px-3 py-2 text-left text-sm hover:bg-muted",
                        checked && "bg-primary/5 text-primary",
                      )}
                      onClick={() => toggle(id)}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input",
                          checked &&
                            "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {checked ? <Check className="size-3" /> : null}
                      </span>
                      <span className="truncate">{String(opt.Name)}</span>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {rooms.length > 0 ? (
        <div className="space-y-2 rounded-[0.625rem] border border-border bg-chrome p-3">
          <p className="text-xs text-muted-foreground">
            Set extra beds for each selected room.
          </p>
          <div className="space-y-2">
            {rooms.map((row) => {
              const opt = options.find((o) => Number(o.Id) === row.room_id);
              const title = opt ? String(opt.Name) : `Room #${row.room_id}`;
              return (
                <div
                  key={row.room_id}
                  className="flex flex-col gap-2 rounded-[0.625rem] border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Room ID: {row.room_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Extra beds
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={disabled || row.extra_bed_no <= 0}
                        onClick={() =>
                          setExtraBed(row.room_id, row.extra_bed_no - 1)
                        }
                        aria-label="Decrease extra beds"
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        value={row.extra_bed_no}
                        disabled={disabled}
                        className="h-8 w-14 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        onChange={(e) =>
                          setExtraBed(row.room_id, Number(e.target.value) || 0)
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={disabled}
                        onClick={() =>
                          setExtraBed(row.room_id, row.extra_bed_no + 1)
                        }
                        aria-label="Increase extra beds"
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled}
                      onClick={() => remove(row.room_id)}
                      aria-label={`Remove ${title}`}
                    >
                      <X className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {fieldState.error?.message ? (
        <p className="text-[0.8rem] font-medium text-destructive">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  );
}
