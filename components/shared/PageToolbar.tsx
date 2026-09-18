import * as React from "react";
import { cn } from "@/lib/utils";

interface PageToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function PageToolbar({
  children,
  title,
  description,
  actions,
  compact = false,
  className,
  ...props
}: PageToolbarProps) {
  return (
    <section
      className={cn(
        "rounded-[0.625rem] border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {title || description || actions ? (
        <div className="flex flex-col gap-2 border-b border-border px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-display text-xs font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "grid items-end gap-3",
          compact ? "p-3" : "p-3 sm:p-4",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function PageToolbarActions({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
