"use client";

import PaymentView from "@/components/guest/payment";
import { usePayment } from "./Hooks";

export default function PaymentContainer() {
  return <PaymentView {...usePayment()} />;
}
