"use client";

import { useTravelAgent } from "@/container/org/travelAgent/Hooks";
import TravelAgentView from "@/components/org/travelAgent";

const TravelAgentContainer = () => {
  const travelAgent = useTravelAgent();
  return <TravelAgentView {...travelAgent} />;
};

export default TravelAgentContainer;
