"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearAuthCookies } from "@/utils/secureCookieHelper";
import { logoutUserAPI } from "@/container/auth/login/LoginApis";

export const useDashboardLayout = () => {
  const router = useRouter();
  const sidebarData = useSelector((state) => state.sidebar.sidebarData);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchForm = useForm({
    defaultValues: { search: "" },
  });

  const searchValue = searchForm.watch("search");

  const menuItems = useMemo(() => {
    const items = [];
    (sidebarData || []).forEach((link) => {
      if (link.path) {
        items.push({ label: link.title, href: link.path, group: "Menu" });
      }
      (link.childLinks || []).forEach((child) => {
        if (child.Page_Allies) {
          items.push({
            label: child.Menue_Name,
            href: child.Page_Allies,
            group: link.title,
          });
        }
      });
    });
    return items;
  }, [sidebarData]);

  const suggestions = useMemo(() => {
    const query = String(searchValue || "").trim().toLowerCase();
    if (!query) return [];
    return menuItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.group.toLowerCase().includes(query),
    );
  }, [menuItems, searchValue]);

  const handleSelectSuggestion = (item) => {
    if (!item?.href) return;
    searchForm.setValue("search", "");
    setShowSuggestions(false);
    router.push(item.href);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutUserAPI();
      clearAuthCookies();
      toast.success("Signed out");
      router.replace("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  return {
    logoutLoading,
    handleLogout,
    searchForm,
    searchValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    hasMenuData: Boolean(sidebarData?.length),
  };
};
