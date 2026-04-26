"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/themes";

export default function LoadingScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("afzn-intro")) return;
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem("afzn-intro", "1");
      return;
    }
    setShow(true);
    const t = setTimeout(() => {
      sessionStorage.setItem("afzn-intro", "1");
      setShow(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-bg"
        >
          {/* radial ink spread */}
          <motion.div
            className="absolute h-[180vmax] w-[180vmax] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--c-accent)/0.55) 0%, rgb(var(--c-accent)/0.2) 35%, transparent 70%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* slash sweep */}
          <motion.div
            className="absolute inset-y-0 -left-1/3 w-[40%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-22deg]"
            initial={{ x: "-30%", opacity: 0 }}
            animate={{ x: "260%", opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.65, 0.05, 0.35, 1] }}
          />

          <div className="particles" />

          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="text-[10px] font-semibold uppercase tracking-[0.6em] text-accent"
            >
              Welcome to
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.04em" }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-text drop-shadow-[0_0_24px_rgb(var(--c-accent)/0.55)]"
            >
              {SITE.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              className="mt-3 text-sm text-subtext"
            >
              {SITE.tagline}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
