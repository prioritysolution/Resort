"use client";

import { type FieldValues, type Control, type Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { disabledFieldClass } from "@/common/formFields/disabledField";

interface TextareaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  formItemClassName?: string;
  disabled?: boolean;
  rows?: number;
  description?: string;
  isRequired?: boolean;
}

const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  formItemClassName,
  disabled = false,
  rows = 3,
  description,
  isRequired = false,
}: TextareaFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("w-full", formItemClassName)}>
          {label ? (
            <FormLabel className="text-sm font-medium">
              {label}
              {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
            </FormLabel>
          ) : null}
          <FormControl>
            <Textarea
              {...field}
              value={field.value ?? ""}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              aria-invalid={!!fieldState?.error?.message}
              className={cn(
                "min-h-[96px] w-full rounded-md",
                disabled && disabledFieldClass,
                className,
              )}
            />
          </FormControl>
          {description && !fieldState.error ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
          <FormMessage className="text-xs font-medium text-destructive" />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
