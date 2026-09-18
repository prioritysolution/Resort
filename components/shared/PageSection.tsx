"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  borderedHeader?: boolean;
  padding?: "none" | "sm" | "md";
}

export function PageSection({
  children,
  title,
  description,
  action,
  className,
  contentClassName,
  headerClassName,
  borderedHeader = true,
  padding = "md",
}: PageSectionProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-3.5 sm:p-4",
  };
  const hasHeader = Boolean(title || description || action);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[0.625rem] border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {hasHeader ? (
        <div
          className={cn(
            "flex shrink-0 flex-col gap-2 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between",
            borderedHeader && "border-b border-border",
            headerClassName,
          )}
        >
          <div className="min-w-0">
            {title ? (
              <h2 className="font-display text-sm font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action ? (
            <div className="flex shrink-0 items-center gap-2">{action}</div>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "min-h-0 min-w-0",
          paddingClasses[padding],
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
