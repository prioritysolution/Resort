"use client";

import ReservationView from "@/components/guest/reservation";
import { useReservation } from "./Hooks";

export default function ReservationContainer() {
  return <ReservationView {...useReservation()} />;
}
