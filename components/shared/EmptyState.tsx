"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

/** Shared empty state for tables / list sections. */
export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-2 px-4 py-10 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-1 flex size-12 items-center justify-center rounded-[0.625rem] bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <p className="font-display text-base font-semibold text-foreground">
        {title}
      </p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default EmptyState;
