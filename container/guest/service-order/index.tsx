"use client";

import ServiceOrderView from "@/components/guest/service-order";
import { useServiceOrder } from "./Hooks";

export default function ServiceOrderContainer() {
  return <ServiceOrderView {...useServiceOrder()} />;
}
