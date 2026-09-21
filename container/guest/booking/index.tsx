"use client";

import BookingView from "@/components/guest/booking";
import { useBooking } from "./Hooks";

export default function BookingContainer() {
  return <BookingView {...useBooking()} />;
}
