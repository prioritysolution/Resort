"use client";

import { useStaffProfile } from "@/container/org/staffProfile/Hooks";
import StaffProfileView from "@/components/org/staffProfile";

const StaffProfileContainer = () => {
  const staffProfile = useStaffProfile();
  return <StaffProfileView {...staffProfile} />;
};

export default StaffProfileContainer;
