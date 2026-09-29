import React, { forwardRef } from "react";

type Props = {
  title: string;
  columns: string[];
  data: any[];
  orgName?: string;
};

function formatHeader(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export const PreviewModal = forwardRef<HTMLDivElement, Props>(
  ({ title, columns, data, orgName }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-black print:p-0 print:m-0 w-full"
        style={{
          fontFamily: "sans-serif",
        }}
      >
        <style type="text/css" media="print">
          {`
            @page { size: landscape; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          `}
        </style>
        <div className="print:break-after-page">
          <div className="mb-6 text-center border-b pb-4">
            <h1 className="text-2xl font-bold mb-1">{orgName || "Organization Name"}</h1>
            <h2 className="text-xl text-gray-700">{title}</h2>
            <p className="text-sm text-gray-500 mt-2">Generated: {new Date().toLocaleString()}</p>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-y-2 border-gray-800">
                {columns.map((col) => (
                  <th key={col} className="px-2 py-3 font-semibold text-gray-800 border-x border-gray-300 break-words">
                    {formatHeader(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-300 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-2 py-2 border-x border-gray-200 break-words text-gray-700">
                      {row[col] !== undefined && row[col] !== null ? String(row[col]) : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

PreviewModal.displayName = "PreviewModal";
