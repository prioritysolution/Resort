import ReservationRegisterContainer from "@/container/reports/reservation-register";

export const metadata = {
  title: "Reservation register | Innap",
  description:
    "Reservation report by created date, month, or reservation number.",
};

export default function ReservationRegisterPage() {
  return <ReservationRegisterContainer />;
}
