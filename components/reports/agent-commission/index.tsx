"use client";

import { ListPageFrame } from "@/components/shared";
import ReportMetaBar from "@/components/reports/shared/ReportMetaBar";
import type { useAgentCommission } from "@/container/reports/agent-commission/Hooks";
import AgentCommissionToolbar from "./AgentCommissionToolbar";
import AgentCommissionTable from "./AgentCommissionTable";

type Props = ReturnType<typeof useAgentCommission>;

export function AgentCommissionView(props: Props) {
  const commissionType = props.form.watch("commission_type");

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
    >
      <ReportMetaBar
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
      />
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
