"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const AuthShell = ({ title, subtitle, children, footer }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex h-full min-h-dvh items-center justify-center overflow-y-auto bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center justify-center gap-2">
          {isDark ? (
            <Image
              src="/logo-white.png"
              alt="Innap"
              width={160}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          ) : (
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Innap"
                width={44}
                height={44}
                className="size-11 rounded-[0.75rem] object-contain"
                priority
              />
              <Image
                src="/logo-text.png"
                alt="Innap"
                width={120}
                height={36}
                className="h-8 w-auto object-contain object-left"
                priority
              />
            </div>
          )}
          <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Hotel Admin
          </p>
        </div>

        <div className="rounded-[0.625rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>

        {footer ? (
          <div className="mt-5 text-center text-sm">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthShell;
