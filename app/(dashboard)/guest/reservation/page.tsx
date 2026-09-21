import ReservationContainer from "@/container/guest/reservation";

export const metadata = {
  title: "Reservation | Innap",
  description: "Allot rooms for walk-ins or existing bookings.",
};

export default function ReservationPage() {
  return <ReservationContainer />;
}
