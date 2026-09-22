"use client";

import AgentCommissionView from "@/components/reports/agent-commission";
import { useAgentCommission } from "./Hooks";

export default function AgentCommissionContainer() {
  return <AgentCommissionView {...useAgentCommission()} />;
}
