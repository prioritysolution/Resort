"use client";

import { usePriceManager } from "@/container/org/priceManager/Hooks";
import PriceManagerView from "@/components/org/priceManager";

const PriceManagerContainer = () => {
  const priceManager = usePriceManager();
  return <PriceManagerView {...priceManager} />;
};

export default PriceManagerContainer;
