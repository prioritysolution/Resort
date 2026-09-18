"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  /** Flat content without card chrome (dashboard home) */
  flush?: boolean;
}

export function PageShell({
  children,
  className,
  flush = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 w-full max-w-full flex-col overflow-hidden bg-transparent",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden",
          !flush && "bg-transparent text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}

type PageShellContentProps = {
  children: ReactNode;
  className?: string;
  /**
   * When true (default), content scrolls in one ScrollArea.
   * Set false for list pages that scroll only the table region.
   */
  scroll?: boolean;
};

export function PageShellContent({
  children,
  className,
  scroll = true,
}: PageShellContentProps) {
  const inner = (
    <div
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-4 px-1 py-2 sm:gap-5 sm:px-2 sm:py-3 lg:gap-6",
        scroll && "pb-6 sm:pb-8",
        !scroll && "h-full min-h-0 flex-1",
        className,
      )}
    >
      {children}
    </div>
  );

  if (!scroll) {
    return (
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
        {inner}
      </div>
    );
  }

  return (
    <ScrollArea
      horizontal={false}
      className="h-full min-h-0 min-w-0 w-full flex-1"
    >
      {inner}
    </ScrollArea>
  );
}
