"use client";

import * as React from "react";
import { CalendarDays, X } from "lucide-react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { disabledFieldClass } from "@/common/formFields/disabledField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
] as const;

const YEAR_SPAN = 12;

const normalizeMonth = (value: unknown): string => {
  if (value == null || value === "") return "";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{1,2})$/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return "";
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
};

const displayMonth = (value: string) => {
  const normalized = normalizeMonth(value);
  if (!normalized) return "";
  const [year, month] = normalized.split("-");
  const label = MONTHS.find((m) => m.value === month)?.label || month;
  return `${label} ${year}`;
};

interface MonthPickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  isRequired?: boolean;
  /** When true: type YYYY-MM manually and/or open picker. */
  isManualInput?: boolean;
  onChange?: (month: string | null) => void;
  rules?: RegisterOptions<T, Path<T>>;
}

export function MonthPicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select month",
  disabled = false,
  className,
  allowClear = true,
  isRequired = false,
  isManualInput = false,
  onChange,
  rules,
}: MonthPickerProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: isRequired ? "This field is required" : false,
      ...rules,
    },
  });

  const monthValue = normalizeMonth(field.value);
  const now = new Date();
  const selectedYear = monthValue
    ? Number(monthValue.slice(0, 4))
    : now.getFullYear();
  const selectedMonth = monthValue
    ? monthValue.slice(5, 7)
    : String(now.getMonth() + 1).padStart(2, "0");

  const years = React.useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: YEAR_SPAN }, (_, i) =>
      String(current - (YEAR_SPAN - 1 - i)),
    );
  }, []);

  React.useEffect(() => {
    setInputValue(monthValue);
  }, [monthValue]);

  const applyMonth = (year: string, month: string) => {
    const next = `${year}-${month}`;
    field.onChange(next);
    onChange?.(next);
    setInputValue(next);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange("");
    onChange?.(null);
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 4);
      if (digits.length >= 5) {
        formatted += `-${digits.slice(4, 6)}`;
      }
    }
    setInputValue(formatted);

    if (formatted.length === 7) {
      const normalized = normalizeMonth(formatted);
      if (normalized) {
        field.onChange(normalized);
        onChange?.(normalized);
      }
    } else if (!formatted) {
      field.onChange("");
      onChange?.(null);
    }
  };

  const handleInputBlur = () => {
    const normalized = normalizeMonth(inputValue);
    if (normalized) {
      field.onChange(normalized);
      onChange?.(normalized);
      setInputValue(normalized);
      return;
    }
    setInputValue(monthValue);
  };

  const pickerPanel = (
    <>
      <div className="grid grid-cols-2">
        <div className="min-w-0 border-r border-border">
          <p className="px-2 pt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Year
          </p>
          <ScrollArea horizontal={false} className="h-40 w-full sm:h-44">
            <div className="flex flex-col gap-0.5 p-1.5">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={cn(
                    "h-8 w-full cursor-pointer rounded-md text-sm tabular-nums transition-colors",
                    Number(year) === selectedYear
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => applyMonth(year, selectedMonth)}
                >
                  {year}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="min-w-0">
          <p className="px-2 pt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Month
          </p>
          <ScrollArea horizontal={false} className="h-40 w-full sm:h-44">
            <div className="flex flex-col gap-0.5 p-1.5">
              {MONTHS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={cn(
                    "h-8 w-full cursor-pointer rounded-md text-sm transition-colors",
                    m.value === selectedMonth
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => applyMonth(String(selectedYear), m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-2"
          onClick={() => {
            const d = new Date();
            applyMonth(
              String(d.getFullYear()),
              String(d.getMonth() + 1).padStart(2, "0"),
            );
          }}
        >
          This month
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-8 min-w-16 rounded-md"
          onClick={() => setOpen(false)}
        >
          Done
        </Button>
      </div>
    </>
  );

  return (
    <div className="grid w-full min-w-0 gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-foreground">
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        {isManualInput ? (
          <div className="relative w-full min-w-0">
            <PopoverTrigger
              render={
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 h-10 w-full sm:h-11"
                  disabled={disabled}
                />
              }
            />
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={
                placeholder === "Select month" ? "YYYY-MM" : placeholder
              }
              disabled={disabled}
              inputMode="numeric"
              autoComplete="off"
              className={cn(
                "relative z-10 h-10 w-full pr-20 transition-all duration-200 sm:h-11",
                error && "border-destructive focus-visible:ring-destructive/50",
                disabled && disabledFieldClass,
                className,
              )}
            />
            <div className="absolute top-1/2 right-3 z-20 flex -translate-y-1/2 items-center gap-1.5">
              {allowClear && monthValue && !disabled ? (
                <button
                  type="button"
                  className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted"
                  onClick={handleClear}
                  aria-label="Clear month"
                >
                  <X className="h-3.5 w-3.5 opacity-50" />
                </button>
              ) : null}
              <button
                type="button"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  disabled ? "cursor-not-allowed" : "cursor-pointer",
                )}
                aria-label="Open month picker"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
              >
                <CalendarDays className="h-4 w-4 sm:size-4.5" />
              </button>
            </div>
          </div>
        ) : (
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "relative h-10 w-full min-w-0 cursor-pointer justify-between px-3 text-left font-normal sm:h-11",
                  !monthValue && "text-muted-foreground",
                  error &&
                    "border-destructive focus-visible:ring-destructive/50",
                  disabled && disabledFieldClass,
                  className,
                )}
              />
            }
          >
            <span className="truncate text-sm sm:text-[0.9375rem]">
              {monthValue ? displayMonth(monthValue) : placeholder}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {allowClear && monthValue && !disabled ? (
                <span
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted"
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                >
                  <X className="h-3.5 w-3.5 opacity-50" />
                </span>
              ) : null}
              <CalendarDays className="h-4 w-4 opacity-70 sm:size-4.5" />
            </span>
          </PopoverTrigger>
        )}

        <PopoverContent
          className="z-[100] w-48 gap-0 border-border bg-popover p-0 shadow-xl sm:w-52"
          align="center"
          side="bottom"
          sideOffset={8}
        >
          {pickerPanel}
        </PopoverContent>
      </Popover>

      {error ? (
        <p className="animate-in fade-in slide-in-from-top-1 px-1 text-[0.8rem] font-medium text-destructive">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export default MonthPicker;
