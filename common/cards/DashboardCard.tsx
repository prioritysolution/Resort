import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  value?: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  trend?: ReactNode;
  gradient?: string;
  className?: string;
};

const DashboardCard = ({
  title,
  value,
  hint,
  icon,
  trend,
  gradient,
  className,
}: DashboardCardProps) => {
  const isGradient = Boolean(gradient);

  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-3 rounded-[0.625rem] p-4 sm:p-5",
        isGradient
          ? cn(gradient, "border-0 text-white shadow-sm")
          : "border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-medium",
              isGradient ? "text-white/90" : "text-muted-foreground",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "font-display mt-1 truncate text-2xl font-semibold tracking-tight",
              isGradient ? "text-white" : "text-foreground",
            )}
          >
            {value}
          </p>
        </div>
        {icon ? (
          <div
            className={cn(
              "flex size-[58px] shrink-0 items-center justify-center rounded-[0.625rem]",
              isGradient
                ? "bg-white/20 text-white"
                : "bg-primary/10 text-primary",
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        {trend ? (
          <span
            className={cn(
              "font-medium",
              isGradient
                ? "text-white/90"
                : String(trend).startsWith("-")
                  ? "text-destructive"
                  : "text-success",
            )}
          >
            {trend}
          </span>
        ) : (
          <span />
        )}
        {hint ? (
          <span className={isGradient ? "text-white/80" : "text-muted-foreground"}>
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardCard;
