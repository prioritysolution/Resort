"use client";

import CheckoutView from "@/components/guest/checkout";
import { useCheckout } from "./Hooks";

export default function CheckoutContainer() {
  return <CheckoutView {...useCheckout()} />;
}
