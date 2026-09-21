"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
};
const schema = yup.object({
  guest_name: yup.string().required(),
  contact_no: yup.string().required().max(15),
  room_tid: yup.mixed().required(),
  no_of_room: yup.number().min(1).required(),
  checkin_date: yup.string().required(),
  stay_duration: yup.number().min(1).required(),
  exp_chkout_dt: yup.string().default(""),
  agent_id: yup.mixed().default(""),
  note: yup.string().default(""),
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
    }),
    toPayload: (v) => ({
      guest_name: v.guest_name.trim(),
      contact_no: v.contact_no.trim(),
      room_tid: Number(v.room_tid),
      no_of_room: Number(v.no_of_room),
      checkin_date: v.checkin_date,
      stay_duration: Number(v.stay_duration),
      ...(v.exp_chkout_dt ? { exp_chkout_dt: v.exp_chkout_dt } : {}),
      agent_id: v.agent_id ? Number(v.agent_id) : null,
      ...(v.note.trim() ? { note: v.note.trim() } : {}),
    }),
  });
  return { ...crud, roomTypes, agents };
}
