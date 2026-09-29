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

export const RoomInvoicePrint = forwardRef<HTMLDivElement, Props>(
  ({ bill, hotelName }, ref) => {
    const org = bill?.org || {};
    const guest = bill?.guest || {};
    const stay = bill?.stay || {};
    const billing = bill?.billing || {};
    const payment = bill?.payment || {};

    const roomNos =
      (stay?.rooms || [])
        .map((r: any) => r.room_no)
        .filter(Boolean)
        .join(", ") || "—";
    const roomTypes =
      Array.from(
        new Set(
          (stay?.rooms || []).map((r: any) => r.room_type).filter(Boolean),
        ),
      ).join(", ") || "—";
    const totalExtraBeds =
      (stay?.rooms || []).reduce(
        (acc: number, r: any) => acc + (Number(r.extra_bed_no) || 0),
        0,
      ) || 0;

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

    // Helper to calculate nights (basic difference between checkin/checkout)
    const getDays = (start?: string, end?: string) => {
      if (!start || !end) return 1;
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 0 ? 1 : diffDays;
    };
    const nights = getDays(stay.checkin_date, stay.checkout_date);

    return (
      <div
        ref={ref}
        className="p-8 bg-white text-black text-sm max-w-4xl mx-auto"
        style={{ width: "210mm", minHeight: "297mm"}}
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
            <strong>Address:</strong> {guest.address || "—"}
          </div>
          <div>
            <strong>Mobile No.:</strong> {guest.mobile || "—"}{" "}
            &nbsp;&nbsp;&nbsp;
            <strong>GSTIN (if applicable):</strong> {guest.aadhar_no || "—"}
          </div>
        </div>

        <h3 className="font-bold text-base mb-2">Stay Details</h3>
        <table className="w-full border-collapse border border-black mb-6 max-w-md">
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold w-1/3">
                Particulars
              </td>
              <td className="border border-black p-1 font-bold">Details</td>
            </tr>
            <tr>
              <td className="border border-black p-1">Room No.</td>
              <td className="border border-black p-1">{roomNos}</td>
            </tr>
            <tr>
              <td className="border border-black p-1">Room Type</td>
              <td className="border border-black p-1">{roomTypes}</td>
            </tr>
            <tr>
              <td className="border border-black p-1">Check-in</td>
              <td className="border border-black p-1">
                {displayDate(stay.checkin_date)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1">Check-out</td>
              <td className="border border-black p-1">
                {displayDate(stay.checkout_date)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1">No. of Nights</td>
              <td className="border border-black p-1">{nights}</td>
            </tr>
            <tr>
              <td className="border border-black p-1">No. of Guests</td>
              <td className="border border-black p-1">
                {stay.adult_no || 0} Adults{" "}
                {stay.child_no ? `, ${stay.child_no} Children` : ""}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-bold text-base mb-2">Billing Details</h3>
        <table className="w-full border-collapse border border-black mb-6 max-w-lg text-right">
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">Description</th>
              <th className="border border-black p-1">Qty/Nights</th>
              <th className="border border-black p-1">Rate (₹)</th>
              <th className="border border-black p-1">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 text-left">Room Rent</td>
              <td className="border border-black p-1">{nights}</td>
              <td className="border border-black p-1">
                {((billing.room_bill || 0) / nights)?.toFixed(2)}
              </td>
              <td className="border border-black p-1">
                {(billing.room_bill || 0)?.toFixed(2)}
              </td>
            </tr>
            {totalExtraBeds > 0 && (
              <tr>
                <td className="border border-black p-1 text-left">Extra Bed</td>
                <td className="border border-black p-1">{totalExtraBeds}</td>
                <td className="border border-black p-1">—</td>
                <td className="border border-black p-1">—</td>
              </tr>
            )}
            <tr className="font-bold">
              <td className="border border-black p-1 text-left" colSpan={3}>
                Subtotal
              </td>
              <td className="border border-black p-1">
                {(billing.room_bill || 0)?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left" colSpan={3}>
                CGST @ {billing.cgst_pct || 0}%
              </td>
              <td className="border border-black p-1">
                {(billing.cgst_amount || 0)?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left" colSpan={3}>
                SGST @ {billing.sgst_pct || 0}%
              </td>
              <td className="border border-black p-1">
                {(billing.sgst_amount || 0)?.toFixed(2)}
              </td>
            </tr>
            {billing.round_off ? (
              <tr>
                <td className="border border-black p-1 text-left" colSpan={3}>
                  Round Off
                </td>
                <td className="border border-black p-1">
                  {(billing.round_off || 0)?.toFixed(2)}
                </td>
              </tr>
            ) : null}
            <tr className="font-bold">
              <td className="border border-black p-1 text-left" colSpan={3}>
                Grand Total
              </td>
              <td className="border border-black p-1">
                ₹{(billing.grand_total || 0)?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Details */}
        <h3 className="font-bold text-base mb-2 mt-8">Payment Details</h3>
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
RoomInvoicePrint.displayName = "RoomInvoicePrint";
