import React, { forwardRef } from "react";
import { format, isValid, parseISO } from "date-fns";

type Props = {
  bill: any;
  hotelName: string;
};

const displayDate = (value?: string) => {
  if (!value) return "—";
  const parsed = parseISO(value.slice(0, 10));
  return isValid(parsed) ? format(parsed, "dd/MM/yyyy") : value;
};

export const FoodInvoicePrint = forwardRef<HTMLDivElement, Props>(
  ({ bill, hotelName }, ref) => {
    const org = bill?.org || {};
    const guest = bill?.guest || {};
    const items = bill?.date_wise_items || [];
    const billing = bill?.billing || {};
    const payment = bill?.payment || {};

    const paymentModes =
      Array.from(
        new Set(
          (payment.payments || []).map((p: any) =>
            p.mode === 1
              ? "Cash"
              : p.mode === 2
                ? "UPI"
                : p.mode === 3
                  ? "Card"
                  : p.mode === 4
                    ? "Bank Transfer"
                    : "Other",
          ),
        ),
      ).join(" / ") || "—";

    return (
      <div
        ref={ref}
        className="p-8 bg-white text-black text-sm max-w-4xl mx-auto"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold uppercase">
            {org.name || hotelName}
          </h1>
          <p>{org.address}</p>
          <p>
            Phone: {org.phone} | Email: {org.email}
          </p>
          <p>GSTIN: {org.gstin}</p>
        </div>

        <hr className="border-t border-gray-400 mb-6" />

        <h2 className="text-lg font-bold mb-4">TAX INVOICE</h2>

        <div className="flex gap-8 mb-4">
          <div>
            <strong>Invoice No.:</strong>{" "}
            {bill.invoice_no || bill.Bill_No || "—"}
          </div>
          <div>
            <strong>Invoice Date:</strong>{" "}
            {displayDate(bill.invoice_date || bill.CheckOut_Date)}
          </div>
        </div>

        <div className="mb-6">
          <div>
            <strong>Guest Name:</strong> {guest.name || bill.Guest_Name || "—"}
          </div>
          <div>
            <strong>Room No.:</strong> {guest.room_no || "—"}
          </div>
          <div>
            <strong>Check-in Date:</strong> {displayDate(guest.checkin_date)}{" "}
            &nbsp;&nbsp;&nbsp;
            <strong>Check-out Date:</strong> {displayDate(guest.checkout_date)}
          </div>
        </div>

        <h3 className="font-bold text-base mb-2 uppercase">
          Date-Wise Food Details
        </h3>
        <table className="w-full border-collapse border border-black mb-6 max-w-2xl text-right">
          <thead>
            <tr>
              <th className="border border-black p-1 text-center">Date</th>
              <th className="border border-black p-1 text-left">Item</th>
              <th className="border border-black p-1">Qty.</th>
              <th className="border border-black p-1">Rate (₹)</th>
              <th className="border border-black p-1">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((dateGroup: any, index: number) => (
              <React.Fragment key={index}>
                {dateGroup.items?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="border border-black p-1 text-center">
                      {displayDate(dateGroup.date)}
                    </td>
                    <td className="border border-black p-1 text-left">
                      {item.menu_name}
                    </td>
                    <td className="border border-black p-1">{item.quantity}</td>
                    <td className="border border-black p-1">
                      {(item.rate || 0)?.toFixed(2)}
                    </td>
                    <td className="border border-black p-1">
                      {(item.amount || 0)?.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td
                    className="border border-black p-1 text-center"
                    colSpan={4}
                  >
                    Sub Total
                  </td>
                  <td className="border border-black p-1">
                    {(dateGroup.sub_total || 0)?.toFixed(2)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
            <tr className="font-bold bg-gray-200">
              <td className="border border-black p-1 text-center" colSpan={4}>
                Total Food Charges
              </td>
              <td className="border border-black p-1">
                ₹{(billing.food_bill || 0)?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-bold text-base mb-2 uppercase">Tax Summary</h3>
        <table className="w-full border-collapse border border-black mb-6 max-w-sm text-right">
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">Particulars</th>
              <th className="border border-black p-1">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 text-left">
                Food Charges
              </td>
              <td className="border border-black p-1">
                {(billing.food_bill || 0)?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left">
                CGST @ {billing.cgst_pct || 0}%
              </td>
              <td className="border border-black p-1">
                {(billing.cgst_amount || 0)?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left">
                SGST @ {billing.sgst_pct || 0}%
              </td>
              <td className="border border-black p-1">
                {(billing.sgst_amount || 0)?.toFixed(2)}
              </td>
            </tr>
            <tr className="font-bold">
              <td className="border border-black p-1 text-left">Grand Total</td>
              <td className="border border-black p-1">
                ₹{(billing.grand_total || 0)?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Details */}
        <h3 className="font-bold text-base mb-2 mt-8 uppercase">
          Payment Details
        </h3>
        <div className="mb-8 space-y-1">
          <div>
            <strong>Payment Mode:</strong> {paymentModes}
          </div>
          <div>
            <strong>Amount Paid:</strong> ₹
            {payment.amount_paid?.toFixed(2) || "0.00"}
          </div>
          <div>
            <strong>Balance Due:</strong> ₹
            {payment.balance_due?.toFixed(2) || "0.00"}
          </div>
        </div>

        <hr className="border-t border-gray-400 mb-8" />

        <div className="flex justify-between items-end mt-16">
          <div>
            <strong>For {org.name || hotelName}</strong>
            <br />
            <br />
            <br />
            Authorized Signatory
          </div>
        </div>
        <div className="text-center italic text-xs mt-8 text-gray-600">
          This is a computer-generated invoice and does not require a signature.
        </div>
      </div>
    );
  },
);
FoodInvoicePrint.displayName = "FoodInvoicePrint";
