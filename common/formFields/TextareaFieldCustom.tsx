"use client";

import { useState, useEffect, useRef } from "react";
import { type FieldValues, type Control, type Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface TextareaFieldCustomProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  dataset: Array<{
    Id: number | string;
    Cust_Name?: string;
    Relation_Name?: string;
    Village?: string;
    [key: string]: unknown;
  }>;
  className?: string;
  disabled?: boolean;
  handleSelect: (id: number | string) => void;
  loading: boolean;
  loadMore: () => void;
}

/** Searchable suggestion field (same pattern as TextDropdownField). */
const TextareaFieldCustom = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Enter name",
  dataset,
  className,
  disabled = false,
  handleSelect,
  loading,
  loadMore,
}: TextareaFieldCustomProps<T>) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShowDropdown(dataset.length > 0);
  }, [dataset]);

  const handleScroll = () => {
    const el = dropdownRef.current;
    if (
      el &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 2 &&
      !loading
    ) {
      loadMore();
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="grow">
          <FormLabel
            className={cn(
              "text-base font-normal",
              fieldState?.error?.message && "text-destructive",
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="text"
                autoComplete="off"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={cn("h-10 w-full", className)}
              />
              {showDropdown ? (
                <div
                  ref={dropdownRef}
                  className={cn(
                    "absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md",
                    dataset.length > 4 ? "h-40 overflow-y-auto" : "max-h-40",
                  )}
                  onScroll={handleScroll}
                >
                  {dataset.map((option) => (
                    <button
                      type="button"
                      key={String(option.Id)}
                      onClick={() => {
                        handleSelect(option.Id);
                        setShowDropdown(false);
                      }}
                      className="block w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-muted"
                    >
                      {option.Cust_Name} - {option.Relation_Name} -{" "}
                      {option.Village}
                    </button>
                  ))}
                  {loading ? (
                    <div className="flex w-full items-center justify-center px-4 py-2">
                      <Spinner />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </FormControl>
          <FormMessage className="text-sm font-normal text-destructive" />
        </FormItem>
      )}
    />
  );
};

export default TextareaFieldCustom;
