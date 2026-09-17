"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

const ComingSoonView = () => {
  const pathname = usePathname();
  const title = useMemo(() => {
    const leaf = pathname.split("/").filter(Boolean).pop() || "Page";
    return leaf
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [pathname]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="font-display text-[1.875rem] font-semibold text-foreground max-lg:text-[1.5rem] max-md:text-[1.3rem]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Module workspace reserved for this flow.
        </p>
      </div>

      <div className="rounded-[0.625rem] border border-border bg-card p-4 sm:p-5">
        <h2 className="font-display mb-3 text-center text-lg font-semibold text-foreground">
          Module workspace
        </h2>
        <p className="mx-auto max-w-xl text-center text-sm leading-6 text-muted-foreground">
          This screen is reserved for the {title} flow. Use the same page
          shell, form fields and API pattern when wiring the live module.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonView;
