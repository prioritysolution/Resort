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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { disabledFieldClass } from "@/common/formFields/disabledField";

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
}

const SwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
}: SwitchFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-4",
            disabled && disabledFieldClass,
          )}
        >
          <div className="space-y-0.5">
            <FormLabel className="text-base font-medium">{label}</FormLabel>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              disabled={disabled}
              onCheckedChange={field.onChange}
              className={disabled ? "cursor-not-allowed" : undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SwitchField;
