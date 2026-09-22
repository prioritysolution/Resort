"use client";

import type { ReactNode } from "react";
import { formatReportMoney } from "@/container/reports/shared/types";

type MetaItem = {
  label: string;
  value: unknown;
  emphasize?: boolean;
};

type Props = {
  items: MetaItem[];
  extra?: ReactNode;
};

export default function ReportMetaBar({ items, extra }: Props) {
  const visible = items.filter(
    (item) => item.value != null && item.value !== "",
  );
  if (!visible.length && !extra) return null;

  return (
    <div className="mb-3 space-y-2 rounded-[0.625rem] border border-border bg-chrome p-3">
      {visible.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {visible.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p
                className={`text-sm font-medium ${
                  item.emphasize ? "text-primary" : "text-foreground"
                }`}
              >
                {typeof item.value === "number" ||
                (typeof item.value === "string" &&
                  item.value !== "" &&
                  !Number.isNaN(Number(item.value)) &&
                  /amount|advance|collection|commission|bill|paid|total/i.test(
                    item.label,
                  ))
                  ? formatReportMoney(item.value)
                  : String(item.value)}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      {extra}
    </div>
  );
}
