"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { LayoutTemplate } from "lucide-react";
import {
  EmptyState,
  PageHeader,
  PageSection,
  PageShell,
  PageShellContent,
} from "@/components/shared";

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
    <PageShell className="h-full">
      <PageHeader
        title={title}
        description="This module is ready for wiring — forms and APIs will land here next."
      />
      <PageShellContent>
        <PageSection padding="md" borderedHeader={false}>
          <EmptyState
            icon={<LayoutTemplate className="size-6" strokeWidth={1.75} />}
            title={`${title} workspace`}
            description="Nothing to configure yet. When this screen goes live it will use the same page shell, form fields, and API pattern as the rest of Innap."
            className="min-h-[min(24rem,50vh)]"
          />
        </PageSection>
      </PageShellContent>
    </PageShell>
  );
};

export default ComingSoonView;
