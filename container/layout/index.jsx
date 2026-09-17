"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getCookieData from "@/utils/getCookieData";
import { useDashboardLayout } from "@/container/layout/Hooks";
import AppSidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const DashboardLayoutContainer = ({ children }) => {
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
    const token = getCookieData("prioBankClientToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="h-full min-h-0! overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-h-0 overflow-hidden bg-background">
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
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:px-10 lg:pt-9 lg:pb-6">
            {children}
          </div>
          {/* <Footer /> */}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayoutContainer;
