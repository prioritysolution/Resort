"use client";

import React, { useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import getCookieData from "@/utils/getCookieData";
import { downloadReportPdf } from "./buildReportPdfs";
import { PreviewModal } from "./PreviewModal";

type Props = {
  title: string;
  columns: string[];
  data: any[];
};

export function PrintDownloadActions({ title, columns, data }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  
  const orgName = useMemo(() => {
    const resortName = getCookieData("resortName") || "Organization Name";
    const branchName = getCookieData("resortBranchName");
    return branchName ? `${resortName} - ${branchName}` : resortName;
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const disabled = !data || data.length === 0;

  return (
    <div className="flex items-center gap-2">
      <Button disabled={disabled} variant="outline" size="sm" onClick={() => handlePrint()} title="Print">
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
      <Button disabled={disabled} variant="outline" size="sm" onClick={() => downloadReportPdf(title, columns, data, orgName)} title="Download PDF">
        <Download className="w-4 h-4 mr-2" />
        Download PDF
      </Button>

      {/* Hidden print host */}
      <div style={{ display: "none" }}>
        <PreviewModal ref={printRef} title={title} columns={columns} data={data} orgName={orgName} />
      </div>
    </div>
  );
}
