"use client";

import { usePaidService } from "@/container/org/paidService/Hooks";
import PaidServiceView from "@/components/org/paidService";

const PaidServiceContainer = () => {
  const paidService = usePaidService();
  return <PaidServiceView {...paidService} />;
};

export default PaidServiceContainer;
