import { PAYMENT_COLL_MODES, type PaymentDue, type PaymentFormValues } from "./types";

export type PaymentReceipt = {
  reservation_no: string;
  guest_name?: string;
  coll_date?: string;
  amount: number | string;
  mode_label: string;
  final_coll: boolean;
  net_amount?: number | string | null;
  due_amount?: number | string | null;
  checkout_done: boolean;
};

const formatReceiptDate = (value: string | Date) => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value || "").trim().slice(0, 10);
};

const modeLabel = (mode: unknown) => {
  const n = Number(mode);
  return PAYMENT_COLL_MODES.find((item) => item.value === n)?.label || "—";
};

export function buildPaymentReceipt(
  values: PaymentFormValues,
  due: PaymentDue | null,
): PaymentReceipt {
  const amount = Number(values.remaining_amount);
  const checkoutDone = Number(due?.Checkout_Status) === 1;
  const previousDue = Number(due?.Due_Amount);
  const dueAfter =
    checkoutDone && Number.isFinite(previousDue) && Number.isFinite(amount)
      ? previousDue - amount
      : null;

  const date = formatReceiptDate(values.coll_date);

  return {
    reservation_no: values.reservation_no.trim(),
    guest_name: due?.Guest_Name || undefined,
    coll_date: date || undefined,
    amount: Number.isFinite(amount) ? amount : values.remaining_amount,
    mode_label: modeLabel(values.coll_mode),
    final_coll: Boolean(values.final_coll),
    net_amount: checkoutDone ? due?.Net_Amount : null,
    due_amount: dueAfter,
    checkout_done: checkoutDone,
  };
}

export const formatReceiptMoney = (value: unknown) => {
  if (value === "" || value == null) return "0.00";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

type ReceiptLine = { label: string; value: string; bold?: boolean };

export const buildPaymentReceiptLines = (
  receipt: PaymentReceipt,
): ReceiptLine[] => {
  const lines: ReceiptLine[] = [
    {
      label: "Amount",
      value: formatReceiptMoney(receipt.amount),
      bold: true,
    },
    { label: "Mode", value: receipt.mode_label },
    { label: "Final", value: receipt.final_coll ? "Yes" : "No" },
  ];

  if (receipt.checkout_done) {
    if (receipt.net_amount != null && receipt.net_amount !== "") {
      lines.push({
        label: "Net amount",
        value: formatReceiptMoney(receipt.net_amount),
      });
    }
    if (receipt.due_amount != null) {
      lines.push({
        label: "Due",
        value: formatReceiptMoney(receipt.due_amount),
        bold: true,
      });
    }
  }

  return lines;
};

const padLine = (label: string, amount: string, width = 32) => {
  const left = label.slice(0, width - amount.length - 1);
  const spaces = Math.max(1, width - left.length - amount.length);
  return `${left}${" ".repeat(spaces)}${amount}`;
};

const centerText = (value: string, width: number) => {
  const text = value.slice(0, width);
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return `${" ".repeat(pad)}${text}`;
};

export function buildPaymentReceiptText(
  receipt: PaymentReceipt,
  hotelName = "Innap",
): string {
  const rule = "=".repeat(32);
  const dash = "-".repeat(32);
  const lines = [
    rule,
    centerText(hotelName.toUpperCase(), 32),
    centerText("PAYMENT RECEIPT", 32),
    rule,
    padLine("Reservation", receipt.reservation_no || "—"),
  ];
  if (receipt.guest_name) lines.push(padLine("Guest", receipt.guest_name));
  lines.push(padLine("Date", receipt.coll_date || "—"));
  lines.push(dash);
  for (const row of buildPaymentReceiptLines(receipt)) {
    lines.push(padLine(row.label, row.value));
  }
  lines.push(rule);
  lines.push(centerText("Thank you! Visit again.", 32));
  lines.push(rule);
  return lines.join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildPaymentReceiptHtml(
  receipt: PaymentReceipt,
  hotelName = "Innap",
): string {
  const rows = buildPaymentReceiptLines(receipt)
    .map(
      (row) => `
      <div class="row${row.bold ? " bold" : ""}">
        <span>${escapeHtml(row.label)}</span>
        <span>${escapeHtml(row.value)}</span>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Receipt ${escapeHtml(receipt.reservation_no)}</title>
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
    .ticket { width: 58mm; max-width: 58mm; margin: 0 auto; padding: 2mm; }
    .center { text-align: center; }
    .title { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; }
    .muted { font-size: 10px; }
    .rule { border-top: 1px dashed #000; margin: 6px 0; }
    .row { display: flex; justify-content: space-between; gap: 6px; margin: 2px 0; }
    .row.bold { font-weight: 700; }
    .meta span { display: inline-block; min-width: 72px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="center title">${escapeHtml(hotelName)}</div>
    <div class="center muted">PAYMENT RECEIPT</div>
    <div class="rule"></div>
    <div class="meta">
      <div><span>Reservation</span>: ${escapeHtml(receipt.reservation_no || "—")}</div>
      ${
        receipt.guest_name
          ? `<div><span>Guest</span>: ${escapeHtml(receipt.guest_name)}</div>`
          : ""
      }
      <div><span>Date</span>: ${escapeHtml(receipt.coll_date || "—")}</div>
    </div>
    <div class="rule"></div>
    ${rows}
    <div class="rule"></div>
    <div class="center muted">Thank you! Visit again.</div>
  </div>
</body>
</html>`;
}

export function printPaymentReceipt(receipt: PaymentReceipt, hotelName?: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const html = buildPaymentReceiptHtml(receipt, hotelName);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Payment receipt print");
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

  window.setTimeout(() => {
    try {
      frameWindow.focus();
      frameWindow.print();
    } finally {
      window.setTimeout(() => iframe.remove(), 500);
    }
  }, 300);
  return true;
}

export function downloadPaymentReceipt(
  receipt: PaymentReceipt,
  hotelName?: string,
  format: "html" | "txt" = "html",
) {
  const name = `payment-receipt-${receipt.reservation_no || "receipt"}`;
  const blob =
    format === "txt"
      ? new Blob([buildPaymentReceiptText(receipt, hotelName)], {
          type: "text/plain;charset=utf-8",
        })
      : new Blob([buildPaymentReceiptHtml(receipt, hotelName)], {
          type: "text/html;charset=utf-8",
        });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = format === "txt" ? `${name}.txt` : `${name}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
