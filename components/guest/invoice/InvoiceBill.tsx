"use client";

import { useMemo, useRef } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import getCookieData from "@/utils/getCookieData";
import { RoomInvoicePrint } from "./RoomInvoicePrint";
import { FoodInvoicePrint } from "./FoodInvoicePrint";

type Props = {
  bill: any;
};

const displayDate = (value?: string) => {
  if (!value) return "—";
  const parsed = parseISO(value.slice(0, 10));
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value;
};

const formatBillMoney = (value: unknown) => {
  if (value === "" || value == null) return "0.00";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function InvoiceBill({ bill }: Props) {
  const hotelName = useMemo(
    () =>
      getCookieData("resortName") ||
      getCookieData("resortShortName") ||
      "Innap",
    [],
  );

  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const isRoom = bill._type === "room";
  const due = bill.payment?.balance_due || 0;
  // Fallback to older status if payment status isn't available
  const cancelled = Number(bill.Status) === 0;

  return (
    <article className="m-4 overflow-hidden rounded-[0.625rem] border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs text-muted-foreground">{hotelName}</p>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {bill.invoice_no || "Invoice"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {bill.guest?.name || "—"} · {isRoom ? `Room ${bill.stay?.rooms?.[0]?.room_no || "—"}` : `Room ${bill.guest?.room_no || "—"}`}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Badge variant={cancelled ? "destructive" : "secondary"}>
            {cancelled ? "Cancelled" : "Active"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Invoice Date: {displayDate(bill.invoice_date)}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-border">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="text-sm font-semibold text-foreground">
            {isRoom ? "Room Bill" : "Food Bill"}
          </dt>
          <dd className="text-sm font-semibold text-foreground">
            {formatBillMoney(isRoom ? bill.billing?.room_bill : bill.billing?.food_bill)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="text-sm font-semibold text-foreground">
            Total GST
          </dt>
          <dd className="text-sm font-semibold text-foreground">
            {formatBillMoney((bill.billing?.cgst_amount || 0) + (bill.billing?.sgst_amount || 0))}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="text-sm font-semibold text-foreground">Grand Total</dt>
          <dd className="text-sm font-semibold text-foreground">
            {formatBillMoney(bill.billing?.grand_total)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 bg-primary/5 px-4 py-3">
          <dt className="text-sm font-semibold text-foreground">Due</dt>
          <dd className="text-sm font-semibold text-primary">
            {formatBillMoney(due)}
          </dd>
        </div>
      </dl>

      {/* download and print buttons */}
      <div className="flex flex-wrap justify-end gap-2 border-t border-border px-4 py-3">
        <Button type="button" onClick={() => handlePrint()}>
          <Printer className="size-4 mr-2" />
          Print
        </Button>
      </div>

      <div className="absolute -left-[10000px] -top-[10000px]">
        {isRoom ? (
          <RoomInvoicePrint ref={printRef} bill={bill} hotelName={hotelName} />
        ) : (
          <FoodInvoicePrint ref={printRef} bill={bill} hotelName={hotelName} />
        )}
      </div>
    </article>
  );
}