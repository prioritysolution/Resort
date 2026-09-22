"use client";

import {
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type RadioOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: RadioOption[];
  isRequired?: boolean;
  disabled?: boolean;
  /** When true, stores Number(value); otherwise stores string */
  numeric?: boolean;
  formItemClassName?: string;
  className?: string;
};

export default function RadioField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  isRequired = false,
  disabled = false,
  numeric = true,
  formItemClassName,
  className,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex w-full flex-col gap-1.5", formItemClassName)}>
          {label ? (
            <FormLabel className="text-sm font-medium text-foreground">
              {label}
              {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
            </FormLabel>
          ) : null}
          <FormControl>
            <RadioGroup
              value={
                field.value === null || field.value === undefined
                  ? ""
                  : String(field.value)
              }
              disabled={disabled}
              onValueChange={(value) =>
                field.onChange(numeric ? Number(value) : value)
              }
              className={cn("flex flex-wrap gap-3 pt-1", className)}
            >
              {options.map((option) => (
                <Label
                  key={String(option.value)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-[0.625rem] border border-border bg-background px-3 py-2.5 text-sm font-normal has-[[data-slot=radio-group-item][data-checked]]:border-primary has-[[data-slot=radio-group-item][data-checked]]:bg-primary/5",
                    (disabled || option.disabled) &&
                      "cursor-not-allowed opacity-50",
                  )}
                >
                  <RadioGroupItem
                    value={String(option.value)}
                    disabled={disabled || option.disabled}
                  />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
