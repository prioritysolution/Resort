"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared";
import DatePicker from "@/common/formFields/DatePicker";
import MonthPicker from "@/common/formFields/MonthPicker";
import RadioField from "@/common/formFields/RadioField";
import BookingSearchField from "@/common/Searchable/BookingSearchField";
import ReservationSearchField from "@/common/Searchable/ReservationSearchField";
import {
  COLLECTION_TYPE_OPTIONS,
  REPORT_DATE_MODE_OPTIONS,
} from "@/container/reports/shared/types";
import type { CollectionReportFormValues } from "@/container/reports/collection-register/types";

type Props = {
  form: UseFormReturn<CollectionReportFormValues>;
  loading: boolean;
  onSubmit: (values: CollectionReportFormValues) => void;
};

export default function CollectionRegisterToolbar({
  form,
  loading,
  onSubmit,
}: Props) {
  const dateMode = form.watch("date_mode");
  const collectionType = form.watch("collection_type");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <RadioField
          control={form.control}
          name="collection_type"
          label="Collection type"
          options={[...COLLECTION_TYPE_OPTIONS]}
          numeric={false}
          formItemClassName="sm:col-span-2 lg:col-span-4"
        />
        <RadioField
          control={form.control}
          name="date_mode"
          label="Filter by"
          options={[...REPORT_DATE_MODE_OPTIONS]}
          numeric={false}
          formItemClassName="sm:col-span-2 lg:col-span-4"
        />
        {collectionType === "reservation" ? (
          <ReservationSearchField
            control={form.control}
            name="reservation_no"
            label="Reservation number"
            placeholder="Enter or search reservation number"
            isRequired
          />
        ) : null}
        {collectionType === "booking" ? (
          <BookingSearchField
            control={form.control}
            name="booking_no"
            label="Booking number"
            placeholder="Enter or search booking number"
            isRequired
          />
        ) : null}
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
            />
            <DatePicker
              control={form.control}
              name="to_date"
              label="To date"
              placeholder="Select to date"
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
