"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useReader = create(
  persist(
    (set) => ({
      width: "comfort", // "narrow" | "comfort" | "wide" | "full"
      mode: "long-strip", // "paged" | "long-strip"
      direction: "ltr", // "ltr" | "rtl"
      brightness: 100, // 50..120
      lightMode: false, // override theme on reader page only
      setWidth: (width) => set({ width }),
      setMode: (mode) => set({ mode }),
      setDirection: (direction) => set({ direction }),
      setBrightness: (brightness) => set({ brightness }),
      setLightMode: (lightMode) => set({ lightMode }),
    }),
    {
      name: "afzn-comicverse-reader",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined)),
      version: 1,
    }
  )
);
