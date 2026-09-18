"use client";

import {
  MdCall,
  MdNotifications,
  MdOutlineArrowDropDown,
  MdPerson,
  MdLogout,
  MdSearch,
} from "react-icons/md";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import type { UseFormReturn } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BsLayoutSidebar, BsLayoutSidebarInset } from "react-icons/bs";
import { cn } from "@/lib/utils";
import type {
  MenuSearchItem,
  SearchFormValues,
} from "@/container/layout/Hooks";

type NavbarProps = {
  logoutLoading: boolean;
  handleLogout: () => void | Promise<void>;
  searchForm: UseFormReturn<SearchFormValues>;
  searchValue?: string;
  suggestions?: MenuSearchItem[];
  showSuggestions: boolean;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  handleSelectSuggestion: (item: MenuSearchItem) => void;
  hasMenuData: boolean;
};

const Navbar = ({
  logoutLoading,
  handleLogout,
  searchForm,
  searchValue,
  suggestions = [],
  showSuggestions,
  setShowSuggestions,
  handleSelectSuggestion,
  hasMenuData,
}: NavbarProps) => {
  const [userName, setUserName] = useState("");
  const [resortName, setResortName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { state } = useSidebar();
  const isSidebarActive = state === "expanded";

  const query = String(searchValue || "").trim();
  const isSuggestionsOpen = Boolean(showSuggestions && query);

  useEffect(() => {
    setUserName(
      getCookieData("resortUserName") || getCookieData("resortShortName") || "",
    );
    setResortName(getCookieData("resortName") || "");
    setBranchName(getCookieData("resortBranchName") || "");
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selected = suggestions[activeIndex] || suggestions[0];
    if (selected) handleSelectSuggestion?.(selected);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (!isSuggestionsOpen || !suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1,
      );
    } else if (event.key === "Escape") {
      setShowSuggestions?.(false);
    }
  };

  const hasOrgLabel = Boolean(resortName || branchName);

  return (
    <header className="flex h-[var(--header-height)] w-full shrink-0 items-center gap-1 border-b-0 bg-chrome px-2 sm:gap-2 sm:px-4 lg:gap-3 lg:px-5">
      <SidebarTrigger
        aria-pressed={isSidebarActive}
        className={cn(
          "size-9 cursor-pointer rounded-[0.625rem] text-chrome-foreground shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.03)] transition-colors duration-200 hover:bg-primary/10 hover:text-primary",
          isSidebarActive &&
            "bg-transparent text-primary hover:bg-primary/10 hover:text-primary",
        )}
      >
        {isSidebarActive ? (
          <BsLayoutSidebarInset className="size-[18px]" />
        ) : (
          <BsLayoutSidebar className="size-[18px]" />
        )}
      </SidebarTrigger>
      <Separator
        orientation="vertical"
        className="mr-1 hidden h-4 bg-chrome-border data-[orientation=vertical]:h-4 sm:block"
      />

      <div className="hidden min-w-0 max-w-[42%] shrink items-center gap-1.5 sm:flex lg:max-w-sm">
        {!mounted ? (
          <Skeleton className="h-4 w-28 rounded bg-muted sm:w-36" />
        ) : hasOrgLabel ? (
          <div className="flex min-w-0 items-baseline gap-1.5">
            {resortName ? (
              <span className="shrink-0 font-display text-sm font-semibold tracking-wide text-foreground sm:text-base">
                {resortName}
              </span>
            ) : null}
            {resortName && branchName ? (
              <span className="shrink-0 text-chrome-muted">·</span>
            ) : null}
            {branchName ? (
              <span className="truncate text-sm text-chrome-muted sm:text-[0.9375rem]">
                {branchName}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 sm:gap-1.5">
        <div
          ref={searchWrapRef}
          className="relative ml-auto min-w-0 max-w-[7.5rem] flex-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] min-[400px]:max-w-[10rem] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
        >
          {searchForm ? (
            <Form {...searchForm}>
              <form
                onSubmit={handleSearchSubmit}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => query && setShowSuggestions?.(true)}
                autoComplete="off"
              >
                <InputField
                  control={searchForm.control}
                  name="search"
                  placeholder="Search Here..."
                  autoComplete="off"
                  formItemClassName="gap-0 space-y-0 w-full"
                  className={cn(
                    "h-10 rounded-[0.625rem] border border-border bg-white shadow-none",
                    "text-foreground",
                    "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:border-primary/20 hover:bg-white",
                    "focus-within:border-primary/40 focus-within:bg-white",
                    "focus-within:shadow-[0_4px_16px_rgba(19,98,252,0.1)]",
                    "focus-within:ring-2 focus-within:ring-primary/20",
                    "dark:border-[#3d4349] dark:bg-[#343a40]",
                    "dark:hover:border-primary/30 dark:hover:bg-[#3a4046]",
                    "dark:focus-within:border-primary/50 dark:focus-within:bg-[#3a4046]",
                    "dark:focus-within:shadow-[0_4px_18px_rgba(19,98,252,0.18)]",
                    "dark:focus-within:ring-primary/25",
                  )}
                  startContent={
                    <MdSearch className="text-lg text-muted-foreground transition-colors duration-200 dark:text-[#adb5bd]" />
                  }
                  onInput={() => setShowSuggestions?.(true)}
                />
              </form>
            </Form>
          ) : null}

          {isSuggestionsOpen ? (
            <div className="absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-[0.625rem] border border-border bg-popover text-popover-foreground shadow-xl transition-all duration-200 ease-out">
              {!hasMenuData ? (
                <p className="px-3 py-2.5 text-xs text-muted-foreground">
                  Loading pages…
                </p>
              ) : suggestions.length ? (
                <ul className="max-h-64 overflow-y-auto py-1">
                  {suggestions.map((item, index) => (
                    <li key={`${item.group}-${item.href}-${item.label}`}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelectSuggestion?.(item)}
                        className={cn(
                          "w-full cursor-pointer px-3 py-2 text-left transition-colors duration-150 ease-out",
                          index === activeIndex
                            ? "bg-primary/10"
                            : "hover:bg-muted",
                        )}
                      >
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.group}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2.5 text-xs text-muted-foreground">
                  No pages found
                </p>
              )}
            </div>
          ) : null}
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="relative shrink-0 cursor-pointer rounded-[0.625rem] bg-white p-2.5 text-primary shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.03)] transition-all duration-150 ease-out hover:bg-primary/5 active:scale-90 dark:bg-card"
          aria-label="Notifications"
        >
          <MdNotifications className="text-xl" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-warning" />
        </button>

        <button
          type="button"
          className="hidden shrink-0 cursor-pointer rounded-[0.625rem] bg-white p-2.5 text-primary shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.03)] transition-all duration-150 ease-out hover:bg-primary/5 active:scale-90 sm:flex dark:bg-card"
          aria-label="Call"
        >
          <MdCall className="text-xl" />
        </button>

        <div className="mx-0.5 hidden h-6 w-px shrink-0 bg-chrome-border sm:mx-1 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="shrink-0 cursor-pointer outline-none">
            {!mounted ? (
              <div className="flex items-center gap-2 px-1.5 py-1.5 sm:px-2">
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                <Skeleton className="hidden h-4 w-20 rounded bg-muted md:block" />
              </div>
            ) : userName ? (
              <div className="group flex cursor-pointer items-center gap-2 rounded-[0.625rem] px-1.5 py-1.5 transition-all duration-150 ease-out hover:bg-primary/5 active:scale-95 sm:px-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[100px] truncate text-sm font-medium text-chrome-foreground md:block">
                  {userName}
                </span>
                <MdOutlineArrowDropDown className="hidden text-lg text-chrome-muted transition-transform duration-200 ease-out group-hover:text-primary md:block" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-1.5 py-1.5 sm:px-2">
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                <Skeleton className="hidden h-4 w-20 rounded bg-muted md:block" />
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="mt-2 w-52 rounded-[0.625rem] border border-border bg-popover p-1 text-popover-foreground shadow-xl"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-xs font-normal text-muted-foreground">
                  Signed in as
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {userName}
                </p>
                {/* {hasOrgLabel ? (
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {[resortName, branchName].filter(Boolean).join(" · ")}
                  </p>
                ) : null} */}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm"
              >
                <MdPerson className="text-base text-primary" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={!logoutLoading ? handleLogout : undefined}
                disabled={logoutLoading}
                variant="destructive"
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm"
              >
                <MdLogout className="text-base" />
                {logoutLoading ? "Logging out…" : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
