"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
  type DayPickerProps,
} from "react-day-picker";
import {
  format,
  setMonth,
  setYear,
  startOfYear,
  addYears,
  subYears,
  addMonths,
  subMonths,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

type CalendarView = "days" | "months" | "years";

function Calendar(  
  allProps: DayPickerProps & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  },
) {
  const {
    className,
    classNames,
    showOutsideDays = true,
    buttonVariant = "ghost",
    locale,
    components,
    selected,
    onSelect,
    mode,
    ...props
  } = allProps as any;
  const [view, setView] = React.useState<CalendarView>("days");
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    (selected as Date) || new Date(),
  );

  React.useEffect(() => {
    if (selected instanceof Date) {
      setCurrentMonth(selected);
    }
  }, [selected]);

  const defaultClassNames = getDefaultClassNames();

  const handleMonthSelect = (monthIndex: number) => {
    const newMonth = setMonth(currentMonth, monthIndex);
    setCurrentMonth(newMonth);
    setView("days");
  };

  const handleYearSelect = (year: number) => {
    const newMonth = setYear(currentMonth, year);
    setCurrentMonth(newMonth);
    setView("months");
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (onSelect) {
      // @ts-ignore
      onSelect(today);
    }
    setView("days");
  };

  // Years for the decade view
  const currentYear = currentMonth.getFullYear();
  const startYear = Math.floor(currentYear / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className={cn("p-3 space-y-4", className)}>
      {view === "days" && (
        <>
          <div className="flex items-center justify-between px-1 relative">
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCurrentMonth(subYears(currentMonth, 1))}
              >
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="h-7 px-2 text-sm font-semibold hover:bg-accent"
                onClick={() => setView("months")}
              >
                {format(currentMonth, "MMM")}
              </Button>
              <Button
                variant="ghost"
                className="h-7 px-2 text-sm font-semibold hover:bg-accent"
                onClick={() => setView("years")}
              >
                {format(currentMonth, "yyyy")}
              </Button>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCurrentMonth(addYears(currentMonth, 1))}
              >
                <ChevronsRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DayPicker
            mode={mode as any}
            selected={selected as any}
            onSelect={onSelect as any}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            showOutsideDays={showOutsideDays}
            className={cn(
              "group/calendar [--cell-radius:var(--radius-md)] [--cell-size:--spacing(9)]",
              String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
              String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
            )}
            classNames={{
              root: cn("w-fit", defaultClassNames.root),
              months: cn(
                "relative flex flex-col gap-4",
                defaultClassNames.months,
              ),
              month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
              nav: cn(
                "absolute right-0 top-0 flex items-center justify-end gap-1 z-10 hidden",
                defaultClassNames.nav,
              ), // Hidden as we use custom header
              month_caption: "hidden", // Hidden as we use custom header
              table: "w-full border-collapse",
              weekdays: cn("flex", defaultClassNames.weekdays),
              weekday: cn(
                "flex-1 text-[0.8rem] font-normal text-muted-foreground select-none",
                defaultClassNames.weekday,
              ),
              week: cn("mt-2 flex w-full", defaultClassNames.week),
              day: cn(
                "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none",
                defaultClassNames.day,
              ),
              today: cn(
                "bg-primary/15 font-semibold text-primary",
                defaultClassNames.today,
              ),
              outside: cn(
                "text-muted-foreground opacity-70",
                defaultClassNames.outside,
              ),
              disabled: cn(
                "cursor-not-allowed bg-muted/50 text-muted-foreground opacity-100",
                defaultClassNames.disabled,
              ),
              ...classNames,
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeftIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                ),
              DayButton: ({ ...props }) => (
                <CalendarDayButton locale={locale} {...props} />
              ),
              ...components,
            }}
            {...props}
          />

          <div className="flex justify-center border-t pt-2">
            <Button
              variant="link"
              className="text-xs font-medium  hover:no-underline cursor-pointer text-blue-600"
              onClick={handleTodayClick}
            >
              Today
            </Button>
          </div>
        </>
      )}

      {view === "months" && (
        <div className="w-[280px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <Button
              variant="ghost"
              className="h-8 text-sm font-bold text-blue-600 cursor-pointer hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setView("years")}
            >
              {format(currentMonth, "yyyy")}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={
                  currentMonth.getMonth() === index ? "default" : "ghost"
                }
                className={cn(
                  "cursor-pointer h-12 text-sm transition-all",
                  currentMonth.getMonth() === index &&
                    "bg-blue-500 text-white hover:bg-blue-600",
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      )}

      {view === "years" && (
        <div className="w-[280px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <Button
              variant="ghost"
              className="h-8 text-sm font-bold text-blue-600"
              disabled
            >
              {startYear} - {startYear + 9}
            </Button>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCurrentMonth(subYears(currentMonth, 10))}
              >
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCurrentMonth(addYears(currentMonth, 10))}
              >
                <ChevronsRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant={currentYear === year ? "default" : "ghost"}
                className={cn(
                  "cursor-pointer h-12 text-sm transition-all",
                  currentYear === year &&
                    "bg-blue-500 text-white hover:bg-blue-600",
                  (year < startYear || year > startYear + 9) && "opacity-30",
                )}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "cursor-pointer relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal",
        modifiers.selected &&
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
        modifiers.today &&
          !modifiers.selected &&
          "bg-primary/15 font-semibold text-primary hover:bg-primary/20 hover:text-primary",
        modifiers.disabled &&
          "cursor-not-allowed bg-muted/50 text-muted-foreground opacity-100 hover:bg-muted/50 hover:text-muted-foreground",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
