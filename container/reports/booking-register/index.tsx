"use client";

import BookingRegisterView from "@/components/reports/booking-register";
import { useBookingRegister } from "./Hooks";

export default function BookingRegisterContainer() {
  return <BookingRegisterView {...useBookingRegister()} />;
}
