"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLibrary } from "@/store/library";
import { safeImage } from "@/lib/utils";
import { BookOpen, X } from "lucide-react";

export default function ContinueReadingPopup() {
  const history = useLibrary((s) => s.history);
  const [show, setShow] = useState(false);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("afzn-cr-dismissed");
    if (dismissed) return;
    const entries = Object.values(history || {}).filter(
      (h) => h && h.lastChapter
    );
    if (entries.length === 0) return;
    entries.sort((a, b) => (b.readAt || 0) - (a.readAt || 0));
    setLatest(entries[0]);
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [history]);

  const onClose = () => {
    setShow(false);
    sessionStorage.setItem("afzn-cr-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && latest && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed bottom-24 right-5 z-40 w-72 panel overflow-hidden sm:bottom-28 sm:right-7"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-2 top-2 z-10 rounded-full bg-bg/60 p-1 text-subtext hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 p-3">
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-elevated">
              {latest.image && (
                <Image
                  src={safeImage(latest.image)}
                  alt={latest.title || ""}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-accent">
                Continue reading
              </div>
              <div className="line-clamp-1 font-semibold">{latest.title}</div>
              <div className="text-xs text-subtext">
                Chapter {latest.lastChapter}
              </div>
              <Link
                href={`/read?slug=${encodeURIComponent(
                  latest.slug
                )}&link=${encodeURIComponent(
                  latest.lastChapterLink || ""
                )}&chapter=${encodeURIComponent(latest.lastChapter || "")}`}
                onClick={onClose}
                className="btn-primary mt-2 inline-flex h-8 w-full justify-center px-3 text-xs"
              >
                <BookOpen className="h-3.5 w-3.5" /> Resume
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
