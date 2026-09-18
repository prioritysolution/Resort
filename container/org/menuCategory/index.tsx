"use client";

import { useMenuCategory } from "@/container/org/menuCategory/Hooks";
import MenuCategoryView from "@/components/org/menuCategory";

const MenuCategoryContainer = () => {
  const menuCategory = useMenuCategory();
  return <MenuCategoryView {...menuCategory} />;
};

export default MenuCategoryContainer;
