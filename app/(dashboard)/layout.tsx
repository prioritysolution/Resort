import type { ReactNode } from "react";
import DashboardLayoutContainer from "@/container/layout";

export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayoutContainer>{children}</DashboardLayoutContainer>;
}
