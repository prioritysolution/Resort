import type { Checkout } from "./types";

/** Normalize checkout/add `data` (nested Error_Code/Message possible). */
export function parseCheckoutBill(
  data: unknown,
  fallbackGuestName?: string,
): Checkout | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;

  // Prefer nested `data` when it looks like a bill (has Checkout_Id / Bill_No)
  const nestedCandidate =
    record.data && typeof record.data === "object" && !Array.isArray(record.data)
      ? (record.data as Record<string, unknown>)
      : null;
  const nested =
    nestedCandidate &&
    (nestedCandidate.Checkout_Id != null ||
      nestedCandidate.Bill_No != null ||
      nestedCandidate.Reservation_No != null)
      ? nestedCandidate
      : record;

  const checkoutIdRaw = nested.Checkout_Id ?? nested.Bill_Id;
  const checkoutId =
    checkoutIdRaw === "" || checkoutIdRaw == null
      ? NaN
      : Number(checkoutIdRaw);
  const reservationNo = String(nested.Reservation_No || "").trim();
  const billNo = nested.Bill_No != null ? String(nested.Bill_No).trim() : "";

  if (!reservationNo && !billNo && !Number.isFinite(checkoutId)) return null;

  return {
    Checkout_Id: Number.isFinite(checkoutId) ? checkoutId : undefined,
    Bill_No: billNo || undefined,
    Reservation_Id:
      nested.Reservation_Id != null && nested.Reservation_Id !== ""
        ? Number(nested.Reservation_Id)
        : undefined,
    Reservation_No: reservationNo || undefined,
    Guest_Name:
      nested.Guest_Name != null
        ? String(nested.Guest_Name)
        : fallbackGuestName || undefined,
    CheckOut_Date:
      nested.CheckOut_Date != null
        ? String(nested.CheckOut_Date)
        : nested.Checkout_Date != null
          ? String(nested.Checkout_Date)
          : undefined,
    Room_Bill: nested.Room_Bill as string | number | null | undefined,
    Room_Gst: nested.Room_Gst as string | number | null | undefined,
    Food_Bill: nested.Food_Bill as string | number | null | undefined,
    Food_Gst: nested.Food_Gst as string | number | null | undefined,
    Service_Bill: nested.Service_Bill as string | number | null | undefined,
    Service_Gst: nested.Service_Gst as string | number | null | undefined,
    Total_Bill: nested.Total_Bill as string | number | null | undefined,
    Total_Gst: nested.Total_Gst as string | number | null | undefined,
    Grand_Total: nested.Grand_Total as string | number | null | undefined,
    Amount_Paid: nested.Amount_Paid as string | number | null | undefined,
    Agent_Comm_Amount: nested.Agent_Comm_Amount as
      | string
      | number
      | null
      | undefined,
    Round_Off: nested.Round_Off as string | number | null | undefined,
    Net_Amount: nested.Net_Amount as string | number | null | undefined,
    Balance_Amount: nested.Balance_Amount as string | number | null | undefined,
    Status: nested.Status as number | string | undefined,
  };
}

export const formatBillMoney = (value: unknown) => {
  if (value === "" || value == null) return "0.00";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

type BillLine = { label: string; value: unknown; bold?: boolean };

export const buildCheckoutBillLines = (bill: Checkout): BillLine[] => [
  { label: "Room bill", value: bill.Room_Bill },
  { label: "Room GST", value: bill.Room_Gst },
  { label: "Food bill", value: bill.Food_Bill },
  { label: "Food GST", value: bill.Food_Gst },
  { label: "Service bill", value: bill.Service_Bill },
  { label: "Service GST", value: bill.Service_Gst },
  { label: "Total bill", value: bill.Total_Bill },
  { label: "Total GST", value: bill.Total_Gst },
  { label: "Grand total", value: bill.Grand_Total, bold: true },
  { label: "Amount paid", value: bill.Amount_Paid },
  { label: "Agent commission", value: bill.Agent_Comm_Amount },
  { label: "Round off", value: bill.Round_Off },
  { label: "Net amount", value: bill.Net_Amount, bold: true },
  { label: "Balance / due", value: bill.Balance_Amount, bold: true },
];

const padLine = (label: string, amount: string, width = 32) => {
  const left = label.slice(0, width - amount.length - 1);
  const spaces = Math.max(1, width - left.length - amount.length);
  return `${left}${" ".repeat(spaces)}${amount}`;
};

export function buildCheckoutBillText(
  bill: Checkout,
  hotelName = "Innap",
): string {
  const lines: string[] = [];
  const rule = "=".repeat(32);
  const dash = "-".repeat(32);

  lines.push(rule);
  lines.push(centerText(hotelName.toUpperCase(), 32));
  lines.push(centerText("CHECKOUT BILL", 32));
  lines.push(rule);
  lines.push(padLine("Bill No", String(bill.Bill_No || "—")));
  lines.push(padLine("Reservation", String(bill.Reservation_No || "—")));
  if (bill.Guest_Name) lines.push(padLine("Guest", bill.Guest_Name));
  lines.push(
    padLine(
      "Checkout",
      String(bill.CheckOut_Date || bill.Checkout_Date || "—"),
    ),
  );
  lines.push(dash);

  for (const row of buildCheckoutBillLines(bill)) {
    if (row.value == null || row.value === "") continue;
    lines.push(padLine(row.label, formatBillMoney(row.value)));
  }

  lines.push(rule);
  lines.push(centerText("Thank you! Visit again.", 32));
  lines.push(rule);
  return lines.join("\n");
}

function centerText(value: string, width: number) {
  const text = value.slice(0, width);
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return `${" ".repeat(pad)}${text}`;
}

export function buildCheckoutBillHtml(
  bill: Checkout,
  hotelName = "Innap",
): string {
  const rows = buildCheckoutBillLines(bill)
    .filter((row) => row.value != null && row.value !== "")
    .map(
      (row) => `
      <div class="row${row.bold ? " bold" : ""}">
        <span>${row.label}</span>
        <span>${formatBillMoney(row.value)}</span>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Checkout Bill ${bill.Bill_No || bill.Reservation_No || ""}</title>
  <style>
    @page { size: 58mm auto; margin: 2mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: "Courier New", Courier, monospace;
      font-size: 11px;
      line-height: 1.35;
    }
    .ticket {
      width: 58mm;
      max-width: 58mm;
      margin: 0 auto;
      padding: 2mm;
    }
    .center { text-align: center; }
    .title { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; }
    .muted { font-size: 10px; }
    .rule { border-top: 1px dashed #000; margin: 6px 0; }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin: 2px 0;
    }
    .row.bold { font-weight: 700; }
    .meta span { display: inline-block; min-width: 72px; }
    @media print {
      body { background: #fff; }
      .ticket { width: 58mm; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="center title">${escapeHtml(hotelName)}</div>
    <div class="center muted">CHECKOUT BILL</div>
    <div class="rule"></div>
    <div class="meta">
      <div><span>Bill No</span>: ${escapeHtml(String(bill.Bill_No || "—"))}</div>
      <div><span>Reservation</span>: ${escapeHtml(String(bill.Reservation_No || "—"))}</div>
      ${
        bill.Guest_Name
          ? `<div><span>Guest</span>: ${escapeHtml(bill.Guest_Name)}</div>`
          : ""
      }
      <div><span>Checkout</span>: ${escapeHtml(
        String(bill.CheckOut_Date || bill.Checkout_Date || "—"),
      )}</div>
    </div>
    <div class="rule"></div>
    ${rows}
    <div class="rule"></div>
    <div class="center muted">Thank you! Visit again.</div>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function printCheckoutBill(bill: Checkout, hotelName?: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const html = buildCheckoutBillHtml(bill, hotelName);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Checkout bill print");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = frameWindow?.document;
  if (!frameWindow || !frameDocument) {
    iframe.remove();
    return false;
  }

  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();

  const cleanup = () => {
    window.setTimeout(() => {
      iframe.remove();
    }, 500);
  };

  const runPrint = () => {
    try {
      frameWindow.focus();
      frameWindow.print();
    } finally {
      cleanup();
    }
  };

  // Wait for content/layout before printing
  window.setTimeout(runPrint, 300);
  return true;
}

export function downloadCheckoutBill(
  bill: Checkout,
  hotelName?: string,
  format: "html" | "txt" = "html",
) {
  const name = `checkout-bill-${bill.Bill_No || bill.Reservation_No || "receipt"}`;
  if (format === "txt") {
    const blob = new Blob([buildCheckoutBillText(bill, hotelName)], {
      type: "text/plain;charset=utf-8",
    });
    triggerDownload(blob, `${name}.txt`);
    return;
  }
  const blob = new Blob([buildCheckoutBillHtml(bill, hotelName)], {
    type: "text/html;charset=utf-8",
  });
  triggerDownload(blob, `${name}.html`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
