"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getCookieData from "@/utils/getCookieData";
import { useDashboardLayout } from "@/container/layout/Hooks";
import AppSidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageLoader } from "@/components/shared";

type DashboardLayoutContainerProps = {
  children: ReactNode;
};

const DashboardLayoutContainer = ({
  children,
}: DashboardLayoutContainerProps) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const {
    logoutLoading,
    handleLogout,
    searchForm,
    searchValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    hasMenuData,
  } = useDashboardLayout();

  useEffect(() => {
    const token = getCookieData("resortToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <PageLoader variant="page" label="Loading workspace…" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="h-full min-h-0! overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
          <Navbar
            logoutLoading={logoutLoading}
            handleLogout={handleLogout}
            searchForm={searchForm}
            searchValue={searchValue}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            handleSelectSuggestion={handleSelectSuggestion}
            hasMenuData={hasMenuData}
          />
          <div className="min-h-0 flex-1 overflow-hidden bg-background px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
            {children}
          </div>
          {/* <Footer /> */}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayoutContainer;
