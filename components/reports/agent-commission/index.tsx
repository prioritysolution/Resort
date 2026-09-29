"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useAgentCommission } from "@/container/reports/agent-commission/Hooks";
import AgentCommissionToolbar from "./AgentCommissionToolbar";
import AgentCommissionTable, { allColumns, agentColumns } from "./AgentCommissionTable";
import { PrintDownloadActions } from "../shared/PrintDownloadActions";

type Props = ReturnType<typeof useAgentCommission>;

export function AgentCommissionView(props: Props) {
  const commissionType = props.form.watch("commission_type");
  
  const activeColumns = commissionType === "agent" ? agentColumns : allColumns;
  const printColumns = activeColumns.map(c => c.label);
  const printData = props.rows.map(row => {
    const newRow: any = {};
    activeColumns.forEach(c => {
      newRow[c.label] = c.value(row);
    });
    return newRow;
  });

  return (
    <ListPageFrame
      title="Agent commission"
      description="Month-wise agent commission from checkout room bills."
      toolbar={
        <AgentCommissionToolbar
          form={props.form}
          loading={props.loading}
          agents={props.agents}
          onSubmit={props.runReport}
        />
      }
      action={<PrintDownloadActions title="Agent commission" columns={printColumns} data={printData} />}
    >
      {/* <ReportMetaBar
        items={[
          { label: "Type", value: props.meta?.commission_type },
          { label: "Month", value: props.meta?.month },
          { label: "Total records", value: props.meta?.total_records },
          { label: "Total room bill", value: props.meta?.total_room_bill },
          {
            label: "Total commission",
            value: props.meta?.total_commission,
            emphasize: true,
          },
        ]}
      /> */}
      <AgentCommissionTable
        rows={props.rows}
        loading={props.loading}
        searched={props.searched}
        commissionType={commissionType}
      />
    </ListPageFrame>
  );
}

export default AgentCommissionView;
