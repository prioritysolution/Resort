"use client";

import CollectionRegisterView from "@/components/reports/collection-register";
import { useCollectionRegister } from "./Hooks";

export default function CollectionRegisterContainer() {
  return <CollectionRegisterView {...useCollectionRegister()} />;
}
