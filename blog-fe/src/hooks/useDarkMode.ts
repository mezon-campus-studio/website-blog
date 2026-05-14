"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  // Apply theme to <html>
  const applyTheme = (value: Theme) => {
    document.documentElement.setAttribute("data-theme", value);
  };

  useEffect(() => {
    setMounted(true);

    // 1. Read from DOM (already set by inline script → prevents mismatch)
    const current = document.documentElement.getAttribute("data-theme") as Theme;

    if (current) {
      setTheme(current);
    } else {
      // Fallback (should rarely happen)
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const fallback: Theme = prefersDark ? "dark" : "light";

      applyTheme(fallback);
      setTheme(fallback);
    }

    // 2. Listen to system changes (ONLY if user has NOT overridden)
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem("theme");

      if (!stored) {
        const next: Theme = e.matches ? "dark" : "light";
        applyTheme(next);
        setTheme(next);
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = () => {
    if (!theme) return;

    const next: Theme = theme === "light" ? "dark" : "light";

    applyTheme(next);
    window.localStorage.setItem("theme", next);
    setTheme(next);
  };

  return {
    theme,
    toggleTheme,
    mounted, // useful to avoid rendering icons before ready
  };
};