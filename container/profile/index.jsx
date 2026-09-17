"use client";

import { useProfile } from "@/container/profile/Hooks";
import ProfileView from "@/components/profile";

const ProfileContainer = () => {
  const profile = useProfile();
  return <ProfileView {...profile} />;
};

export default ProfileContainer;
