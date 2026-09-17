"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavMain from "@/components/layout/nav-main";

const AppSidebar = (props) => {
  const sidebarData = useSelector((state) => state.sidebar.sidebarData);
  const loading = useSelector((state) => state.sidebar.loading);
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
        <div className="flex items-center gap-2 px-2 transition-all duration-300 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Image
            src="/logo.png"
            alt="Innap"
            width={40}
            height={40}
            className="hidden size-10 shrink-0 rounded-[0.75rem] object-contain group-data-[collapsible=icon]:block"
            priority
          />
          <Image
            src={fullLogo}
            alt="Innap"
            width={140}
            height={40}
            className="h-9 w-auto max-w-[150px] object-contain object-left group-data-[collapsible=icon]:hidden"
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-chrome">
        <NavMain items={sidebarData} loading={loading} />
      </SidebarContent>

      <SidebarRail className="after:bg-transparent after:transition-colors after:duration-200 hover:after:bg-primary/20" />
    </Sidebar>
  );
};

export default AppSidebar;
