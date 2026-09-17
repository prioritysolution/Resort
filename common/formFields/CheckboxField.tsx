"use client";

import { type FieldValues, type Control, type Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  className?: string;
}

const CheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
}: CheckboxFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            "flex h-12 w-full items-center gap-3 self-end rounded-md border border-input px-4",
            className,
          )}
        >
          <FormControl>
            <div className="flex items-center gap-2">
              <Checkbox
                id={name}
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                aria-invalid={!!fieldState?.error?.message}
              />
              <Label htmlFor={name} className="cursor-pointer font-normal">
                {label}
              </Label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
