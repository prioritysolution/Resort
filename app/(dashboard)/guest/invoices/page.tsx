import InvoiceContainer from "@/container/guest/invoice";

export const metadata = {
  title: "Invoices | Innap",
  description: "View checkout invoices by reservation number.",
};

export default function InvoicesPage() {
  return <InvoiceContainer />;
}
