"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  useForm,
  useFormContext,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageLoader } from "@/components/shared";
import InputField from "@/common/formFields/InputField";
import { getBookingListAPI } from "@/container/guest/booking/BookingApis";
import type { Booking } from "@/container/guest/booking/types";
import {
  extractListRows,
  isApiSuccess,
} from "@/container/guest/shared/types";
import { cn } from "@/lib/utils";

type SearchFormValues = {
  keyword: string;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  formItemClassName?: string;
  /** Called when a booking is picked from the search panel */
  onSelect?: (booking: Booking) => void;
};

export default function BookingSearchField<T extends FieldValues>({
  control,
  name,
  label = "Booking number",
  placeholder = "Enter or search booking number",
  disabled = false,
  isRequired = false,
  formItemClassName,
  onSelect,
}: Props<T>) {
  const { setValue, getValues, clearErrors } = useFormContext();
  const searchForm = useForm<SearchFormValues>({
    defaultValues: { keyword: "" },
  });
  const keyword =
    useWatch({ control: searchForm.control, name: "keyword" }) || "";

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Booking[]>([]);
  const [searched, setSearched] = useState(false);

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const haystack = [
        row.Booking_No,
        row.Guest_Name,
        row.Contact_No,
        row.Room_TName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [keyword, rows]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBookingListAPI();
      if (isApiSuccess(response)) {
        const data = extractListRows<Booking>(
          response as unknown as Record<string, unknown>,
        ).filter((row) => Number(row.Status) === 1);
        setRows(data);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleOpenSearch = () => {
    if (disabled) return;
    searchForm.reset({ keyword: "" });
    setRows([]);
    setSearched(false);
    setOpen(true);
  };

  const handlePick = (booking: Booking) => {
    const bookingNo = booking.Booking_No || "";
    setValue(name, bookingNo as never, {
      shouldDirty: true,
      shouldValidate: false,
    });
    clearErrors();
    onSelect?.(booking);
    setOpen(false);
  };

  const searchPanel =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-200 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-search-title"
          >
            <button
              type="button"
              aria-label="Close booking search"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <div className="relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10">
              <div className="shrink-0 space-y-1 border-b border-border px-4 py-4">
                <h2
                  id="booking-search-title"
                  className="font-heading text-base font-medium"
                >
                  Search bookings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Find an active booking and select it to fill the reservation.
                </p>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                <Form {...searchForm}>
                  <form
                    className="flex flex-col gap-2 sm:flex-row sm:items-end"
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void loadBookings();
                    }}
                  >
                    {/* Search input */}
                    <div className="min-w-0 flex-1">
                      <InputField
                        control={searchForm.control}
                        name="keyword"
                        label="Search"
                        placeholder="Booking no, guest name, or contact"
                        
                        startContent={<Search className="size-4" />}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mb-0.5 h-10 shrink-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <PageLoader variant="button" light />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="overflow-hidden rounded-[0.625rem] border border-border bg-background">
                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <PageLoader variant="section" />
                    </div>
                  ) : filteredRows.length === 0 ? (
                    <p className="px-4 py-12 text-center text-sm text-muted-foreground">
                      {searched
                        ? "No bookings found."
                        : 'Click "Search" to load bookings.'}
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking no.</TableHead>
                          <TableHead>Guest</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Room type
                          </TableHead>
                          <TableHead>Check-in</TableHead>
                          <TableHead className="w-22.5 text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row) => {
                          const selected =
                            String(getValues(name) || "") ===
                            String(row.Booking_No || "");
                          return (
                            <TableRow
                              key={row.Booking_Id || row.Booking_No}
                              data-state={selected ? "selected" : undefined}
                            >
                              <TableCell className="font-medium">
                                {row.Booking_No}
                              </TableCell>
                              <TableCell>{row.Guest_Name}</TableCell>
                              <TableCell>{row.Contact_No}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {row.Room_TName || "—"}
                              </TableCell>
                              <TableCell>
                                {row.CheckIn_Date || row.Checkin_Date || "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={selected ? "default" : "outline"}
                                  onClick={() => handlePick(row)}
                                >
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 justify-end border-t border-border bg-muted/50 p-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
    {/* Booking number input */}
      <InputField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        isRequired={isRequired}
        formItemClassName={formItemClassName}
        isBlurUpdate
        endContent={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            className={cn(
              "-mr-1 shrink-0 text-muted-foreground hover:text-primary",
              disabled &&
                "pointer-events-auto cursor-not-allowed disabled:pointer-events-auto disabled:cursor-not-allowed",
            )}
            onClick={handleOpenSearch}
            aria-label="Search bookings"
          >
            <Search className="size-4" />
          </Button>
        }
      />

      {searchPanel}
    </>
  );
}
