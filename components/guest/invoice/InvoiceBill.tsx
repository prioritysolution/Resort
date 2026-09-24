"use client";

import { useMemo } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import getCookieData from "@/utils/getCookieData";
import {
  buildCheckoutBillLines,
  downloadCheckoutBill,
  formatBillMoney,
  printCheckoutBill,
} from "@/container/guest/checkout/checkoutBill";
import {
  checkoutDateOf,
  checkoutDueAmount,
  type Checkout,
} from "@/container/guest/checkout/types";

type Props = {
  bill: Checkout;
};

const displayDate = (value?: string) => {
  if (!value) return "—";
  const parsed = parseISO(value.slice(0, 10));
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value;
};

export default function InvoiceBill({ bill }: Props) {
  const hotelName = useMemo(
    () =>
      getCookieData("resortName") ||
      getCookieData("resortShortName") ||
      "Innap",
    [],
  );

  const lines = buildCheckoutBillLines(bill).filter(
    (row) => row.label !== "Balance / due",
  );
  const due = checkoutDueAmount(bill);
  const cancelled = Number(bill.Status) === 0;

  return (
    <article className="m-4 overflow-hidden rounded-[0.625rem] border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs text-muted-foreground">{hotelName}</p>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {bill.Bill_No || "Invoice"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {bill.Guest_Name || "—"} · Reservation {bill.Reservation_No || "—"}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Badge variant={cancelled ? "destructive" : "secondary"}>
            {cancelled ? "Cancelled" : "Active"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Checkout {displayDate(checkoutDateOf(bill))}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-border">
        {lines.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-2.5"
          >
            <dt
              className={
                row.bold
                  ? "text-sm font-semibold text-foreground"
                  : "text-sm text-muted-foreground"
              }
            >
              {row.label}
            </dt>
            <dd
              className={
                row.bold
                  ? "text-sm font-semibold text-foreground"
                  : "text-sm font-medium text-foreground"
              }
            >
              {formatBillMoney(row.value)}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 bg-primary/5 px-4 py-3">
          <dt className="text-sm font-semibold text-foreground">Due</dt>
          <dd className="text-sm font-semibold text-primary">
            {formatBillMoney(due)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap justify-end gap-2 border-t border-border px-4 py-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => downloadCheckoutBill(bill, hotelName, "txt")}
        >
          <Download className="size-4" />
          Download TXT
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => downloadCheckoutBill(bill, hotelName, "html")}
        >
          <Download className="size-4" />
          Download HTML
        </Button>
        <Button type="button" onClick={() => printCheckoutBill(bill, hotelName)}>
          <Printer className="size-4" />
          Print
        </Button>
      </div>
    </article>
  );
}
