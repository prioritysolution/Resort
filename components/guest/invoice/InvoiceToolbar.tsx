"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared";
import ReservationSearchField from "@/common/Searchable/ReservationSearchField";
import type { InvoiceFormValues } from "@/container/guest/invoice/types";

type Props = {
  form: UseFormReturn<InvoiceFormValues>;
  loading: boolean;
  onSubmit: (values: InvoiceFormValues) => void;
};

export default function InvoiceToolbar({ form, loading, onSubmit }: Props) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <ReservationSearchField
          control={form.control}
          name="reservation_no"
          label="Reservation number"
          placeholder="Enter or search reservation number"
          isRequired
          formItemClassName="w-full sm:max-w-md"
        />
        <Button
          type="submit"
          className="h-10 w-full sm:mb-0.5 sm:w-auto"
          disabled={loading}
        >
          {loading ? <PageLoader variant="button" light /> : "Search"}
        </Button>
      </form>
    </Form>
  );
}
