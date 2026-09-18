import type { Metadata } from "next";
import LoginContainer from "@/container/auth/login";

export const metadata: Metadata = {
  title: "Sign in | Innap",
  description: "Sign in to the Innap PrioSuite workspace.",
};

export default function LoginPage() {
  return <LoginContainer />;
}
