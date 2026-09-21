import PaymentContainer from "@/container/guest/payment";

export const metadata = {
  title: "Payment | Innap",
  description: "Track collections received against reservations.",
};

export default function PaymentPage() {
  return <PaymentContainer />;
}
