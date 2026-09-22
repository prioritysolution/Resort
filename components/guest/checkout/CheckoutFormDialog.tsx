"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLoader } from "@/components/shared";
import InputField from "@/common/formFields/InputField";
import DatePicker from "@/common/formFields/DatePicker";
import {
  CHECKOUT_SUMMARY_FIELDS,
  type CheckoutFormValues,
  type CheckoutSummary,
} from "@/container/guest/checkout/types";

type Props = {
  open: boolean;
  form: UseFormReturn<CheckoutFormValues>;
  saving: boolean;
  summary: CheckoutSummary | null;
  summaryLoading: boolean;
  onPreview: () => void;
  onClose: () => void;
  onSubmit: (v: CheckoutFormValues) => void;
};

export default function CheckoutFormDialog({
  open,
  form,
  saving,
  summary,
  summaryLoading,
  onPreview,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
      >
        <DialogHeader className="shrink-0 px-4 pt-4">
          <DialogTitle>Checkout guest</DialogTitle>
          <DialogDescription>
            Preview the bill, then complete checkout. Checkout does not create a
            new collection — Amount paid is the sum of existing payments.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  control={form.control}
                  name="reservation_no"
                  label="Reservation number"
                  isRequired
                  placeholder="Enter reservation number"
                />
                <DatePicker
                  control={form.control}
                  name="checkout_date"
                  label="Checkout date"
                  placeholder="Defaults to today"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={onPreview}
                disabled={summaryLoading}
              >
                {summaryLoading ? (
                  <PageLoader variant="button" />
                ) : (
                  "Preview summary"
                )}
              </Button>

              {summary ? (
                <div className="space-y-3 rounded-[0.625rem] border border-border bg-chrome p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Bill preview
                    </p>
                    {summary.Guest_Name || summary.Reservation_No ? (
                      <p className="text-xs text-muted-foreground">
                        {[summary.Guest_Name, summary.Reservation_No]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {CHECKOUT_SUMMARY_FIELDS.map(({ key, label }) => {
                      const value = summary[key];
                      if (value == null || value === "") return null;
                      return (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="font-medium text-foreground">
                            {String(value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <DialogFooter className="mx-0 mb-0 shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <PageLoader variant="button" light />
                ) : (
                  "Complete checkout"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
