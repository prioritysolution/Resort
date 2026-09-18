import type { Metadata } from "next";
import DashboardHomeContainer from "@/container/dashboard/home";

export const metadata: Metadata = {
  title: "Dashboard | Innap",
  description: "Innap operations dashboard.",
};

export default function DashboardPage() {
  return <DashboardHomeContainer />;
}
