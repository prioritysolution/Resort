"use client";

import FoodOrderView from "@/components/guest/food-order";
import { useFoodOrder } from "./Hooks";

export default function FoodOrderContainer() {
  return <FoodOrderView {...useFoodOrder()} />;
}
