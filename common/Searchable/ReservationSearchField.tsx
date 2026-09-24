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
import { getReservationListAPI } from "@/container/guest/reservation/ReservationApis";
import type { Reservation } from "@/container/guest/reservation/types";
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
  onSelect?: (reservation: Reservation) => void;
};

export default function ReservationSearchField<T extends FieldValues>({
  control,
  name,
  label = "Reservation number",
  placeholder = "Enter or search reservation number",
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
  const [rows, setRows] = useState<Reservation[]>([]);
  const [searched, setSearched] = useState(false);

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const haystack = [
        row.Reservation_No,
        row.Guest_Name,
        row.Contact_No,
        row.Room_No,
        row.Booking_No,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [keyword, rows]);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReservationListAPI();
      if (isApiSuccess(response)) {
        const data = extractListRows<Reservation>(
          response as unknown as Record<string, unknown>,
        ).filter((row) => row.Status == null || Number(row.Status) === 1);
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

  const handlePick = (reservation: Reservation) => {
    const reservationNo = reservation.Reservation_No || "";
    setValue(name, reservationNo as never, {
      shouldDirty: true,
      shouldValidate: false,
    });
    clearErrors();
    onSelect?.(reservation);
    setOpen(false);
  };

  const searchPanel =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-200 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-search-title"
          >
            <button
              type="button"
              aria-label="Close reservation search"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <div className="relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10">
              <div className="shrink-0 space-y-1 border-b border-border px-4 py-4">
                <h2
                  id="reservation-search-title"
                  className="font-heading text-base font-medium"
                >
                  Search reservations
                </h2>
                <p className="text-sm text-muted-foreground">
                  Find an active reservation and select it to fill the number.
                </p>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                <Form {...searchForm}>
                  <form
                    className="flex flex-col gap-2 sm:flex-row sm:items-end"
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void loadReservations();
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <InputField
                        control={searchForm.control}
                        name="keyword"
                        label="Search"
                        placeholder="Reservation no, guest name, or contact"
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
                        ? "No reservations found."
                        : 'Click "Search" to load reservations.'}
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reservation no.</TableHead>
                          <TableHead>Guest</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Room
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
                            String(row.Reservation_No || "");
                          return (
                            <TableRow
                              key={row.Reservation_Id || row.Reservation_No}
                              data-state={selected ? "selected" : undefined}
                            >
                              <TableCell className="font-medium">
                                {row.Reservation_No}
                              </TableCell>
                              <TableCell>{row.Guest_Name}</TableCell>
                              <TableCell>{row.Contact_No}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {row.Room_No || "—"}
                              </TableCell>
                              <TableCell>
                                {row.CheckIn_Date ||
                                  row.Checkin_Date ||
                                  row.checkin_date ||
                                  "—"}
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
            aria-label="Search reservations"
          >
            <Search className="size-4" />
          </Button>
        }
      />
      {searchPanel}
    </>
  );
}
