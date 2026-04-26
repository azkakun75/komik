"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEMES } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";
import { Palette, Check } from "lucide-react";

export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn"
        aria-label="Switch theme"
      >
        <Palette className="h-4 w-4" />
        {!compact && <span className="hidden sm:inline">Theme</span>}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <button
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-72 panel p-2"
            >
              <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-subtext">
                Choose your reading aesthetic
              </div>
              <div className="space-y-1">
                {THEMES.map((t) => {
                  const active = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setOpen(false);
                      }}
                      className={
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition " +
                        (active
                          ? "bg-accent/10 text-text"
                          : "hover:bg-elevated/60")
                      }
                    >
                      <div className="flex -space-x-1">
                        {t.swatch.map((c) => (
                          <span
                            key={c}
                            className="h-5 w-5 rounded-full border border-black/30"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{t.label}</div>
                        <div className="text-xs text-subtext">
                          {t.description}
                        </div>
                      </div>
                      {active && <Check className="h-4 w-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
