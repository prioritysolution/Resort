"use client";

import * as React from "react";
import { Clock, X } from "lucide-react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const HOURS_24 = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const normalizeTime = (value: unknown): string => {
  if (value == null || value === "") return "";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return "";
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return "";
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

interface TimePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  isRequired?: boolean;
  /** When true: type manually and/or open picker to select. */
  isManualInput?: boolean;
  onChange?: (time: string | null) => void;
  rules?: RegisterOptions<T, Path<T>>;
}

export function TimePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select time",
  disabled = false,
  className,
  allowClear = true,
  isRequired = false,
  isManualInput = false,
  onChange,
  rules,
}: TimePickerProps<T>) {
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

  const time = normalizeTime(field.value);
  const now = new Date();
  const hour = time
    ? time.slice(0, 2)
    : String(now.getHours()).padStart(2, "0");
  const minute = time
    ? time.slice(3, 5)
    : String(now.getMinutes()).padStart(2, "0");

  React.useEffect(() => {
    setInputValue(time);
  }, [time]);

  const applyTime = (nextHour: string, nextMinute: string) => {
    const next = `${nextHour}:${nextMinute}`;
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
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
      if (digits.length >= 3) {
        formatted += `:${digits.slice(2, 4)}`;
      }
    }
    setInputValue(formatted);

    if (formatted.length === 5) {
      const normalized = normalizeTime(formatted);
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
    const normalized = normalizeTime(inputValue);
    if (normalized) {
      field.onChange(normalized);
      onChange?.(normalized);
      setInputValue(normalized);
      return;
    }
    setInputValue(time);
  };

  const pickerPanel = (
    <>
      <div className="grid grid-cols-2">
        <div className="min-w-0 border-r border-border">
          <p className="px-2 pt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Hour
          </p>
          <ScrollArea horizontal={false} className="h-40 w-full sm:h-44">
            <div className="flex flex-col gap-0.5 p-1.5">
              {HOURS_24.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={cn(
                    "h-8 w-full cursor-pointer rounded-md text-sm tabular-nums transition-colors",
                    h === hour
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => applyTime(h, minute)}
                >
                  {h}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="min-w-0">
          <p className="px-2 pt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Min
          </p>
          <ScrollArea horizontal={false} className="h-40 w-full sm:h-44">
            <div className="flex flex-col gap-0.5 p-1.5">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={cn(
                    "h-8 w-full cursor-pointer rounded-md text-sm tabular-nums transition-colors",
                    m === minute
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => applyTime(hour, m)}
                >
                  {m}
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
            applyTime(
              String(d.getHours()).padStart(2, "0"),
              String(d.getMinutes()).padStart(2, "0"),
            );
          }}
        >
          Now
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
        <label className="flex items-center px-1 text-[13px] font-medium tracking-wide text-primary">
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        {isManualInput ? (
          <div className="relative w-full min-w-0">
            {/* Full-width anchor so the panel centers under the field */}
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
                placeholder === "Select time" ? "HH:MM" : placeholder
              }
              disabled={disabled}
              inputMode="numeric"
              autoComplete="off"
              className={cn(
                "relative z-10 h-10 w-full pr-20 transition-all duration-200 sm:h-11",
                error && "border-destructive focus-visible:ring-destructive/50",
                disabled && "cursor-not-allowed bg-muted/80",
                className,
              )}
            />
            <div className="absolute top-1/2 right-3 z-20 flex -translate-y-1/2 items-center gap-1.5">
              {allowClear && time && !disabled ? (
                <button
                  type="button"
                  className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted"
                  onClick={handleClear}
                  aria-label="Clear time"
                >
                  <X className="h-3.5 w-3.5 opacity-50" />
                </button>
              ) : null}
              <button
                type="button"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Open time picker"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
              >
                <Clock className="h-4 w-4 sm:size-4.5" />
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
                  "relative h-10 w-full min-w-0 justify-between px-3 text-left font-normal sm:h-11",
                  !time && "text-muted-foreground",
                  error &&
                    "border-destructive focus-visible:ring-destructive/50",
                  disabled && "cursor-not-allowed bg-muted/80",
                  className,
                )}
              />
            }
          >
            <span className="truncate text-sm sm:text-[0.9375rem]">
              {time || placeholder}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {allowClear && time && !disabled ? (
                <span
                  role="button"
                  tabIndex={0}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
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
              <Clock className="h-4 w-4 opacity-70 sm:size-4.5" />
            </span>
          </PopoverTrigger>
        )}

        <PopoverContent
          className="z-[100] w-44 gap-0 border-border bg-popover p-0 shadow-xl sm:w-48"
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

export default TimePicker;
