"use client";

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

const KPI_FALLBACK = [
  {
    title: "New Booking",
    value: "872",
    hint: "this week",
    gradient: "innap-gradient-1",
    icon: <CalendarCheck className="size-7" />,
  },
  {
    title: "Schedule Room",
    value: "285",
    hint: "upcoming",
    gradient: "innap-gradient-2",
    icon: <BedDouble className="size-7" />,
  },
  {
    title: "Check In",
    value: "53",
    hint: "today",
    gradient: "innap-gradient-3",
    icon: <LogIn className="size-7" />,
  },
  {
    title: "Check Out",
    value: "78",
    hint: "today",
    gradient: "innap-gradient-4",
    icon: <LogOut className="size-7" />,
  },
];

const DashboardHomeView = ({
  stats,
  cashTrend,
  loading,
  userName,
  orgName,
}) => {
  const today = format(new Date(), "EEEE, dd MMM yyyy");

  const kpis = [
    {
      ...KPI_FALLBACK[0],
      value: stats?.newBooking || KPI_FALLBACK[0].value,
      trend: stats?.bookingTrend,
    },
    {
      ...KPI_FALLBACK[1],
      value: stats?.scheduleRoom || KPI_FALLBACK[1].value,
      trend: stats?.scheduleTrend,
    },
    {
      ...KPI_FALLBACK[2],
      value: stats?.checkIn || KPI_FALLBACK[2].value,
      trend: stats?.checkInTrend,
    },
    {
      ...KPI_FALLBACK[3],
      value: stats?.checkOut || KPI_FALLBACK[3].value,
      trend: stats?.checkOutTrend,
    },
  ];

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 sm:gap-5">
      {/* <div>
        <h1 className="font-display text-[1.875rem] font-semibold text-foreground max-lg:text-[1.5rem] max-md:text-[1.3rem]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orgName} · Welcome back, {userName} · {today}
        </p>
      </div> */}

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
        <div className="rounded-[0.625rem] border border-border bg-card p-4 sm:p-5 xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Booking trend
            </h2>
            <span className="font-display text-xs text-muted-foreground">
              Overview
            </span>
          </div>
          <div className="h-56 w-full sm:h-72">
            {loading && !cashTrend?.length ? (
              <Skeleton className="h-full w-full rounded-md bg-secondary" />
            ) : (
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
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
            )}
          </div>
        </div>

        <div className="rounded-[0.625rem] border border-border bg-card p-4 sm:p-5 xl:col-span-2">
          <h2 className="font-display mb-4 text-center text-lg font-semibold text-foreground">
            Today at the hotel
          </h2>
          <div className="grid gap-3">
            {[
              ["Available rooms", "42"],
              ["Booked rooms", "68"],
              ["Pending check-ins", "7"],
              ["Guest reviews", "12"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[0.625rem] border border-border px-3 py-3"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-display text-base font-semibold text-primary">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeView;
