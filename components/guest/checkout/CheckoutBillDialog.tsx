"use client";

import { useMemo } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getCookieData from "@/utils/getCookieData";
import {
  buildCheckoutBillLines,
  downloadCheckoutBill,
  formatBillMoney,
  printCheckoutBill,
} from "@/container/guest/checkout/checkoutBill";
import {
  checkoutDateOf,
  type Checkout,
} from "@/container/guest/checkout/types";

type Props = {
  open: boolean;
  bill: Checkout | null;
  onClose: () => void;
};

export default function CheckoutBillDialog({ open, bill, onClose }: Props) {
  const hotelName = useMemo(
    () =>
      getCookieData("resortName") ||
      getCookieData("resortShortName") ||
      "Innap",
    [],
  );

  const receipt = bill;
  const lines = receipt
    ? buildCheckoutBillLines(receipt).filter(
        (row) => row.value != null && row.value !== "",
      )
    : [];

  const handlePrint = () => {
    if (!receipt) return;
    printCheckoutBill(receipt, hotelName);
  };

  const handleDownloadHtml = () => {
    if (!receipt) return;
    downloadCheckoutBill(receipt, hotelName, "html");
  };

  const handleDownloadTxt = () => {
    if (!receipt) return;
    downloadCheckoutBill(receipt, hotelName, "txt");
  };

  return (
    <Dialog
      open={open && Boolean(receipt)}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      disablePointerDismissal
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogHeader className="shrink-0 px-4 pt-4">
          <DialogTitle>Checkout bill</DialogTitle>
          <DialogDescription>
            2-inch thermal receipt. Print to a thermal printer or download a
            copy.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {receipt ? (
            <div className="mx-auto w-full max-w-55 rounded-[0.625rem] border border-border bg-white p-3 text-black shadow-sm">
              <div
                className="font-mono text-[11px] leading-snug"
                style={{ width: "58mm", maxWidth: "100%" }}
              >
                <p className="text-center text-[13px] font-bold tracking-wide uppercase">
                  {hotelName}
                </p>
                <p className="text-center text-[10px] text-neutral-600">
                  CHECKOUT BILL
                </p>
                <div className="my-2 border-t border-dashed border-neutral-400" />
                <div className="space-y-0.5 text-[10px]">
                  <p>
                    <span className="inline-block w-20 text-neutral-600">
                      Bill No
                    </span>
                    : {receipt.Bill_No || "—"}
                  </p>
                  <p>
                    <span className="inline-block w-20 text-neutral-600">
                      Reservation
                    </span>
                    : {receipt.Reservation_No || "—"}
                  </p>
                  {receipt.Guest_Name ? (
                    <p>
                      <span className="inline-block w-20 text-neutral-600">
                        Guest
                      </span>
                      : {receipt.Guest_Name}
                    </p>
                  ) : null}
                  <p>
                    <span className="inline-block w-20 text-neutral-600">
                      Checkout
                    </span>
                    : {checkoutDateOf(receipt) || "—"}
                  </p>
                </div>
                <div className="my-2 border-t border-dashed border-neutral-400" />
                <div className="space-y-0.5">
                  {lines.map((row) => (
                    <div
                      key={row.label}
                      className={`flex justify-between gap-2 ${
                        row.bold ? "font-bold" : ""
                      }`}
                    >
                      <span>{row.label}</span>
                      <span>{formatBillMoney(row.value)}</span>
                    </div>
                  ))}
                </div>
                <div className="my-2 border-t border-dashed border-neutral-400" />
                <p className="text-center text-[10px] text-neutral-600">
                  Thank you! Visit again.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 flex-col gap-2 sm:flex-col">
          <div className="flex w-full flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleDownloadTxt}>
              <Download className="size-4" />
              Download TXT
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadHtml}
            >
              <Download className="size-4" />
              Download HTML
            </Button>
            <Button type="button" onClick={handlePrint}>
              <Printer className="size-4" />
              Print
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
