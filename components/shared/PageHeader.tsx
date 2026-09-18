import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function PageHeader({
  title,
  description,
  action,
  meta,
  className,
  titleClassName,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 flex-wrap items-end justify-between gap-x-4 gap-y-3",
        "border-0 bg-transparent px-1 pb-4 sm:px-2 sm:pb-5",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <h1
            className={cn(
              "font-display max-w-full text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-[1.75rem] md:text-[2rem]",
              titleClassName,
            )}
          >
            {title}
          </h1>
          {meta}
        </div>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {action}
        </div>
      ) : null}
    </header>
  );
}
