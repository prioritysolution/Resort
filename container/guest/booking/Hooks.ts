"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format, isValid } from "date-fns";
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
  guest_name: yup.string().required(),
  contact_no: yup.string().required().max(15),
  room_tid: yup.mixed().required(),
  no_of_room: yup.number().min(1).required(),
  checkin_date: yup.mixed<string | Date>().required("Check-in date is required"),
  stay_duration: yup.number().min(1).required(),
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
    .required(),
  is_refundable: yup.boolean().required().default(false),
});

export function useBooking() {
  const form = useForm<BookingFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<BookingFormValues>,
    defaultValues: emptyValues,
  });
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
      advance_amount: row.Advance_Amount ?? "",
      advance_mode: Number(row.Advance_Mode) || 1,
      is_refundable: Boolean(
        row.Is_Refundable === true || Number(row.Is_Refundable) === 1,
      ),
    }),
    toPayload: (v) => {
      const advanceAmount =
        v.advance_amount === "" || v.advance_amount == null
          ? undefined
          : Number(v.advance_amount);
      const checkinDate = toApiDate(v.checkin_date);
      const expChkoutDt = toApiDate(v.exp_chkout_dt);
      return {
        guest_name: v.guest_name.trim(),
        contact_no: v.contact_no.trim(),
        room_tid: Number(v.room_tid),
        no_of_room: Number(v.no_of_room),
        checkin_date: checkinDate,
        stay_duration: Number(v.stay_duration),
        ...(expChkoutDt ? { exp_chkout_dt: expChkoutDt } : {}),
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
