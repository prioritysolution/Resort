"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-[0.625rem] bg-white text-primary shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.03)] transition-all duration-200 ease-out hover:bg-primary/5 active:scale-90 dark:bg-card dark:text-primary",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {!mounted ? (
        <span className="size-5 rounded-full bg-muted" />
      ) : isDark ? (
        <Sun className="size-5 text-warning" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
