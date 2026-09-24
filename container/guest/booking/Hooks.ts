"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addDays, format, isValid } from "date-fns";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import { getRoomTypeListAPI } from "@/container/org/roomType/RoomTypeApis";
import { getTravelAgentListAPI } from "@/container/org/travelAgent/TravelAgentApis";
import {
  addBookingAPI,
  cancelBookingAPI,
  getBookingDetailsAPI,
  getBookingListAPI,
  updateBookingAPI,
} from "./BookingApis";
import type { Booking, BookingFormValues, BookingPayload } from "./types";

const toApiDate = (value: Date | string | null | undefined) => {
  if (!value) return "";
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : "";
  }
  const parsed = new Date(value);
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : String(value);
};

const parseDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  const parsed = new Date(value);
  return isValid(parsed) ? parsed : null;
};

const emptyValues: BookingFormValues = {
  guest_name: "",
  contact_no: "",
  room_tid: "",
  no_of_room: 1,
  checkin_date: "",
  stay_duration: 1,
  exp_chkout_dt: "",
  agent_id: "",
  note: "",
  advance_amount: "",
  advance_mode: 1,
  is_refundable: false,
};

const schema = yup.object({
  guest_name: yup.string().trim().required("Guest name is required"),
  contact_no: yup
    .string()
    .trim()
    .required("Contact number is required")
    .max(15, "Contact number must be at most 15 characters"),
  room_tid: yup.mixed().required("Room type is required"),
  no_of_room: yup
    .number()
    .typeError("Number of rooms is required")
    .min(1, "At least 1 room is required")
    .required("Number of rooms is required"),
  checkin_date: yup.mixed<string | Date>().required("Check-in date is required"),
  stay_duration: yup
    .number()
    .typeError("Stay duration is required")
    .min(1, "Stay duration must be at least 1 night")
    .required("Stay duration is required"),
  exp_chkout_dt: yup.mixed<string | Date>().nullable().default(""),
  agent_id: yup.mixed().default(""),
  note: yup.string().default(""),
  advance_amount: yup
    .mixed<number | string>()
    .default("")
    .test("advance", "Enter a valid advance amount", (value) => {
      if (value === "" || value == null) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  advance_mode: yup
    .number()
    .oneOf([1, 2, 3], "Select Cash, Bank, or Credit")
    .required("Payment mode is required"),
  is_refundable: yup.boolean().required().default(false),
});

export function useBooking() {
  const form = useForm<BookingFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<BookingFormValues>,
    defaultValues: emptyValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const checkinDate = form.watch("checkin_date");
  const stayDuration = form.watch("stay_duration");

  useEffect(() => {
    const checkin = parseDate(checkinDate);
    const nights = Number(stayDuration);
    if (!checkin || !Number.isFinite(nights) || nights < 1) {
      form.setValue("exp_chkout_dt", "", { shouldValidate: false });
      return;
    }
    const checkout = addDays(checkin, nights);
    checkout.setHours(12, 0, 0, 0);
    form.setValue("exp_chkout_dt", checkout, { shouldValidate: false });
  }, [checkinDate, stayDuration, form]);

  const [roomTypes, setRoomTypes] = useState<
    Array<{ Id: number; Name: string }>
  >([]);
  const [agents, setAgents] = useState<Array<{ Id: number; Name: string }>>([]);
  useEffect(() => {
    void Promise.all([getRoomTypeListAPI(), getTravelAgentListAPI()]).then(
      ([rooms, travel]) => {
        setRoomTypes(
          (rooms.data || [])
            .filter((x) => Number(x.Status) === 1)
            .map((x) => ({ Id: x.Room_TId, Name: x.Room_TName })),
        );
        setAgents(
          (travel.data || [])
            .filter((x) => Number(x.Status) === 1)
            .map((x) => ({ Id: x.Agent_Id, Name: x.Agent_Name })),
        );
      },
    );
  }, []);
  const crud = useGuestCrud<Booking, BookingFormValues, BookingPayload>({
    form,
    emptyValues,
    getList: getBookingListAPI,
    getDetails: (row) => getBookingDetailsAPI(row.Booking_No || ""),
    detailKeys: ["booking", "Booking"],
    add: addBookingAPI,
    update: updateBookingAPI,
    remove: cancelBookingAPI,
    getId: (row) => row.Booking_Id,
    clientSearch: true,
    entityName: "bookings",
    toValues: (row) => ({
      guest_name: row.Guest_Name || "",
      contact_no: row.Contact_No || "",
      room_tid: row.Room_TId || "",
      no_of_room: row.NoOf_Room ?? row.No_Of_Room ?? 1,
      checkin_date: row.CheckIn_Date || row.Checkin_Date || "",
      stay_duration: row.Stay_Duration || 1,
      exp_chkout_dt: row.ExpChkOut_Dt || row.Exp_Chkout_Dt || "",
      agent_id: row.Agent_Id || "",
      note: row.Note || "",
      advance_amount:
        row.Adv_Amount ?? row.advance_amount ?? row.Advance_Amount ?? "",
      advance_mode:
        Number(row.Adv_Mode ?? row.advance_mode ?? row.Advance_Mode) || 1,
      is_refundable: Boolean(
        row.Is_Refundable === true ||
          Number(row.Is_Refundable) === 1 ||
          row.is_refundable === true ||
          Number(row.is_refundable) === 1,
      ),
    }),
    toPayload: (v) => {
      const advanceAmount =
        v.advance_amount === "" || v.advance_amount == null
          ? undefined
          : Number(v.advance_amount);
      const checkin = toApiDate(v.checkin_date);
      const nights = Number(v.stay_duration);
      const parsedCheckin = parseDate(v.checkin_date);
      const derivedCheckout =
        parsedCheckin && Number.isFinite(nights) && nights >= 1
          ? toApiDate(addDays(parsedCheckin, nights))
          : toApiDate(v.exp_chkout_dt);
      return {
        guest_name: v.guest_name.trim(),
        contact_no: v.contact_no.trim(),
        room_tid: Number(v.room_tid),
        no_of_room: Number(v.no_of_room),
        checkin_date: checkin,
        stay_duration: nights,
        ...(derivedCheckout ? { exp_chkout_dt: derivedCheckout } : {}),
        agent_id: v.agent_id ? Number(v.agent_id) : null,
        ...(v.note.trim() ? { note: v.note.trim() } : {}),
        ...(advanceAmount != null && !Number.isNaN(advanceAmount)
          ? { advance_amount: advanceAmount }
          : {}),
        advance_mode: Number(v.advance_mode),
        is_refundable: Boolean(v.is_refundable),
      };
    },
  });
  return { ...crud, roomTypes, agents };
}
