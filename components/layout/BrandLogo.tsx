"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "auto" | "icon" | "full";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  priority?: boolean;
};

/**
 * Brand mark — uses clean icon + wordmark to avoid PNG fringe borders
 * on combined logo-dark / logo-white assets.
 *
 * icon:     /logo.png
 * wordmark: /logo-text.png (inverted in dark) | /logo-white word via invert
 * optional full: logo-dark (light) / logo-white (dark) when `variant="full"`
 */
const BrandLogo = ({
  variant = "auto",
  className,
  iconClassName,
  textClassName,
  priority = false,
}: BrandLogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <Image
        src="/logo.png"
        alt="Innap"
        width={40}
        height={40}
        priority={priority}
        className={cn(
          "size-10 shrink-0 border-0 object-contain outline-none ring-0 shadow-none",
          iconClassName,
          className,
        )}
      />
    );
  }

  if (variant === "full") {
    return (
      <Image
        src={isDark ? "/logo-white.png" : "/logo-dark.png"}
        alt="Innap"
        width={150}
        height={42}
        priority={priority}
        className={cn(
          "h-9 w-auto max-w-[150px] border-0 object-contain object-left outline-none ring-0 shadow-none",
          className,
        )}
      />
    );
  }

  // auto: icon + wordmark (no fringe from combined exports)
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        priority={priority}
        aria-hidden
        className={cn(
          "size-10 shrink-0 border-0 object-contain outline-none ring-0 shadow-none",
          iconClassName,
        )}
      />
      <Image
        src="/logo-text.png"
        alt="Innap"
        width={110}
        height={32}
        priority={priority}
        className={cn(
          "h-7 w-auto border-0 object-contain object-left outline-none ring-0 shadow-none",
          isDark && "brightness-0 invert",
          textClassName,
        )}
      />
    </div>
  );
};

export default BrandLogo;
