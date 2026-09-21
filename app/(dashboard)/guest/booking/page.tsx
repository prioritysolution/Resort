import BookingContainer from "@/container/guest/booking";

export const metadata = {
  title: "Booking | Innap",
  description: "Manage upcoming guest bookings and cancellations.",
};

export default function BookingPage() {
  return <BookingContainer />;
}
