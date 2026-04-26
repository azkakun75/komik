"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Loader2, X } from "lucide-react";
import { searchComics } from "@/lib/api";
import { safeImage } from "@/lib/utils";

export default function QuickSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchComics(q);
        if (!cancelled) setResults(res.slice(0, 8));
      } catch (e) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-30 inline-flex items-center gap-2 rounded-full border border-border/60 bg-bg/85 px-4 py-2 text-sm text-subtext shadow-panel backdrop-blur-md hover:text-accent sm:bottom-7 sm:left-7"
        aria-label="Quick search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Quick Search</span>
        <kbd className="ml-1 rounded border border-border/60 bg-elevated/60 px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto mt-[10vh] w-[min(640px,94vw)] panel overflow-hidden"
            >
              <div className="relative flex items-center border-b border-border/60 px-4">
                <Search className="h-4 w-4 text-subtext" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="Cari komik favorit kamu... (Solo Leveling, Tower of God, ...)"
                  className="w-full bg-transparent px-3 py-4 text-sm outline-none placeholder:text-subtext/70"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && q.trim()) {
                      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                      setOpen(false);
                    }
                  }}
                />
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : (
                  <button
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1 text-subtext hover:text-text"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="max-h-[50vh] overflow-auto p-2">
                {!q && (
                  <div className="flex items-center gap-2 px-3 py-6 text-sm text-subtext">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Mulai mengetik untuk live search... atau tekan Enter untuk
                    melihat hasil lengkap.
                  </div>
                )}
                {q && !loading && results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-subtext">
                    Tidak ada hasil untuk{" "}
                    <span className="text-text">“{q}”</span>.
                  </div>
                )}
                {results.map((r) => (
                  <Link
                    key={r.slug + r.processedLink}
                    href={`/comic/${r.slug}?link=${encodeURIComponent(
                      r.processedLink
                    )}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-elevated/60"
                  >
                    <div className="relative h-12 w-9 overflow-hidden rounded bg-elevated">
                      {r.image && (
                        <Image
                          src={safeImage(r.image)}
                          alt={r.title}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="line-clamp-1 text-sm font-medium">
                        {r.title}
                      </div>
                      {r.altTitle && (
                        <div className="line-clamp-1 text-xs text-subtext">
                          {r.altTitle}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
