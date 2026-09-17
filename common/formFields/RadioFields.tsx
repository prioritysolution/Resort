"use client";

import { type FieldValues, type Control, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";

interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  isRequired?: boolean;
}

const RadioField = <T extends FieldValues>({
  control,
  name,
  label = "Option",
  className,
  options,
  orientation = "vertical",
  disabled = false,
  isRequired = false,
}: RadioProps<T>) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        return (
          <FormItem className={cn("flex w-full flex-col gap-2", className)}>
            {label ? (
              <FormLabel
                className={cn(
                  "text-sm font-medium text-foreground",
                  hasError && "text-destructive",
                  disabled && "opacity-60",
                )}
              >
                {label}
                {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
              </FormLabel>
            ) : null}

            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled}
                className={cn(
                  isHorizontal
                    ? "flex flex-row flex-wrap gap-2.5"
                    : "flex flex-col gap-2",
                  disabled && "pointer-events-none opacity-55",
                )}
              >
                {options.map((option) => {
                  const isSelected = field.value === option.value;

                  return (
                    <label
                      key={String(option.value)}
                      htmlFor={`${name}-${option.value}`}
                      onClick={(e) => {
                        if (option.disabled) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className={cn(
                        "select-none transition-all duration-150",
                        option.disabled
                          ? "pointer-events-none cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                        isHorizontal && [
                          "inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-[13.5px] font-medium",
                          isSelected && !hasError
                            ? "border-primary bg-primary/10 text-primary"
                            : hasError
                              ? "border-destructive bg-destructive/5"
                              : "border-input bg-muted/40 hover:border-primary hover:bg-primary/5",
                        ],
                        !isHorizontal && [
                          "flex items-center gap-3 rounded-md border px-3.5 py-[11px]",
                          isSelected && !hasError
                            ? "border-primary bg-primary/10"
                            : hasError
                              ? "border-destructive bg-destructive/5"
                              : "border-input bg-muted/40 hover:border-primary hover:bg-primary/5",
                        ],
                      )}
                    >
                      <RadioGroupItem
                        value={String(option.value)}
                        id={`${name}-${option.value}`}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "flex shrink-0 items-center justify-center rounded-full border-2 bg-background",
                          isHorizontal ? "h-4 w-4" : "h-[17px] w-[17px]",
                          isSelected && !hasError
                            ? "border-primary"
                            : hasError
                              ? "border-destructive"
                              : "border-input",
                        )}
                      >
                        {isSelected ? (
                          <span
                            className={cn(
                              "rounded-full",
                              hasError ? "bg-destructive" : "bg-primary",
                              "h-[7px] w-[7px]",
                            )}
                          />
                        ) : null}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-[13px] leading-snug font-semibold">
                          {option.label}
                        </span>
                        {!isHorizontal && option.description ? (
                          <span className="truncate text-[11px] text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </FormControl>

            {hasError ? (
              <div className="mt-0.5 flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0 text-destructive" />
                <FormMessage className="text-[11px] font-medium text-destructive" />
              </div>
            ) : null}
          </FormItem>
        );
      }}
    />
  );
};

export default RadioField;
