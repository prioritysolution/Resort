"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PageLoaderVariant = "page" | "section" | "inline" | "button";

type PageLoaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Visual density / placement */
  variant?: PageLoaderVariant;
  /** Accessible + visible label (hidden for button) */
  label?: string;
  /** Spinner uses white (e.g. primary buttons) */
  light?: boolean;
};

const sizeByVariant: Record<
  PageLoaderVariant,
  { spinner: string; minHeight: string; text: string }
> = {
  page: {
    spinner: "size-10 sm:size-12",
    minHeight: "min-h-[50vh] sm:min-h-[60vh]",
    text: "text-sm sm:text-base",
  },
  section: {
    spinner: "size-8 sm:size-9",
    minHeight: "min-h-48 sm:min-h-56",
    text: "text-sm",
  },
  inline: {
    spinner: "size-5 sm:size-6",
    minHeight: "min-h-0",
    text: "text-xs sm:text-sm",
  },
  button: {
    spinner: "size-4 sm:size-[1.125rem]",
    minHeight: "min-h-0",
    text: "sr-only",
  },
};

function LoaderRing({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      role="presentation"
      className={cn(
        "inline-block animate-spin rounded-full border-[2.5px] border-solid",
        light
          ? "border-white/30 border-t-white"
          : "border-primary/20 border-t-primary",
        className,
      )}
    />
  );
}

/**
 * Shared responsive loader for auth, layout, tables, and buttons.
 *
 * - `page` — full content area (layout / empty pages)
 * - `section` — tables / PageSection bodies
 * - `inline` — compact row next to text
 * - `button` — inside primary/outline buttons (`light` for white ring)
 */
export function PageLoader({
  variant = "section",
  label = "Loading…",
  light = false,
  className,
  ...props
}: PageLoaderProps) {
  const sizes = sizeByVariant[variant];
  const isButton = variant === "button";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn(
        "flex w-full items-center justify-center",
        isButton || variant === "inline"
          ? "gap-2"
          : "flex-col gap-3 px-4 py-8 sm:gap-4 sm:py-10",
        sizes.minHeight,
        className,
      )}
      {...props}
    >
      <LoaderRing className={sizes.spinner} light={light} />
      <span
        className={cn(
          sizes.text,
          "font-medium tracking-tight",
          light ? "text-white" : "text-muted-foreground",
          isButton && "sr-only",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default PageLoader;
