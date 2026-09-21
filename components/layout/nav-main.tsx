"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import IconDisplay from "@/common/IconDisplay";
import type { SidebarLink } from "@/container/layout/SidebarReducer";

type NavMainProps = {
  items?: SidebarLink[];
  loading?: boolean;
};

const NavMain = ({ items = [], loading = false }: NavMainProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar();
  const isSidebarActive = state === "expanded" || isMobile;
  const [expandedLink, setExpandedLink] = useState("");

  useEffect(() => {
    if (!isSidebarActive) {
      setExpandedLink("");
      return;
    }

    const activeParent = items.find((link) =>
      link.sub_menus?.some((c) => c.route === pathname),
    );
    if (activeParent?.sub_menus?.length) {
      setExpandedLink(activeParent.menu_name);
    }
  }, [pathname, items, isSidebarActive]);

  const handleExpandedLink = (title: string) => {
    setExpandedLink((prev) => (prev !== title ? title : ""));
  };

  const openSidebarIfNeeded = () => {
    if (isMobile) {
      setOpenMobile(true);
      return;
    }
    if (!isSidebarActive) setOpen(true);
  };

  if (loading || !items.length) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {Array.from({ length: 7 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-[5px]">
        {items.map((link) => {
          const hasChildren = (link.sub_menus?.length ?? 0) > 0;
          const isActive =
            link.route === pathname ||
            link.sub_menus?.some((c) => c.route === pathname);
          const isExpanded =
            isSidebarActive && expandedLink === link.menu_name;
          const iconSet = String(link.icon || "Md")
            .slice(0, 2)
            .toLowerCase();

          return (
            <SidebarMenuItem key={link.menu_id}>
              <SidebarMenuButton
                type="button"
                tooltip={link.menu_name}
                isActive={isActive}
                className={cn(
                  "h-10 cursor-pointer rounded-[0.625rem] border-0 px-3 shadow-none",
                  "transition-all duration-200 ease-out active:scale-[0.98]",
                  isActive
                    ? "bg-primary text-white hover:bg-primary hover:text-white data-active:bg-primary data-active:text-white"
                    : "bg-transparent text-chrome-foreground hover:bg-primary/10 hover:text-primary",
                )}
                onClick={() => {
                  if (hasChildren) {
                    if (!isSidebarActive) {
                      openSidebarIfNeeded();
                      setExpandedLink(link.menu_name);
                      return;
                    }
                    handleExpandedLink(link.menu_name);
                    return;
                  }
                  setExpandedLink("");
                  if (link.route) router.replace(link.route);
                }}
              >
                <span
                  className={cn(
                    "text-[1.3rem] transition-colors duration-200",
                    isActive ? "text-white" : "text-chrome-muted",
                  )}
                >
                  <IconDisplay iconName={link.icon} iconSet={iconSet} />
                </span>
                <span className="truncate text-[0.9375rem]">
                  {link.menu_name}
                </span>
                {hasChildren && isSidebarActive ? (
                  <span
                    className={cn(
                      "ml-auto shrink-0 transition-transform duration-300 ease-out",
                      isActive ? "text-white" : "text-chrome-muted",
                      isExpanded ? "rotate-180" : "rotate-0",
                    )}
                  >
                    <FiChevronDown className="size-4" />
                  </span>
                ) : null}
              </SidebarMenuButton>

              {hasChildren ? (
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                    isExpanded && isSidebarActive
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <SidebarMenuSub className="mx-0 mb-1 w-full min-w-0 translate-x-0 gap-0.5 border-0 px-0 py-1">
                      {link.sub_menus.map((item) => {
                        const isChildActive = item.route === pathname;

                        return (
                          <SidebarMenuSubItem
                            key={`${link.menu_id}-${item.submenu_id}`}
                            className="w-full"
                          >
                            <SidebarMenuSubButton
                              isActive={isChildActive}
                              render={<button type="button" />}
                              onClick={() => {
                                if (item.route) {
                                  router.push(item.route);
                                }
                              }}
                              className={cn(
                                "group/sub flex h-auto w-full min-w-0 translate-x-0 cursor-pointer items-center gap-2.5 rounded-md py-2 pr-8 pl-9 text-left shadow-none",
                                "bg-transparent transition-all duration-200 ease-out",
                                "hover:bg-transparent active:bg-transparent data-active:bg-transparent",
                                "hover:text-primary",
                                isChildActive
                                  ? "text-primary"
                                  : "text-chrome-muted",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-[1.5px] shrink-0 rounded-full transition-all duration-300 ease-out",
                                  isChildActive
                                    ? "w-4 bg-primary"
                                    : "w-2.5 bg-chrome-muted/50 group-hover/sub:w-4 group-hover/sub:bg-primary/50",
                                )}
                              />
                              <span
                                className={cn(
                                  "w-full truncate text-[13.5px] tracking-wide transition-all duration-200",
                                  isChildActive && "font-semibold",
                                )}
                              >
                                {item.submenu_name}
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </div>
                </div>
              ) : null}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
