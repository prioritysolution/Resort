"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import { getRoomDetailsListAPI } from "@/container/org/roomDetails/RoomDetailsApis";
import { getTravelAgentListAPI } from "@/container/org/travelAgent/TravelAgentApis";
import {
  addReservationAPI,
  getReservationDetailsAPI,
  getReservationListAPI,
  updateReservationAPI,
} from "./ReservationApis";
import type {
  Reservation,
  ReservationFormValues,
  ReservationPayload,
} from "./types";

const emptyValues: ReservationFormValues = {
  booking_no: "",
  guest_name: "",
  contact_no: "",
  aadhar_no: "",
  address_1: "",
  address_2: "",
  checkin_date: "",
  checkout_date: "",
  adult_no: 1,
  child_no: 0,
  room_id: "",
  room_ids: "",
  extra_bed_no: 0,
  agent_id: "",
  special_request: "",
};
const schema = yup.object({
  booking_no: yup.string().default(""),
  guest_name: yup.string().required(),
  contact_no: yup.string().required().max(25),
  aadhar_no: yup.string().default(""),
  address_1: yup.string().default(""),
  address_2: yup.string().default(""),
  checkin_date: yup.string().required(),
  checkout_date: yup
    .string()
    .required()
    .test("after", "Checkout must be after check-in", function (value) {
      return (
        !value || !this.parent.checkin_date || value > this.parent.checkin_date
      );
    }),
  adult_no: yup.number().min(1).required(),
  child_no: yup.number().min(0).default(0),
  room_id: yup
    .mixed()
    .test("room", "Select a room or enter room IDs", function (v) {
      return Boolean(v || this.parent.room_ids);
    }),
  room_ids: yup.string().default(""),
  extra_bed_no: yup.number().min(0).default(0),
  agent_id: yup.mixed().default(""),
  special_request: yup.string().default(""),
});
export function useReservation() {
  const form = useForm<ReservationFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<ReservationFormValues>,
    defaultValues: emptyValues,
  });
  const [rooms, setRooms] = useState<Array<{ Id: number; Name: string }>>([]);
  const [agents, setAgents] = useState<Array<{ Id: number; Name: string }>>([]);
  useEffect(() => {
    void Promise.all([getRoomDetailsListAPI(), getTravelAgentListAPI()]).then(
      ([roomResponse, travel]) => {
        setRooms(
          (roomResponse.data || [])
            .filter(
              (x) => Number(x.Status) === 1 && Number(x.Booking_Allowed) === 1,
            )
            .map((x) => ({
              Id: x.Room_Id,
              Name: `${x.Room_No} — ${x.Room_TName}`,
            })),
        );
        setAgents(
          (travel.data || [])
            .filter((x) => Number(x.Status) === 1)
            .map((x) => ({ Id: x.Agent_Id, Name: x.Agent_Name })),
        );
      },
    );
  }, []);
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
    toValues: (r) => ({
      booking_no: r.Booking_No || (r.Booking_Id ? String(r.Booking_Id) : ""),
      guest_name: r.Guest_Name || "",
      contact_no: r.Contact_No || "",
      aadhar_no: r.Aadhar_No || "",
      address_1: r.Address_1 || "",
      address_2: r.Address_2 || "",
      checkin_date: r.CheckIn_Date || r.Checkin_Date || "",
      checkout_date: r.Checkout_Date || "",
      adult_no: r.Adult_No || 1,
      child_no: r.Child_No || 0,
      room_id: r.Room_Id || "",
      room_ids: (r.Room_Ids || []).join(","),
      extra_bed_no: r.Extra_Bed_No || 0,
      agent_id: r.Agent_Id || "",
      special_request: r.Special_Request || "",
    }),
    toPayload: (v) => {
      const ids = v.room_ids
        .split(",")
        .map(Number)
        .filter((id) => id > 0);
      return {
        ...(v.booking_no.trim() ? { booking_no: v.booking_no.trim() } : {}),
        guest_name: v.guest_name.trim(),
        contact_no: v.contact_no.trim(),
        ...(v.aadhar_no.trim() ? { aadhar_no: v.aadhar_no.trim() } : {}),
        ...(v.address_1.trim() ? { address_1: v.address_1.trim() } : {}),
        ...(v.address_2.trim() ? { address_2: v.address_2.trim() } : {}),
        checkin_date: v.checkin_date,
        checkout_date: v.checkout_date,
        adult_no: Number(v.adult_no),
        child_no: Number(v.child_no || 0),
        ...(ids.length
          ? { room_ids: ids, no_of_room: ids.length }
          : { room_id: Number(v.room_id) }),
        extra_bed_no: Number(v.extra_bed_no || 0),
        agent_id: v.agent_id ? Number(v.agent_id) : null,
        ...(v.special_request.trim()
          ? { special_request: v.special_request.trim() }
          : {}),
      };
    },
  });
  return { ...crud, rooms, agents };
}
