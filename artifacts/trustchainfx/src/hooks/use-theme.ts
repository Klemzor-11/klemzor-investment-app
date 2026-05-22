import { useState, useLayoutEffect } from "react";

export type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("trustchain_theme") as Theme | null;
    return saved ?? "dark";
  });

  useLayoutEffect(() => {
    applyTheme(theme);
    localStorage.setItem("trustchain_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle };
}

// Call this in main.tsx before React renders to prevent flash
export function initTheme() {
  const saved = localStorage.getItem("trustchain_theme") as Theme | null;
  applyTheme(saved ?? "dark");
}
