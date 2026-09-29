import jsPDF from "jspdf";

export function openPdf(orientation: "portrait" | "landscape" = "portrait") {
  const doc = new jsPDF(orientation, "mm", "a4");
  return doc;
}

export function drawChrome(doc: jsPDF, title: string, orgName: string = "Organization Name") {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(orgName, pageWidth / 2, 15, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, 22, { align: "center" });
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 27, { align: "center" });
  
  doc.setTextColor(0);
  doc.setLineWidth(0.1);
  doc.line(8, 30, pageWidth - 8, 30);
}

export function drawFooter(doc: jsPDF, pageNumber: number) {
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.text(`Page ${pageNumber}`, 8, pageH - 10);
}
