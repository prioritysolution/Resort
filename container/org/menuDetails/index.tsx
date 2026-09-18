"use client";

import { useMenuDetails } from "@/container/org/menuDetails/Hooks";
import MenuDetailsView from "@/components/org/menuDetails";

const MenuDetailsContainer = () => {
  const menuDetails = useMenuDetails();
  return <MenuDetailsView {...menuDetails} />;
};

export default MenuDetailsContainer;
