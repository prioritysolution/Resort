"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared";
import DatePicker from "@/common/formFields/DatePicker";
import MonthPicker from "@/common/formFields/MonthPicker";
import RadioField from "@/common/formFields/RadioField";
import { REPORT_DATE_MODE_OPTIONS } from "@/container/reports/shared/types";
import type { BookingReportFormValues } from "@/container/reports/booking-register/types";

type Props = {
  form: UseFormReturn<BookingReportFormValues>;
  loading: boolean;
  onSubmit: (values: BookingReportFormValues) => void;
};

export default function BookingRegisterToolbar({
  form,
  loading,
  onSubmit,
}: Props) {
  const dateMode = form.watch("date_mode");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <RadioField
          control={form.control}
          name="date_mode"
          label="Filter by"
          options={[...REPORT_DATE_MODE_OPTIONS]}
          numeric={false}
          formItemClassName="sm:col-span-2 lg:col-span-4"
        />
        {dateMode === "month" ? (
          <MonthPicker
            control={form.control}
            name="month"
            label="Month"
            placeholder="Select month"
            isRequired
          />
        ) : (
          <>
            <DatePicker
              control={form.control}
              name="from_date"
              label="From date"
              placeholder="Select from date"
              isRequired
            />
            <DatePicker
              control={form.control}
              name="to_date"
              label="To date"
              placeholder="Select to date"
              isRequired
            />
          </>
        )}
        <div className="flex items-end">
          <Button type="submit" className="h-10 w-full sm:w-auto" disabled={loading}>
            {loading ? <PageLoader variant="button" light /> : "Run report"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
