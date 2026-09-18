import PriceManagerContainer from "@/container/org/priceManager";

export const metadata = {
  title: "Price Manager | Innap",
  description: "Manage regular weekday rates and special event pricing.",
};

export default function PriceManagerPage() {
  return <PriceManagerContainer />;
}
