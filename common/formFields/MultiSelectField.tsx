"use client";

import { useMemo, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

type Option = { Id: string | number; Name: string; [key: string]: unknown };

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  formItemClassName?: string;
};

function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export default function MultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select options",
  disabled = false,
  isRequired = false,
  formItemClassName,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = toNumberArray(field.value);
        const q = search.trim().toLowerCase();
        const filtered = !q
          ? options
          : options.filter((opt) =>
              String(opt.Name ?? "")
                .toLowerCase()
                .includes(q),
            );
        const selectedLabels = selected.map((id) => {
          const opt = options.find((o) => Number(o.Id) === id);
          return { id, label: opt ? String(opt.Name) : String(id) };
        });

        const toggle = (id: number) => {
          const next = selected.includes(id)
            ? selected.filter((x) => x !== id)
            : [...selected, id];
          field.onChange(next);
        };

        const remove = (id: number) => {
          field.onChange(selected.filter((x) => x !== id));
        };

        return (
          <FormItem
            className={cn("flex w-full flex-col gap-1.5", formItemClassName)}
          >
            {label ? (
              <FormLabel className="text-sm font-medium text-foreground">
                {label}
                {isRequired ? (
                  <span className="ml-1 text-red-500">*</span>
                ) : null}
              </FormLabel>
            ) : null}
            <FormControl>
              <div className="space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                          "h-auto min-h-10 w-full justify-between px-3 py-2 font-normal",
                          fieldState.error &&
                            "border-destructive focus-visible:ring-destructive/30",
                        )}
                      />
                    }
                  >
                    <span
                      className={cn(
                        "truncate text-left",
                        selected.length === 0 && "text-muted-foreground",
                      )}
                    >
                      {selected.length === 0
                        ? placeholder
                        : `${selected.length} room${selected.length > 1 ? "s" : ""} selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="min-w-[240px] p-0 sm:w-[320px]"
                    align="start"
                  >
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
                            const checked = selected.includes(id);
                            return (
                              <button
                                key={String(opt.Id)}
                                type="button"
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-[0.625rem] px-3 py-2 text-left text-sm hover:bg-muted",
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
                                  {checked ? (
                                    <Check className="size-3" />
                                  ) : null}
                                </span>
                                <span className="truncate">
                                  {String(opt.Name)}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>

                {selectedLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLabels.map((item) => (
                      <Badge
                        key={item.id}
                        variant="secondary"
                        className="h-auto gap-1 rounded-[0.625rem] px-2 py-1 font-normal"
                      >
                        <span className="max-w-[160px] truncate">
                          {item.label}
                        </span>
                        <button
                          type="button"
                          className="rounded-full p-0.5 hover:bg-muted"
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${item.label}`}
                        >
                          <X className="size-3 opacity-70" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
