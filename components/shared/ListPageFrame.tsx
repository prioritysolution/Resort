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
 * List/CRUD page: one ScrollArea on the table only (no nested page scrollbars).
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
          padding="md"
          borderedHeader={false}
          className="flex min-h-0 flex-1 flex-col"
          contentClassName="flex min-h-0 flex-1 flex-col !pb-0"
        >
          <div className="mb-4 shrink-0">{toolbar}</div>
          <div className="-mx-3.5 flex min-h-0 flex-1 flex-col border-t border-border sm:-mx-4">
            <ScrollArea className="h-full min-h-0 w-full flex-1">
              <div className="min-w-0 p-0 pb-3 sm:pb-4">{children}</div>
            </ScrollArea>
          </div>
        </PageSection>
      </PageShellContent>

      {overlays}
    </PageShell>
  );
}

export default ListPageFrame;
