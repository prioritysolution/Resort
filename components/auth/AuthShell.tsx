"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  busy?: boolean;
};

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
  busy = false,
}: AuthShellProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12 lg:px-8">
      <div
        className={cn(
          "w-full max-w-[22rem] transition-all duration-500 ease-out sm:max-w-[28rem] md:max-w-[34rem] lg:max-w-[38rem]",
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <div
          className={cn(
            "min-h-[28rem] rounded-2xl border border-border/80 bg-card",
            "px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]",
            "transition-[box-shadow,opacity,transform] duration-300 ease-out",
            "sm:min-h-[32rem] sm:px-10 sm:py-11",
            "md:min-h-[36rem] md:px-12 md:py-12",
            "lg:min-h-[38rem] lg:rounded-[1.25rem] lg:px-14 lg:py-14",
            busy && "pointer-events-none opacity-90",
          )}
        >
          <div className="mb-7 flex flex-col items-center text-center sm:mb-9 md:mb-10">
            {isDark ? (
              <Image
                src="/logo-white.png"
                alt="Innap"
                width={180}
                height={50}
                className="h-11 w-auto object-contain sm:h-12 md:h-[3.25rem]"
                priority
              />
            ) : (
              <Image
                src="/logo-dark.png"
                alt="Innap"
                width={180}
                height={50}
                className="h-11 w-auto object-contain sm:h-12 md:h-[3.25rem]"
                priority
              />
            )}
            <h4 className="font-display mt-6 text-[1.35rem] font-semibold tracking-tight sm:mt-7 sm:text-2xl md:text-[1.75rem]">
              {title}
            </h4>
            {subtitle ? (
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="mx-auto w-full max-w-md md:max-w-lg">{children}</div>

          {footer ? (
            <div className="mx-auto mt-7 max-w-md text-center text-sm leading-relaxed text-muted-foreground sm:mt-8 md:max-w-lg md:mt-9">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
