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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageLoader } from "@/components/shared";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import TextareaField from "@/common/formFields/TextareaField";
import DatePicker from "@/common/formFields/DatePicker";
import CheckboxField from "@/common/formFields/CheckboxField";
import RadioField from "@/common/formFields/RadioField";
import BookingSearchField from "@/common/Searchable/BookingSearchField";
import {
  RESERVATION_GENDER_OPTIONS,
  RESERVATION_PAYMENT_MODES,
  type Reservation,
  type ReservationFormValues,
  type ReservationGuestFormValues,
} from "@/container/guest/reservation/types";
import type { Booking } from "@/container/guest/booking/types";
import ReservationGuestDialog from "./ReservationGuestDialog";
import ReservationRoomsField from "./ReservationRoomsField";
import { preventEnterSubmit } from "@/common/formFields/preventEnterSubmit";

type Props = {
  open: boolean;
  form: UseFormReturn<ReservationFormValues>;
  editing: Reservation | null;
  saving: boolean;
  rooms: Array<{ Id: number; Name: string }>;
  agents: Array<{ Id: number; Name: string }>;
  guestForm: UseFormReturn<ReservationGuestFormValues>;
  guestDialogOpen: boolean;
  editingGuestIndex: number | null;
  maxAdditionalGuests: number;
  onClose: () => void;
  onSubmit: (v: ReservationFormValues) => void;
  onOpenGuestDialog: (index?: number | null) => void;
  onCloseGuestDialog: () => void;
  onSaveGuest: (v: ReservationGuestFormValues) => void;
  onRemoveGuest: (index: number) => void;
  onSelectBooking: (booking: Booking) => void;
};

export default function ReservationFormDialog({
  open,
  form,
  editing,
  saving,
  rooms,
  agents,
  guestForm,
  guestDialogOpen,
  editingGuestIndex,
  maxAdditionalGuests,
  onClose,
  onSubmit,
  onOpenGuestDialog,
  onCloseGuestDialog,
  onSaveGuest,
  onRemoveGuest,
  onSelectBooking,
}: Props) {
  const guests = form.watch("guests") || [];
  const canAddGuest = guests.length < maxAdditionalGuests;

  return (
    <>
      <Dialog open={open} disablePointerDismissal>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
        >
          <DialogHeader className="shrink-0 px-4 pt-4">
            <DialogTitle>
              {editing ? "Edit reservation" : "Add reservation"}
            </DialogTitle>
            <DialogDescription>
              Leave booking number blank for a walk-in. Select one or more rooms
              and optionally add companion guests.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onKeyDown={preventEnterSubmit}
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <BookingSearchField
                    control={form.control}
                    name="booking_no"
                    label="Booking number"
                    placeholder="Enter or search booking number"
                    onSelect={onSelectBooking}
                  />
                  <InputField
                    control={form.control}
                    name="guest_name"
                    label="Guest name"
                    isRequired
                    placeholder="Enter guest name"
                  />
                  <InputField
                    control={form.control}
                    name="contact_no"
                    label="Contact number"
                    maxLength={25}
                    digitsOnly
                    isRequired
                    placeholder="Enter contact number"
                  />
                  <InputField
                    control={form.control}
                    name="aadhar_no"
                    label="Aadhar number"
                    placeholder="Enter 12-digit aadhar number"
                    digitsOnly
                    maxLength={12}
                  />
                  <TextareaField
                    control={form.control}
                    name="address_1"
                    label="Address line 1"
                    placeholder="Enter address line 1"
                  />
                  <TextareaField
                    control={form.control}
                    name="address_2"
                    label="Address line 2"
                    placeholder="Enter address line 2"
                  />
                  <InputField
                    control={form.control}
                    name="age"
                    label="Age"
                    type="number"
                    placeholder="Enter age"
                  />
                  <DropdownField
                    control={form.control}
                    name="gender"
                    label="Gender"
                    options={[...RESERVATION_GENDER_OPTIONS]}
                    optionLabelKey="Name"
                  />
                  <div className="sm:col-span-2">
                    <CheckboxField
                      control={form.control}
                      name="is_primary"
                      label="Primary guest"
                      description="Default on for the main guest on this reservation."
                    />
                  </div>
                  <DatePicker
                    control={form.control}
                    name="checkin_date"
                    label="Check-in date"
                    placeholder="Select check-in date"
                    isRequired
                    disablePast
                  />
                  <DatePicker
                    control={form.control}
                    name="checkout_date"
                    label="Planned checkout"
                    placeholder="Select checkout date"
                    isRequired
                    disablePast
                  />
                  <InputField
                    control={form.control}
                    name="adult_no"
                    label="Adults"
                    type="number"
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name="child_no"
                    label="Children"
                    type="number"
                  />
                  <div className="sm:col-span-2">
                    <ReservationRoomsField
                      control={form.control}
                      name="rooms"
                      label="Rooms"
                      options={rooms}
                      placeholder="Select one or more rooms"
                      isRequired
                    />
                  </div>
                  <DropdownField
                    control={form.control}
                    name="agent_id"
                    label="Travel agent"
                    options={agents}
                    optionLabelKey="Name"
                  />
                  <InputField
                    control={form.control}
                    name="advance_amount"
                    label="Advance amount"
                    type="number"
                    placeholder="Enter advance amount"
                    disabled={true}
                  />
                  <InputField
                    control={form.control}
                    name="amount"
                    label="Amount"
                    type="number"
                    placeholder="Enter amount"
                  />
                  <RadioField
                    control={form.control}
                    name="mode"
                    label="Payment mode"
                    options={[...RESERVATION_PAYMENT_MODES]}
                    formItemClassName="sm:col-span-2"
                  />
                  <div className="sm:col-span-2">
                    <TextareaField
                      control={form.control}
                      name="special_request"
                      label="Special request"
                      placeholder="Enter special request"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-3 rounded-[0.625rem] border border-border bg-chrome p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Additional guests (Optional)
                        </p>
                        
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!canAddGuest}
                        onClick={() => onOpenGuestDialog(null)}
                      >
                        <Plus className="size-4" />
                        Add guest
                      </Button>
                    </div>

                    {guests.length === 0 ? (
                      <p className="rounded-[0.625rem] border border-dashed border-border bg-background px-3 py-6 text-center text-sm text-muted-foreground">
                        No additional guests yet.
                      </p>
                    ) : (
                      <div className="overflow-hidden rounded-[0.625rem] border border-border bg-background">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Age</TableHead>
                              <TableHead>Gender</TableHead>
                              <TableHead className="w-22.5 text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {guests.map((guest, index) => (
                              <TableRow key={`${guest.guest_name}-${index}`}>
                                <TableCell className="font-medium">
                                  {guest.guest_name}
                                </TableCell>
                                <TableCell>{guest.contact_no}</TableCell>
                                <TableCell>{guest.age}</TableCell>
                                <TableCell>
                                  {guest.gender === "F" ? "Female" : "Male"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => onOpenGuestDialog(index)}
                                      aria-label="Edit guest"
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => onRemoveGuest(index)}
                                      aria-label="Remove guest"
                                    >
                                      <Trash2 className="size-3.5 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
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

      <ReservationGuestDialog
        open={guestDialogOpen}
        form={guestForm}
        editing={editingGuestIndex != null}
        primaryAddress={[form.watch("address_1"), form.watch("address_2")]
          .map((part) => String(part || "").trim())
          .filter(Boolean)
          .join(", ")}
        onClose={onCloseGuestDialog}
        onSubmit={onSaveGuest}
      />
    </>
  );
}
