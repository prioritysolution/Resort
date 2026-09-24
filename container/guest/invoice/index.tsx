"use client";

import InvoiceView from "@/components/guest/invoice";
import { useInvoice } from "./Hooks";

export default function InvoiceContainer() {
  return <InvoiceView {...useInvoice()} />;
}
