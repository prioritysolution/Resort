"use client";

import type { ComponentProps } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavMain from "@/components/layout/nav-main";
import type { SidebarState } from "@/container/layout/SidebarReducer";
import { cn } from "@/lib/utils";

type RootWithSidebar = {
  sidebar: SidebarState;
};

type AppSidebarProps = ComponentProps<typeof Sidebar>;

const AppSidebar = (props: AppSidebarProps) => {
  const sidebarData = useSelector(
    (state: RootWithSidebar) => state.sidebar.sidebarData,
  );
  const loading = useSelector(
    (state: RootWithSidebar) => state.sidebar.loading,
  );
  const { open } = useSidebar();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const fullLogo = isDark ? "/logo-white.png" : "/logo-dark.png";

  return (
    <Sidebar
      collapsible="icon"
      className="!border-r-0 border-transparent bg-chrome text-chrome-foreground transition-[width] duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader className="h-[var(--header-height)] justify-center border-b-0">
        <div
          className={cn(
            "flex w-full items-center transition-all duration-300 ease-in-out",
            open ? "justify-center px-3" : "justify-center px-0",
          )}
        >
          <Image
            src="/logo.png"
            alt="Innap"
            width={40}
            height={40}
            className={cn(
              "hidden size-10 shrink-0 rounded-[0.75rem] object-contain transition-all duration-300",
              "group-data-[collapsible=icon]:block",
            )}
            priority
          />
          <Image
            src={fullLogo}
            alt="Innap"
            width={200}
            height={48}
            className={cn(
              "object-contain transition-all duration-300 ease-in-out",
              "group-data-[collapsible=icon]:hidden",
              open
                ? "mx-auto h-11 w-auto max-w-[11.5rem] sm:h-12 sm:max-w-[13.5rem]"
                : "h-9 w-auto max-w-[150px] object-left",
            )}
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden bg-chrome p-0">
        <ScrollArea horizontal={false} className="h-full">
          <div className="p-2">
            <NavMain items={sidebarData} loading={loading} />
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarRail className="after:bg-transparent after:transition-colors after:duration-200 hover:after:bg-primary/20" />
    </Sidebar>
  );
};

export default AppSidebar;
