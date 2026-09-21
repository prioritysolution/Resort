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
import type {
  CheckoutFormValues,
  CheckoutSummary,
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
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Checkout guest</DialogTitle>
          <DialogDescription>
            Preview room, food, service, and payment totals before checkout.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                control={form.control}
                name="reservation_no"
                label="Reservation number"
                isRequired
              />
              <InputField
                control={form.control}
                name="checkout_date"
                label="Actual checkout date"
                type="date"
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
              <div className="grid grid-cols-2 gap-3 rounded-[0.625rem] border bg-muted/30 p-4">
                {Object.entries(summary)
                  .filter(([, v]) => typeof v !== "object")
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-muted-foreground">
                        {key.replaceAll("_", " ")}
                      </p>
                      <p className="font-medium">{String(value ?? "—")}</p>
                    </div>
                  ))}
              </div>
            ) : null}
            <DialogFooter>
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
