import type { Metadata } from "next";
import ProfileContainer from "@/container/profile";

export const metadata: Metadata = {
  title: "Profile | Innap",
};

export default function ProfilePage() {
  return <ProfileContainer />;
}
