"use client";

import type { ReactNode } from "react";
import {
  PageHeader,
  PageSection,
  PageShell,
  PageShellContent,
} from "@/components/shared";
import { ScrollArea } from "@/components/ui/scroll-area";

type ListPageFrameProps = {
  title: string;
  description?: string;
  /** Search / filters / add actions */
  toolbar: ReactNode;
  /** Table or list body */
  children: ReactNode;
  /** Dialogs, success modals, etc. */
  overlays?: ReactNode;
  /** Optional controls above the card (e.g. tabs) */
  beforeSection?: ReactNode;
};

/**
 * List/CRUD page: toolbar stays fixed; only the table region scrolls.
 */
export function ListPageFrame({
  title,
  description,
  toolbar,
  children,
  overlays,
  beforeSection,
}: ListPageFrameProps) {
  return (
    <PageShell className="h-full">
      <PageHeader title={title} description={description} />

      <PageShellContent scroll={false}>
        {beforeSection ? (
          <div className="shrink-0">{beforeSection}</div>
        ) : null}

        <PageSection
          padding="none"
          borderedHeader={false}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
        >
          <div className="shrink-0 border-b border-border bg-card px-3 py-3 sm:px-4 sm:py-3.5">
            {toolbar}
          </div>

          <div className="relative z-0 flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden">
            <ScrollArea
              horizontal={false}
              className="min-h-0 w-full min-w-0 max-w-full flex-1"
            >
              <div className="w-full min-w-0 max-w-full">{children}</div>
            </ScrollArea>
          </div>
        </PageSection>
      </PageShellContent>

      {overlays}
    </PageShell>
  );
}

export default ListPageFrame;
