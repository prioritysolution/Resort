import type { Metadata } from "next";
import ComingSoonView from "@/components/dashboard/comingSoon";

export const metadata: Metadata = {
  title: "Workspace | Innap",
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
