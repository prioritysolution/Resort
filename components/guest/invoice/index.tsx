"use client";

import { ReceiptText } from "lucide-react";
import { EmptyState, ListPageFrame, PageLoader } from "@/components/shared";
import type { useInvoice } from "@/container/guest/invoice/Hooks";
import InvoiceToolbar from "./InvoiceToolbar";
import InvoiceBill from "./InvoiceBill";

type Props = ReturnType<typeof useInvoice>;

export function InvoiceView(props: Props) {
  return (
    <ListPageFrame
      title="Invoices"
      description="Search a reservation to view its checkout bill."
      toolbar={
        <InvoiceToolbar
          form={props.form}
          loading={props.loading}
          onSubmit={props.search}
        />
      }
    >
      {props.loading ? (
        <PageLoader variant="section" label="Loading invoice" />
      ) : props.bills.length > 0 ? (
        props.bills.map((bill, index) => (
          <InvoiceBill
            key={bill.Checkout_Id || bill.Bill_No || index}
            bill={bill}
          />
        ))
      ) : (
        <EmptyState
          icon={<ReceiptText className="size-5" />}
          title={props.searched ? "No invoice found" : "Search an invoice"}
          description={
            props.searched
              ? "This reservation has no checkout bill yet."
              : "Enter a reservation number and click Search."
          }
        />
      )}
    </ListPageFrame>
  );
}

export default InvoiceView;
