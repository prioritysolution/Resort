import jsPDF from "jspdf";
import { openPdf, drawChrome, drawFooter } from "./pdfEngine";

function formatHeader(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function downloadReportPdf(title: string, columns: string[], data: any[], orgName: string = "Organization Name") {
  const doc = openPdf("landscape");
  drawChrome(doc, title, orgName);
  
  let y = 35;
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  let page = 1;

  doc.setFontSize(9);
  
  // Calculate dynamic column width based on available page width (leaving 8mm margins on each side)
  const marginX = 8;
  const availableWidth = pageW - (marginX * 2);
  const colWidth = availableWidth / columns.length;

  // Header
  let x = marginX;
  doc.setFont("helvetica", "bold");
  
  // Header background & border
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(marginX, y - 5, availableWidth, 8, "FD");

  columns.forEach((col) => {
    // truncate if header is too long
    const headerText = doc.splitTextToSize(formatHeader(col), colWidth - 4);
    doc.text(headerText, x + 2, y);
    // Draw vertical divider
    if (x > marginX) {
      doc.line(x, y - 5, x, y + 3);
    }
    x += colWidth;
  });
  doc.setFont("helvetica", "normal");
  y += 3; // move below header

  // Data
  data.forEach((row) => {
    if (y > pageH - 20) {
      drawFooter(doc, page);
      doc.addPage();
      page++;
      drawChrome(doc, title, orgName);
      y = 35;
      
      // Re-draw header on new page
      x = marginX;
      doc.setFont("helvetica", "bold");
      doc.setFillColor(245, 245, 245);
      doc.rect(marginX, y - 5, availableWidth, 8, "FD");
      columns.forEach((col) => {
        const headerText = doc.splitTextToSize(formatHeader(col), colWidth - 4);
        doc.text(headerText, x + 2, y);
        if (x > marginX) doc.line(x, y - 5, x, y + 3);
        x += colWidth;
      });
      doc.setFont("helvetica", "normal");
      y += 3;
    }
    
    x = marginX;
    let maxRowHeight = 7; // base row height

    // First pass: calculate max row height based on text wrapping
    columns.forEach((col) => {
      const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : "-";
      const splitText = doc.splitTextToSize(val, colWidth - 4);
      const textHeight = splitText.length * 4;
      if (textHeight + 4 > maxRowHeight) maxRowHeight = textHeight + 4;
    });

    // Draw row boundary
    doc.rect(marginX, y, availableWidth, maxRowHeight, "S");

    // Second pass: draw text and vertical borders
    columns.forEach((col) => {
      const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : "-";
      const splitText = doc.splitTextToSize(val, colWidth - 4);
      doc.text(splitText, x + 2, y + 5);
      
      if (x > marginX) {
        doc.line(x, y, x, y + maxRowHeight);
      }
      x += colWidth;
    });
    
    y += maxRowHeight;
  });

  drawFooter(doc, page);
  doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
}
