import ServiceOrderContainer from "@/container/guest/service-order";

export const metadata = {
  title: "Service Order | Innap",
  description: "Manage paid guest service orders.",
};

export default function ServiceOrderPage() {
  return <ServiceOrderContainer />;
}
