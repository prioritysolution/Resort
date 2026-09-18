"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BedDouble, CalendarCheck, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import DashboardCard from "@/common/cards/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeader,
  PageLoader,
  PageSection,
  PageShell,
  PageShellContent,
} from "@/components/shared";
import type { CashTrendPoint, DashboardStats } from "@/container/dashboard/home/types";

type KpiMeta = {
  key: string;
  trendKey: string;
  title: string;
  hint: string;
  gradient: string;
  icon: ReactNode;
};

const KPI_META: KpiMeta[] = [
  {
    key: "newBooking",
    trendKey: "bookingTrend",
    title: "New Booking",
    hint: "this week",
    gradient: "innap-gradient-1",
    icon: <CalendarCheck className="size-7" />,
  },
  {
    key: "scheduleRoom",
    trendKey: "scheduleTrend",
    title: "Schedule Room",
    hint: "upcoming",
    gradient: "innap-gradient-2",
    icon: <BedDouble className="size-7" />,
  },
  {
    key: "checkIn",
    trendKey: "checkInTrend",
    title: "Check In",
    hint: "today",
    gradient: "innap-gradient-3",
    icon: <LogIn className="size-7" />,
  },
  {
    key: "checkOut",
    trendKey: "checkOutTrend",
    title: "Check Out",
    hint: "today",
    gradient: "innap-gradient-4",
    icon: <LogOut className="size-7" />,
  },
];

type DashboardHomeViewProps = {
  stats: DashboardStats | null;
  cashTrend: CashTrendPoint[];
  loading: boolean;
  userName: string;
  orgName: string;
};

const DashboardHomeView = ({
  stats,
  cashTrend,
  loading,
  userName,
  orgName,
}: DashboardHomeViewProps) => {
  const today = format(new Date(), "EEEE, dd MMM yyyy");

  const kpis = KPI_META.map((item) => ({
    ...item,
    value: stats?.[item.key] ?? "—",
    trend: stats?.[item.trendKey],
  }));

  return (
    <PageShell flush className="h-full">
      <PageHeader
        title="Dashboard"
        description={`${orgName} · Welcome back, ${userName} · ${today}`}
        className="border-0 bg-transparent px-0"
        titleClassName="font-display text-[1.875rem] font-semibold max-lg:text-[1.5rem] max-md:text-[1.3rem]"
      />

      <PageShellContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading && !stats
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-32 rounded-[0.625rem] bg-secondary"
                />
              ))
            : kpis.map((kpi) => (
                <DashboardCard
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  trend={kpi.trend}
                  hint={kpi.hint}
                  icon={kpi.icon}
                  gradient={kpi.gradient}
                />
              ))}
        </div>

        <div className="grid min-h-0 grid-cols-1 gap-4 xl:grid-cols-5">
          <PageSection
            className="xl:col-span-3"
            title="Booking trend"
            action={
              <span className="font-display text-xs text-muted-foreground">
                Overview
              </span>
            }
          >
            <div className="h-56 w-full sm:h-72">
              {loading && !cashTrend?.length ? (
                <PageLoader variant="section" label="Loading…" className="!min-h-56 h-full !py-0" />
              ) : cashTrend?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashTrend}>
                    <defs>
                      <linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#1362FC"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1362FC"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{
                        fontSize: 12,
                        fill: "var(--muted-foreground)",
                        fontFamily: "var(--font-poppins)",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 12,
                        fill: "var(--muted-foreground)",
                        fontFamily: "var(--font-poppins)",
                      }}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--popover)",
                        color: "var(--popover-foreground)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#1362FC"
                      fill="url(#cashFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No booking trend data yet.
                </div>
              )}
            </div>
          </PageSection>

          <PageSection
            className="xl:col-span-2"
            title="Today at the hotel"
            headerClassName="sm:justify-center"
          >
            <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              Live hotel summary will appear here when the API is available.
            </div>
          </PageSection>
        </div>
      </PageShellContent>
    </PageShell>
  );
};

export default DashboardHomeView;
