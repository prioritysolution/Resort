import AgentCommissionContainer from "@/container/reports/agent-commission";

export const metadata = {
  title: "Agent commission | Innap",
  description: "Month-wise agent commission from checkout room bills.",
};

export default function AgentCommissionPage() {
  return <AgentCommissionContainer />;
}
