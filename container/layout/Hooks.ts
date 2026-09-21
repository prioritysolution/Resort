"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearAuthCookies } from "@/utils/secureCookieHelper";
import { logoutUserAPI } from "@/container/auth/login/LoginApis";
import { getMenusAPI } from "@/container/layout/LayoutApis";
import {
  setSidebarData,
  setSidebarLoading,
  type SidebarLink,
  type SidebarState,
} from "@/container/layout/SidebarReducer";
import type { ApiMenu } from "@/container/layout/types";

export type MenuSearchItem = {
  label: string;
  href: string;
  group: string;
};

export type SearchFormValues = {
  search: string;
};

type RootWithSidebar = {
  sidebar: SidebarState;
};

const MENU_ICON_MAP: Record<string, string> = {
  Dashboard: "MdDashboard",
  "Organization Setup": "MdBusiness",
  Guest: "MdPeople",
  Reports: "MdAssessment",
};

/** Deduplicate concurrent / Strict Mode menu fetches */
let menusInFlight: Promise<void> | null = null;

const resolveMenuIcon = (menuName: string, icon?: string | null) => {
  if (icon && String(icon).trim()) return String(icon).trim();
  return MENU_ICON_MAP[menuName] || "MdMenu";
};

export const mapMenusToSidebar = (menus: ApiMenu[] = []): SidebarLink[] =>
  menus.map((menu) => ({
    menu_id: menu.menu_id,
    menu_name: menu.menu_name,
    icon: resolveMenuIcon(menu.menu_name, menu.icon),
    route: menu.route || "",
    sub_menus: (menu.sub_menus || []).map((sub) => ({
      submenu_id: sub.submenu_id,
      submenu_name: sub.submenu_name,
      icon: sub.icon ?? null,
      route: sub.route || "",
      menu_sl: sub.menu_sl,
    })),
  }));

export const useDashboardLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const sidebarData = useSelector(
    (state: RootWithSidebar) => state.sidebar.sidebarData,
  );
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchForm = useForm<SearchFormValues>({
    defaultValues: { search: "" },
  });

  const searchValue = searchForm.watch("search");

  const loadMenus = useCallback(async () => {
    if (menusInFlight) {
      await menusInFlight;
      return;
    }

    menusInFlight = (async () => {
      dispatch(setSidebarLoading(true));
      try {
        const res = await getMenusAPI();
        const menus = Array.isArray(res?.menus) ? res.menus : [];

        if (menus.length) {
          dispatch(setSidebarData(mapMenusToSidebar(menus)));
          return;
        }

        dispatch(setSidebarData([]));
        if (res?.message || res?.Message) {
          toast.error(res.message || res.Message || "Unable to load menus");
        }
      } finally {
        dispatch(setSidebarLoading(false));
      }
    })();

    try {
      await menusInFlight;
    } finally {
      menusInFlight = null;
    }
  }, [dispatch]);

  useEffect(() => {
    if (sidebarData.length > 0) {
      dispatch(setSidebarLoading(false));
      return;
    }
    void loadMenus();
  }, [dispatch, loadMenus, sidebarData.length]);

  const menuItems = useMemo(() => {
    const items: MenuSearchItem[] = [];
    (sidebarData || []).forEach((link: SidebarLink) => {
      if (link.route) {
        items.push({ label: link.menu_name, href: link.route, group: "Menu" });
      }
      (link.sub_menus || []).forEach((child) => {
        if (child.route) {
          items.push({
            label: child.submenu_name,
            href: child.route,
            group: link.menu_name,
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

  const handleSelectSuggestion = (item: MenuSearchItem) => {
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
    reloadMenus: loadMenus,
  };
};
