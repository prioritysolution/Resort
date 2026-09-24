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
import ReservationSearchField from "@/common/Searchable/ReservationSearchField";
import DatePicker from "@/common/formFields/DatePicker";
import RadioField from "@/common/formFields/RadioField";
import CheckboxField from "@/common/formFields/CheckboxField";
import { preventEnterSubmit } from "@/common/formFields/preventEnterSubmit";
import {
  formatMoney,
  PAYMENT_COLL_MODES,
  type Payment,
  type PaymentDue,
  type PaymentFormValues,
} from "@/container/guest/payment/types";

type Props = {
  open: boolean;
  form: UseFormReturn<PaymentFormValues>;
  editing: Payment | null;
  saving: boolean;
  dueInfo: PaymentDue | null;
  dueLoading: boolean;
  checkoutDone: boolean;
  onClose: () => void;
  onSubmit: (v: PaymentFormValues) => void;
  onLoadDue: () => void;
};

export default function PaymentFormDialog({
  open,
  form,
  editing,
  saving,
  dueInfo,
  dueLoading,
  checkoutDone,
  onClose,
  onSubmit,
  onLoadDue,
}: Props) {
  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <DialogHeader className="shrink-0 px-4 pt-4">
          <DialogTitle>{editing ? "Edit payment" : "Add payment"}</DialogTitle>
          <DialogDescription>
            Enter a reservation number to load due. When checkout is done, due
            is shown and remaining amount is prefilled. Guests may pay more than
            due.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onKeyDown={preventEnterSubmit}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end">
                  <div className="min-w-0 flex-1">
                    <ReservationSearchField
                      control={form.control}
                      name="reservation_no"
                      label="Reservation number"
                      isRequired
                      placeholder="Enter or search reservation number"
                      disabled={Boolean(editing)}
                    />
                  </div>
                  {!editing ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="mb-0.5 h-10 shrink-0"
                      onClick={onLoadDue}
                      disabled={dueLoading}
                    >
                      {dueLoading ? (
                        <PageLoader variant="button" />
                      ) : (
                        "Load due"
                      )}
                    </Button>
                  ) : null}
                </div>

                {dueInfo || dueLoading ? (
                  <div className="sm:col-span-2 space-y-2 rounded-[0.625rem] border border-border bg-chrome p-4">
                    {dueLoading ? (
                      <div className="flex justify-center py-4">
                        <PageLoader variant="section" />
                      </div>
                    ) : dueInfo ? (
                      <>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {checkoutDone
                              ? "Checkout complete — due available"
                              : "Not checked out — collection only"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[dueInfo.Guest_Name, dueInfo.Reservation_No]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        {/* Checkout complete — due available */}
                        {checkoutDone ? (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Net amount
                              </p>
                              <p className="font-medium">
                                {formatMoney(dueInfo.Net_Amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Amount paid
                              </p>
                              <p className="font-medium">
                                {formatMoney(dueInfo.Amount_Paid)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Due amount
                              </p>
                              <p className="font-medium text-primary">
                                {formatMoney(dueInfo.Due_Amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Checkout
                              </p>
                              <p className="font-medium">Done</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Due amount is hidden until checkout. You can still
                            add a collection against this reservation.
                          </p>
                        )}
                      </>
                    ) : null}
                  </div>
                ) : null}

                <DatePicker
                  control={form.control}
                  name="coll_date"
                  label="Collection date"
                  placeholder="Defaults to today"
                />
                <InputField
                  control={form.control}
                  name="remaining_amount"
                  label={
                    checkoutDone ? "Remaining amount" : "Collection amount"
                  }
                  type="number"
                  isRequired
                  placeholder={
                    checkoutDone
                      ? "Prefills from due — can exceed due"
                      : "Enter amount"
                  }
                />
                <RadioField
                  control={form.control}
                  name="coll_mode"
                  label="Payment mode"
                  options={[...PAYMENT_COLL_MODES]}
                  formItemClassName="sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <CheckboxField
                    control={form.control}
                    name="final_coll"
                    label="Final collection"
                    description="Marks this payment as closing the due. If omitted, the API sets final when paid amount covers due."
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <PageLoader variant="button" light />
                ) : editing ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
