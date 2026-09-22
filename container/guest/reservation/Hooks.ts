"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format, isValid } from "date-fns";
import toast from "react-hot-toast";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import {
  apiMessage,
  extractDetails,
  extractListRows,
  isApiSuccess,
} from "@/container/guest/shared/types";
import { getBookingDetailsAPI } from "@/container/guest/booking/BookingApis";
import type { Booking } from "@/container/guest/booking/types";
import { getRoomDetailsListAPI } from "@/container/org/roomDetails/RoomDetailsApis";
import type { RoomDetail } from "@/container/org/roomDetails/types";
import { getTravelAgentListAPI } from "@/container/org/travelAgent/TravelAgentApis";
import {
  addReservationAPI,
  getReservationDetailsAPI,
  getReservationListAPI,
  updateReservationAPI,
} from "./ReservationApis";
import {
  emptyGuestValues,
  type Reservation,
  type ReservationFormValues,
  type ReservationGuestFormValues,
  type ReservationPayload,
  type ReservationRoomFormValues,
  type ReservationRoomRow,
} from "./types";

const toApiDate = (value: Date | string | null | undefined) => {
  if (!value) return "";
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : "";
  }
  const parsed = new Date(value);
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : String(value);
};

const toRoomsFormValues = (value: unknown): ReservationRoomFormValues[] => {
  if (Array.isArray(value) && value.length > 0) {
    const asRooms = value
      .map((row) => {
        if (typeof row === "number") {
          return Number.isFinite(row) && row > 0
            ? { room_id: row, extra_bed_no: 0 }
            : null;
        }
        if (!row || typeof row !== "object") return null;
        const record = row as ReservationRoomRow & { room_id?: number };
        const roomId = Number(record.room_id ?? record.Room_Id);
        if (!Number.isFinite(roomId) || roomId <= 0) return null;
        const extra = Number(record.extra_bed_no ?? record.Extra_Bed_No ?? 0);
        return {
          room_id: roomId,
          extra_bed_no: Number.isFinite(extra) && extra >= 0 ? extra : 0,
        };
      })
      .filter((row): row is ReservationRoomFormValues => row != null);
    if (asRooms.length) return asRooms;
  }

  if (Array.isArray(value)) {
    return value
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0)
      .map((room_id) => ({ room_id, extra_bed_no: 0 }));
  }

  const single = Number(value);
  return Number.isFinite(single) && single > 0
    ? [{ room_id: single, extra_bed_no: 0 }]
    : [];
};

const mapRoomOptions = (data: RoomDetail[]) =>
  data
    .filter((x) => Number(x.Status) === 1 && Number(x.Booking_Allowed) === 1)
    .map((x) => ({
      Id: x.Room_Id,
      Name: `${x.Room_No} — ${x.Room_TName}`,
    }));

const mapGuest = (
  g: NonNullable<Reservation["Guests"]>[number],
): ReservationGuestFormValues => ({
  guest_name: g.guest_name || g.Guest_Name || "",
  contact_no: g.contact_no || g.Contact_No || "",
  age: g.age ?? g.Age ?? "",
  gender: g.gender || g.Gender || "M",
  aadhar_no: g.aadhar_no || g.Aadhar_No || "",
  address: g.address || g.Address || "",
});

const emptyValues: ReservationFormValues = {
  booking_no: "",
  guest_name: "",
  contact_no: "",
  aadhar_no: "",
  address_1: "",
  address_2: "",
  age: "",
  gender: "M",
  is_primary: true,
  checkin_date: "",
  checkout_date: "",
  adult_no: 1,
  child_no: 0,
  rooms: [],
  advance_amount: "",
  amount: "",
  mode: 1,
  agent_id: "",
  special_request: "",
  guests: [],
};

const aadharNoSchema = yup
  .string()
  .default("")
  .test(
    "aadhar",
    "Aadhar number must be exactly 12 digits",
    (value) => {
      const trimmed = String(value ?? "").trim();
      if (!trimmed) return true;
      return /^\d{12}$/.test(trimmed);
    },
  );

const guestSchema = yup.object({
  guest_name: yup.string().required("Guest name is required"),
  contact_no: yup.string().required("Contact is required").max(25),
  age: yup
    .mixed<number | string>()
    .test("age", "Enter a valid age", (value) => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0 && n < 130;
    }),
  gender: yup.string().oneOf(["M", "F"]).required(),
  aadhar_no: aadharNoSchema,
  address: yup.string().default(""),
});

const schema = yup.object({
  booking_no: yup.string().default(""),
  guest_name: yup.string().required(),
  contact_no: yup.string().required().max(25),
  aadhar_no: aadharNoSchema,
  address_1: yup.string().default(""),
  address_2: yup.string().default(""),
  age: yup
    .mixed<number | string>()
    .test("age", "Enter a valid age", (value) => {
      if (value === "" || value == null) return true;
      const n = Number(value);
      return Number.isFinite(n) && n > 0 && n < 130;
    })
    .default(""),
  gender: yup.string().oneOf(["M", "F"]).default("M"),
  is_primary: yup.boolean().default(true),
  checkin_date: yup.mixed<string | Date>().required("Checkin date is required"),
  checkout_date: yup
    .mixed<string | Date>()
    .required("Checkout date is required")
    .test("after", "Checkout date must be after checkin date", function (value) {
      const checkin = toApiDate(this.parent.checkin_date);
      const checkout = toApiDate(value);
      return !checkin || !checkout || checkout > checkin;
    }),
  adult_no: yup.number().min(1).required(),
  child_no: yup.number().min(0).default(0),
  rooms: yup
    .array()
    .of(
      yup.object({
        room_id: yup.number().required(),
        extra_bed_no: yup.number().min(0).required(),
      }),
    )
    .min(1, "Select at least one room")
    .required(),
  advance_amount: yup
    .mixed<number | string>()
    .default("")
    .test("advance", "Enter a valid advance amount", (value) => {
      if (value === "" || value == null) return true;
      const n = Number(value);
      return !Number.isNaN(n) && n >= 0;
    }),
  amount: yup
    .mixed<number | string>()
    .default("")
    .test("amount", "Enter a valid amount", (value) => {
      if (value === "" || value == null) return true;
      const n = Number(value);
      return !Number.isNaN(n) && n >= 0;
    }),
  mode: yup.number().oneOf([1, 2, 3]).required(),
  agent_id: yup.mixed().default(""),
  special_request: yup.string().default(""),
  guests: yup.array().of(guestSchema).default([]),
});

export function useReservation() {
  const form = useForm<ReservationFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<ReservationFormValues>,
    defaultValues: emptyValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const guestForm = useForm<ReservationGuestFormValues>({
    resolver: yupResolver(
      guestSchema,
    ) as unknown as Resolver<ReservationGuestFormValues>,
    defaultValues: emptyGuestValues,
  });

  const [rooms, setRooms] = useState<Array<{ Id: number; Name: string }>>([]);
  const [agents, setAgents] = useState<Array<{ Id: number; Name: string }>>([]);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [editingGuestIndex, setEditingGuestIndex] = useState<number | null>(
    null,
  );
  const lastResolvedBookingNo = useRef("");

  const adultNo = form.watch("adult_no");
  const childNo = form.watch("child_no");
  const guests = form.watch("guests");
  const bookingNo = form.watch("booking_no");

  const maxAdditionalGuests = useMemo(() => {
    const adults = Number(adultNo) || 0;
    const children = Number(childNo) || 0;
    return Math.max(0, adults + children - 1);
  }, [adultNo, childNo]);

  const loadRooms = useCallback(async (roomType?: number | string) => {
    const roomResponse = await getRoomDetailsListAPI(roomType);
    setRooms(mapRoomOptions(roomResponse.data || []));
  }, []);

  const applyBooking = useCallback(
    async (booking: Booking, roomsFromApi?: RoomDetail[]) => {
      const bookingNoValue = booking.Booking_No || "";
      lastResolvedBookingNo.current = bookingNoValue;

      form.setValue("booking_no", bookingNoValue, {
        shouldDirty: true,
        shouldValidate: false,
      });
      // if (booking.Guest_Name) {
      //   form.setValue("guest_name", booking.Guest_Name, { shouldDirty: true });
      // }
      // if (booking.Contact_No) {
      //   form.setValue("contact_no", booking.Contact_No, { shouldDirty: true });
      // }
      // const checkin = booking.CheckIn_Date || booking.Checkin_Date;
      // if (checkin) {
      //   form.setValue("checkin_date", checkin, { shouldDirty: true });
      // }
      // const checkout = booking.ExpChkOut_Dt || booking.Exp_Chkout_Dt;
      // if (checkout) {
      //   form.setValue("checkout_date", checkout, { shouldDirty: true });
      // }
      // if (booking.Agent_Id) {
      //   form.setValue("agent_id", booking.Agent_Id, { shouldDirty: true });
      // }
      const advance =
        booking.Adv_Amount ?? booking.advance_amount ?? booking.Advance_Amount;
      if (advance != null && advance !== "") {
        form.setValue("advance_amount", advance, {
          shouldDirty: true,
          shouldValidate: false,
        });
      }
      // const mode = Number(
      //   booking.Adv_Mode ?? booking.advance_mode ?? booking.Advance_Mode,
      // );
      // if (mode === 1 || mode === 2 || mode === 3) {
      //   form.setValue("mode", mode, { shouldDirty: true });
      // }

      form.setValue("rooms", [], {
        shouldDirty: true,
        shouldValidate: false,
      });
      form.clearErrors();

      if (roomsFromApi && roomsFromApi.length > 0) {
        setRooms(mapRoomOptions(roomsFromApi));
        return;
      }

      if (booking.Room_TId) {
        await loadRooms(booking.Room_TId);
      } else {
        await loadRooms();
      }
    },
    [form, loadRooms],
  );

  const resolveBookingNo = useCallback(
    async (value: string) => {
      const bookingNoValue = value.trim();
      if (!bookingNoValue) {
        lastResolvedBookingNo.current = "";
        form.setValue("rooms", [], { shouldDirty: true });
        await loadRooms();
        return;
      }
      if (lastResolvedBookingNo.current === bookingNoValue) return;

      const response = await getBookingDetailsAPI(bookingNoValue);
      if (!isApiSuccess(response)) {
        toast.error(apiMessage(response, "Booking not found"));
        return;
      }

      const booking = extractDetails<Booking>(response.data ?? response, [
        "booking",
        "Booking",
      ]);
      if (!booking?.Booking_No && !booking?.Room_TId) {
        toast.error("Booking details not found");
        return;
      }

      const nestedRooms = Array.isArray(
        (response as { rooms?: unknown }).rooms,
      )
        ? ((response as { rooms: RoomDetail[] }).rooms || [])
        : [];

      const roomsFromData = extractListRows<RoomDetail>(
        (response.data && typeof response.data === "object"
          ? (response.data as Record<string, unknown>)
          : (response as unknown as Record<string, unknown>)) as Record<
          string,
          unknown
        >,
      ).filter((row) => row.Room_Id != null);

      await applyBooking(
        {
          ...booking,
          Booking_No: booking.Booking_No || bookingNoValue,
        },
        nestedRooms.length
          ? nestedRooms
          : roomsFromData.length
            ? roomsFromData
            : undefined,
      );
    },
    [applyBooking, form, loadRooms],
  );

  useEffect(() => {
    void Promise.all([getRoomDetailsListAPI(), getTravelAgentListAPI()]).then(
      ([roomResponse, travel]) => {
        setRooms(mapRoomOptions(roomResponse.data || []));
        setAgents(
          (travel.data || [])
            .filter((x) => Number(x.Status) === 1)
            .map((x) => ({ Id: x.Agent_Id, Name: x.Agent_Name })),
        );
      },
    );
  }, []);

  useEffect(() => {
    const value = String(bookingNo || "").trim();
    if (!value) {
      if (lastResolvedBookingNo.current) {
        lastResolvedBookingNo.current = "";
        void loadRooms();
      }
      return;
    }

    const timer = window.setTimeout(() => {
      void resolveBookingNo(value);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [bookingNo, loadRooms, resolveBookingNo]);

  useEffect(() => {
    const current = form.getValues("guests") || [];
    if (current.length > maxAdditionalGuests) {
    form.setValue("guests", current.slice(0, maxAdditionalGuests), {
        shouldValidate: false,
      });
    }
  }, [maxAdditionalGuests, form]);

  const openGuestDialog = (index: number | null = null) => {
    if (index == null && (guests?.length || 0) >= maxAdditionalGuests) {
      toast.error(
        maxAdditionalGuests === 0
          ? "Increase adults/children to add more guests"
          : `Maximum ${maxAdditionalGuests} additional guest(s) allowed`,
      );
      return;
    }
    setEditingGuestIndex(index);
    if (index != null && guests?.[index]) {
      guestForm.reset(guests[index]);
    } else {
      guestForm.reset(emptyGuestValues);
    }
    setGuestDialogOpen(true);
  };

  const closeGuestDialog = () => {
    setGuestDialogOpen(false);
    setEditingGuestIndex(null);
    guestForm.reset(emptyGuestValues);
  };

  const saveGuest = (values: ReservationGuestFormValues) => {
    const current = [...(form.getValues("guests") || [])];
    if (editingGuestIndex != null) {
      current[editingGuestIndex] = values;
    } else {
      if (current.length >= maxAdditionalGuests) {
        toast.error(
          `Maximum ${maxAdditionalGuests} additional guest(s) allowed`,
        );
        return;
      }
      current.push(values);
    }
    form.setValue("guests", current, {
      shouldValidate: false,
      shouldDirty: true,
    });
    closeGuestDialog();
  };

  const removeGuest = (index: number) => {
    const current = [...(form.getValues("guests") || [])];
    current.splice(index, 1);
    form.setValue("guests", current, {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

  const applySelectedBooking = useCallback(
    (booking: Booking) => {
      void applyBooking(booking);
    },
    [applyBooking],
  );

  const crud = useGuestCrud<
    Reservation,
    ReservationFormValues,
    ReservationPayload
  >({
    form,
    emptyValues,
    getList: getReservationListAPI,
    getDetails: (row) => getReservationDetailsAPI(row.Reservation_No || ""),
    detailKeys: ["reservation", "Reservation"],
    add: addReservationAPI,
    update: updateReservationAPI,
    getId: (row) => row.Reservation_Id,
    entityName: "reservations",
    toValues: (r) => {
      const fromRooms = toRoomsFormValues(r.Rooms ?? r.rooms);
      const rooms =
        fromRooms.length > 0
          ? fromRooms
          : toRoomsFormValues(r.Room_Ids ?? r.room_id ?? r.Room_Id).map(
              (row, index) =>
                index === 0
                  ? {
                      ...row,
                      extra_bed_no: Number(r.Extra_Bed_No || 0),
                    }
                  : row,
            );

      return {
        booking_no: r.Booking_No || (r.Booking_Id ? String(r.Booking_Id) : ""),
        guest_name: r.Guest_Name || "",
        contact_no: r.Contact_No || "",
        aadhar_no: r.Aadhar_No || "",
        address_1: r.Address_1 || "",
        address_2: r.Address_2 || "",
        age: r.Age ?? "",
        gender: r.Gender || "M",
        is_primary: Boolean(
          r.Is_Primary === true ||
            Number(r.Is_Primary) === 1 ||
            r.Is_Primary == null,
        ),
        checkin_date: r.CheckIn_Date || r.Checkin_Date || "",
        checkout_date: r.Checkout_Date || "",
        adult_no: r.Adult_No || 1,
        child_no: r.Child_No || 0,
        rooms,
        advance_amount:
          r.Adv_Amount ?? r.advance_amount ?? r.Advance_Amount ?? "",
        amount: r.Amount ?? r.amount ?? "",
        mode: Number(r.Mode ?? r.mode) || 1,
        agent_id: r.Agent_Id || "",
        special_request: r.Special_Request || "",
        guests: (r.Guests || r.guests || []).map(mapGuest),
      };
    },
    toPayload: (v) => {
      const rooms = toRoomsFormValues(v.rooms).map((row) => ({
        room_id: row.room_id,
        extra_bed_no: Number(row.extra_bed_no || 0),
      }));
      const advanceAmount =
        v.advance_amount === "" || v.advance_amount == null
          ? undefined
          : Number(v.advance_amount);
      const amount =
        v.amount === "" || v.amount == null ? undefined : Number(v.amount);
      const age = v.age === "" || v.age == null ? undefined : Number(v.age);
      const guestsPayload = (v.guests || [])
        .slice(0, Math.max(0, Number(v.adult_no) + Number(v.child_no || 0) - 1))
        .map((g) => ({
          guest_name: g.guest_name.trim(),
          contact_no: g.contact_no.trim(),
          age: Number(g.age),
          gender: g.gender,
          ...(g.aadhar_no.trim() ? { aadhar_no: g.aadhar_no.trim() } : {}),
          ...(g.address.trim() ? { address: g.address.trim() } : {}),
        }));

      return {
        ...(v.booking_no.trim() ? { booking_no: v.booking_no.trim() } : {}),
        guest_name: v.guest_name.trim(),
        contact_no: v.contact_no.trim(),
        ...(v.aadhar_no.trim() ? { aadhar_no: v.aadhar_no.trim() } : {}),
        ...(v.address_1.trim() ? { address_1: v.address_1.trim() } : {}),
        ...(v.address_2.trim() ? { address_2: v.address_2.trim() } : {}),
        ...(age != null && !Number.isNaN(age) ? { age } : {}),
        ...(v.gender ? { gender: v.gender } : {}),
        is_primary: v.is_primary ? 1 : 0,
        checkin_date: toApiDate(v.checkin_date),
        checkout_date: toApiDate(v.checkout_date),
        adult_no: Number(v.adult_no),
        child_no: Number(v.child_no || 0),
        rooms,
        ...(advanceAmount != null && !Number.isNaN(advanceAmount)
          ? { advance_amount: advanceAmount }
          : {}),
        ...(amount != null && !Number.isNaN(amount) ? { amount } : {}),
        mode: Number(v.mode),
        agent_id: v.agent_id ? Number(v.agent_id) : null,
        ...(v.special_request.trim()
          ? { special_request: v.special_request.trim() }
          : {}),
        ...(guestsPayload.length ? { guests: guestsPayload } : {}),
      };
    },
  });

  useEffect(() => {
    if (!crud.dialogOpen) {
      setGuestDialogOpen(false);
      setEditingGuestIndex(null);
      guestForm.reset(emptyGuestValues);
      lastResolvedBookingNo.current = "";
    }
  }, [crud.dialogOpen, guestForm]);

  return {
    ...crud,
    rooms,
    agents,
    guestForm,
    guestDialogOpen,
    editingGuestIndex,
    maxAdditionalGuests,
    openGuestDialog,
    closeGuestDialog,
    saveGuest,
    removeGuest,
    applySelectedBooking,
  };
}
