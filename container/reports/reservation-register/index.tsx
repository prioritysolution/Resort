"use client";

import ReservationRegisterView from "@/components/reports/reservation-register";
import { useReservationRegister } from "./Hooks";

export default function ReservationRegisterContainer() {
  return <ReservationRegisterView {...useReservationRegister()} />;
}
