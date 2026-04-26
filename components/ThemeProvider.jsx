"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME, THEMES } from "@/lib/themes";

const ThemeCtx = createContext({ theme: DEFAULT_THEME, setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial = DEFAULT_THEME;
    try {
      const saved = localStorage.getItem("afzn-theme");
      if (saved && THEMES.some((t) => t.id === saved)) initial = saved;
    } catch (_) {}
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  const setTheme = (id) => {
    if (!THEMES.some((t) => t.id === id)) return;
    setThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem("afzn-theme", id);
    } catch (_) {}
  };

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
