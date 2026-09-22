import BookingRegisterContainer from "@/container/reports/booking-register";

export const metadata = {
  title: "Booking register | Innap",
  description: "Booking created-date report by month or date range.",
};

export default function BookingRegisterPage() {
  return <BookingRegisterContainer />;
}
