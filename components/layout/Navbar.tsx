"use client";

import {
  MdCall,
  MdClose,
  MdNotifications,
  MdOutlineArrowDropDown,
  MdPerson,
  MdLogout,
  MdSearch,
} from "react-icons/md";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
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

const actionBtnClass =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[0.625rem] bg-white text-primary shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.03)] transition-all duration-150 ease-out hover:bg-primary/5 active:scale-90 sm:size-10 dark:bg-card";

const searchInputClass = cn(
  "h-9 rounded-[0.625rem] border border-border bg-white shadow-none sm:h-10",
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
);

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
  const [stackOrgLabel, setStackOrgLabel] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [suggestBox, setSuggestBox] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const suggestPanelRef = useRef<HTMLDivElement | null>(null);
  const orgLabelBoxRef = useRef<HTMLDivElement | null>(null);
  const orgLabelMeasureRef = useRef<HTMLSpanElement | null>(null);
  const searchInputHostRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { state } = useSidebar();
  const isSidebarActive = state === "expanded";

  const query = String(searchValue || "").trim();
  const isSuggestionsOpen = Boolean(showSuggestions && query);
  const hasOrgLabel = Boolean(resortName || branchName);

  useEffect(() => {
    setUserName(
      getCookieData("resortUserName") || getCookieData("resortShortName") || "",
    );
    setResortName(getCookieData("resortName") || "");
    setBranchName(getCookieData("resortBranchName") || "");
    setMounted(true);
  }, []);

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 768px)");
    const compactMq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      if (desktopMq.matches) setMobileSearchOpen(false);
      setIsCompactViewport(compactMq.matches);
    };
    sync();
    desktopMq.addEventListener("change", sync);
    compactMq.addEventListener("change", sync);
    return () => {
      desktopMq.removeEventListener("change", sync);
      compactMq.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    const box = orgLabelBoxRef.current;
    const measure = orgLabelMeasureRef.current;
    if (!box || !measure || !hasOrgLabel) {
      setStackOrgLabel(false);
      return;
    }

    const update = () => {
      setStackOrgLabel(measure.scrollWidth > box.clientWidth + 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, [hasOrgLabel, resortName, branchName, mounted]);

  useLayoutEffect(() => {
    if (!isSuggestionsOpen) {
      setSuggestBox(null);
      return;
    }

    const updatePosition = () => {
      const el = searchWrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 16);
      const left = Math.min(
        Math.max(8, rect.left),
        window.innerWidth - width - 8,
      );
      setSuggestBox({
        top: rect.bottom + 6,
        left,
        width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isSuggestionsOpen, suggestions.length, query, mobileSearchOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchValue]);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const input = searchInputHostRef.current?.querySelector("input");
    input?.focus();
  }, [mobileSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (searchWrapRef.current?.contains(target)) return;
      if (suggestPanelRef.current?.contains(target)) return;
      setShowSuggestions?.(false);
      if (!query) setMobileSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, setShowSuggestions]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selected = suggestions[activeIndex] || suggestions[0];
    if (selected) {
      handleSelectSuggestion?.(selected);
      setMobileSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Escape") {
      setShowSuggestions?.(false);
      if (!query) setMobileSearchOpen(false);
      return;
    }
    if (!isSuggestionsOpen || !suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1,
      );
    }
  };

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setShowSuggestions?.(false);
    searchForm.setValue("search", "");
  };

  const searchField = searchForm ? (
    <div ref={searchInputHostRef}>
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
            className={searchInputClass}
            startContent={
              <MdSearch className="text-lg text-muted-foreground transition-colors duration-200 dark:text-[#adb5bd]" />
            }
            onInput={() => setShowSuggestions?.(true)}
          />
        </form>
      </Form>
    </div>
  ) : null;

  const suggestionsPortal =
    mounted &&
    isSuggestionsOpen &&
    suggestBox &&
    createPortal(
      <div
        ref={suggestPanelRef}
        className="fixed z-[200] overflow-hidden rounded-[0.625rem] border border-border bg-popover text-popover-foreground shadow-xl"
        style={{
          top: suggestBox.top,
          left: suggestBox.left,
          width: suggestBox.width,
        }}
      >
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
                  onClick={() => {
                    handleSelectSuggestion?.(item);
                    setMobileSearchOpen(false);
                  }}
                  className={cn(
                    "w-full cursor-pointer px-3 py-2 text-left transition-colors duration-150 ease-out",
                    index === activeIndex ? "bg-primary/10" : "hover:bg-muted",
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
      </div>,
      document.body,
    );

  const showStackedOrg = isCompactViewport || stackOrgLabel;

  return (
    <header className="relative z-40 flex h-[var(--header-height)] w-full shrink-0 items-center gap-2 border-b-0 bg-chrome px-2 sm:gap-3 sm:px-4 lg:gap-4 lg:px-5">
      {/* Left: trigger + resort / branch */}
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 sm:gap-3",
          mobileSearchOpen ? "hidden md:flex" : "flex",
        )}
      >
        <SidebarTrigger
          aria-pressed={isSidebarActive}
          className={cn(
            "size-9 shrink-0 cursor-pointer rounded-[0.625rem] text-chrome-foreground shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.03)] transition-colors duration-200 hover:bg-primary/10 hover:text-primary",
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
          className="hidden h-4 shrink-0 bg-chrome-border data-[orientation=vertical]:h-4 sm:block"
        />

        {/* Resort + branch name — all devices */}
        <div
          ref={orgLabelBoxRef}
          className="relative flex min-w-0 flex-1 items-center pr-1"
        >
          <span
            ref={orgLabelMeasureRef}
            aria-hidden
            className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap font-display text-sm font-semibold tracking-wide sm:text-base"
          >
            {resortName}
            {resortName && branchName ? " · " : ""}
            {branchName}
          </span>

          {!mounted ? (
            <div className="flex w-full min-w-0 flex-col gap-1">
              <Skeleton className="h-3.5 w-28 rounded bg-muted sm:h-4 sm:w-36" />
              <Skeleton className="h-3 w-16 rounded bg-muted sm:hidden" />
            </div>
          ) : hasOrgLabel ? (
            <div
              className={cn(
                "flex min-w-0 max-w-full leading-tight",
                showStackedOrg
                  ? "flex-col gap-0.5"
                  : "flex-row items-baseline gap-2",
              )}
            >
              {resortName ? (
                <span
                  className="truncate font-display text-[0.8125rem] font-semibold tracking-wide text-foreground sm:text-sm md:text-base"
                  title={resortName}
                >
                  {resortName}
                </span>
              ) : null}
              {!showStackedOrg && resortName && branchName ? (
                <span className="shrink-0 text-chrome-muted" aria-hidden>
                  ·
                </span>
              ) : null}
              {branchName ? (
                <span
                  className={cn(
                    "truncate text-chrome-muted",
                    showStackedOrg
                      ? "text-[0.6875rem] sm:text-xs md:text-sm"
                      : "text-xs sm:text-sm md:text-[0.9375rem]",
                  )}
                  title={branchName}
                >
                  {branchName}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right cluster */}
      <div
        className={cn(
          "ml-auto flex items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5",
          mobileSearchOpen ? "min-w-0 flex-1" : "shrink-0",
        )}
      >
        {/* Mobile: icon opens expanded search */}
        {!mobileSearchOpen ? (
          <button
            type="button"
            className={cn(actionBtnClass, "md:hidden")}
            aria-label="Open search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <MdSearch className="text-xl" />
          </button>
        ) : null}

        {/* Expanded mobile search / always-on desktop search */}
        <div
          ref={searchWrapRef}
          className={cn(
            "relative min-w-0",
            mobileSearchOpen
              ? "flex flex-1 items-center gap-1.5"
              : "hidden md:block md:w-[12rem] lg:w-[16rem] xl:w-[20rem]",
          )}
        >
          <div className="min-w-0 flex-1">{searchField}</div>
          {mobileSearchOpen ? (
            <button
              type="button"
              className={cn(actionBtnClass, "md:hidden")}
              aria-label="Close search"
              onClick={closeMobileSearch}
            >
              <MdClose className="text-xl" />
            </button>
          ) : null}
          {suggestionsPortal}
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 sm:gap-2",
            mobileSearchOpen && "hidden md:flex",
          )}
        >
          <ThemeToggle className="size-9 sm:size-10" />

          <button
            type="button"
            className={cn(actionBtnClass, "hidden sm:flex")}
            aria-label="Notifications"
          >
            <MdNotifications className="text-xl" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-warning" />
          </button>

          <button
            type="button"
            className={cn(actionBtnClass, "hidden lg:flex")}
            aria-label="Call"
          >
            <MdCall className="text-xl" />
          </button>

          <div className="mx-0.5 hidden h-6 w-px shrink-0 bg-chrome-border md:mx-1 md:block" />

          <DropdownMenu>
            <DropdownMenuTrigger className="shrink-0 cursor-pointer outline-none">
              {!mounted ? (
                <div className="flex items-center gap-2 px-1 py-1 sm:px-2">
                  <Skeleton className="size-8 rounded-full bg-muted sm:size-9" />
                  <Skeleton className="hidden h-4 w-20 rounded bg-muted xl:block" />
                </div>
              ) : userName ? (
                <div className="group flex cursor-pointer items-center gap-1.5 rounded-[0.625rem] px-1 py-1 transition-all duration-150 ease-out hover:bg-primary/5 active:scale-95 sm:gap-2 sm:px-2 sm:py-1.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105 sm:size-9">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[8rem] truncate text-sm font-medium text-chrome-foreground xl:block 2xl:max-w-[11rem]">
                    {userName}
                  </span>
                  <MdOutlineArrowDropDown className="hidden text-lg text-chrome-muted transition-transform duration-200 ease-out group-hover:text-primary xl:block" />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-1 py-1 sm:px-2">
                  <Skeleton className="size-8 rounded-full bg-muted sm:size-9" />
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
      </div>
    </header>
  );
};

export default Navbar;
