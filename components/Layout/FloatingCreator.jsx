"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/themes";
import { Heart, X, Sparkles } from "lucide-react";

const ICONS = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16.6 5.82A4.27 4.27 0 0 1 14.49 2H11v13.07a2.6 2.6 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.06a6.06 6.06 0 1 0 5.21 6V8.74a7.7 7.7 0 0 0 4.6 1.5V6.7a4.3 4.3 0 0 1-2.4-.88Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 21s-7-4.5-9.5-9.2C.5 7.5 3 4 6.5 4 9 4 10.5 5.5 12 7c1.5-1.5 3-3 5.5-3 3.5 0 6 3.5 4 7.8C19 16.5 12 21 12 21Z" />
    </svg>
  ),
};

export default function FloatingCreator() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto w-72 panel overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-accent/30 via-transparent to-transparent p-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 rounded-full bg-bg/40 p-1 text-subtext hover:text-text"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent">
                  Meet the creator
                </div>
                <div className="mt-1 font-display text-xl font-black leading-tight">
                  {SITE.creator.name}
                </div>
                <div className="text-xs text-subtext">{SITE.creator.role}</div>
                <p className="mt-3 text-sm italic text-subtext">
                  “{SITE.creator.quote}”
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {SITE.creator.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-border/60 bg-elevated/50 px-3 py-2 text-xs hover:border-accent/60 hover:text-accent"
                    >
                      {ICONS[s.id]}
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="pointer-events-auto group relative grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-glow"
          aria-label="Open creator card"
        >
          <span className="absolute inset-0 -z-10 animate-glow-pulse rounded-full" />
          {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          <span className="pointer-events-none absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-bg text-accent ring-1 ring-accent/60">
            <Heart className="h-3 w-3" />
          </span>
        </motion.button>
      </div>
    </>
  );
}
