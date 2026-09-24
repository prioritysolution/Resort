"use client";

import * as React from "react";
import { format, isAfter, isBefore, startOfDay, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  allowClear?: boolean;
  picker?: "date" | "month" | "year";
  isRequired?: boolean;
  disablePastAndFuture?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  disableBeforeStartDate?: boolean;
  showCurrentDate?: boolean;
  onChange?: (date: Date | null) => void;
  rules?: RegisterOptions<T, Path<T>>;
  isManualInput?: boolean;
}

export function DatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select date",
  disabled = false,
  className,
  dateFormat = "dd-MM-yyyy",
  allowClear = true,
  isRequired = false,
  disablePastAndFuture = false,
  disablePast = false,
  disableFuture = false,
  disableBeforeStartDate = false,
  showCurrentDate = false,
  onChange,
  rules,
  isManualInput = false,
}: DatePickerProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [startDateFromCookie, setStartDateFromCookie] =
    React.useState<Date | null>(null);
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

  React.useEffect(() => {
    const cookieVal = getCookie("PrioBankStartDate");
    if (cookieVal) {
      const d = new Date(cookieVal);
      if (!Number.isNaN(d.getTime())) {
        setStartDateFromCookie(startOfDay(d));
      }
    }
  }, []);

  React.useEffect(() => {
    if (showCurrentDate && !field.value) {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      field.onChange(today);
    }
  }, [showCurrentDate, field.value, field.onChange]);

  React.useEffect(() => {
    if (field.value) {
      const d = new Date(field.value as string | number | Date);
      if (isValid(d)) {
        setInputValue(format(d, dateFormat));
      }
    } else {
      setInputValue("");
    }
  }, [field.value, dateFormat]);

  const rawValue = field.value as unknown;
  const date =
    rawValue instanceof Date
      ? rawValue
      : rawValue
        ? new Date(rawValue as string | number | Date)
        : undefined;

  const disabledDate = (d: Date) => {
    const today = startOfDay(new Date());
    const target = startOfDay(d);

    if (disablePast && isBefore(target, today)) return true;
    if (disableFuture && isAfter(target, today)) return true;
    if (
      disablePastAndFuture &&
      (isAfter(target, today) || isBefore(target, today))
    ) {
      return true;
    }
    if (
      disableBeforeStartDate &&
      startDateFromCookie &&
      isBefore(target, startDateFromCookie)
    ) {
      return true;
    }
    return false;
  };

  const handleSelect = (newDate?: Date) => {
    let finalDate = newDate;
    if (finalDate) {
      finalDate = new Date(finalDate);
      finalDate.setHours(12, 0, 0, 0);
    }
    field.onChange(finalDate || null);
    onChange?.(finalDate || null);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    onChange?.(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (digits.length > 0) {
      formattedValue += digits.substring(0, 2);
      if (digits.length >= 3) {
        formattedValue += "-" + digits.substring(2, 4);
        if (digits.length >= 5) {
          formattedValue += "-" + digits.substring(4, 8);
        }
      }
    }

    setInputValue(formattedValue);

    if (formattedValue.length === 10) {
      const parsedDate = parse(formattedValue, "dd-MM-yyyy", new Date());
      if (isValid(parsedDate)) {
        parsedDate.setHours(12, 0, 0, 0);
        if (!disabledDate(parsedDate)) {
          field.onChange(parsedDate);
          onChange?.(parsedDate);
        }
      }
    }
  };

  const handleInputBlur = () => {
    if (field.value) {
      const d = new Date(field.value as string | number | Date);
      if (isValid(d)) setInputValue(format(d, dateFormat));
    } else {
      setInputValue("");
    }
  };

  const calendarContent = (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
      disabled={disabledDate}
      className="p-3"
    />
  );

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-foreground">
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        {isManualInput ? (
          <div className="relative w-full">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={
                placeholder === "Select date" ? "DD-MM-YYYY" : placeholder
              }
              disabled={disabled}
              className={cn(
                "h-10 w-full pr-20 transition-all duration-200",
                error && "border-destructive focus-visible:ring-destructive/50",
                disabled && disabledFieldClass,
                className,
              )}
            />
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
              {allowClear && date && !disabled ? (
                <button
                  type="button"
                  className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted"
                  onClick={handleClear}
                  aria-label="Clear date"
                >
                  <X className="h-3 w-3 opacity-50" />
                </button>
              ) : null}
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                      "text-muted-foreground hover:text-foreground",
                      disabled ? "cursor-not-allowed" : "cursor-pointer",
                    )}
                    aria-label="Open calendar"
                  />
                }
              >
                <CalendarIcon className="h-4 w-4" />
              </PopoverTrigger>
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
                  "relative h-10 w-full justify-between px-3 text-left font-normal",
                  !date && "text-muted-foreground",
                  error && "border-destructive focus-visible:ring-destructive/50",
                  disabled && disabledFieldClass,
                  className,
                )}
              />
            }
          >
            <span className="truncate">
              {date ? format(date, dateFormat) : placeholder}
            </span>
            <span className="flex items-center gap-2">
              {allowClear && date && !disabled ? (
                <span
                  role="button"
                  tabIndex={0}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleClear(e as unknown as React.MouseEvent);
                  }}
                >
                  <X className="h-3 w-3 opacity-50" />
                </span>
              ) : null}
              <CalendarIcon className="h-4 w-4 opacity-70" />
            </span>
          </PopoverTrigger>
        )}
        <PopoverContent
          className="w-auto border-border bg-popover p-0 shadow-xl"
          align="start"
        >
          {calendarContent}
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

export default DatePicker;
