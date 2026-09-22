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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

export default function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start gap-3 rounded-[0.625rem] border border-border bg-background p-4",
            className,
          )}
        >
          <FormControl>
            <Checkbox
              checked={Boolean(field.value)}
              disabled={disabled}
              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              className="mt-0.5"
            />
          </FormControl>
          <div className="space-y-0.5 leading-none">
            <FormLabel className="cursor-pointer text-sm font-medium text-foreground">
              {label}
            </FormLabel>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
