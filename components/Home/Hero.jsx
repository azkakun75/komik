"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Flame, Star, AlertCircle, RefreshCcw } from "lucide-react";
import { getTrending } from "@/lib/api";
import { safeImage } from "@/lib/utils";

export default function Hero() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getTrending()
      .then((d) => {
        if (!alive) return;
        const filtered = d
          .filter((x) => x.image && !x.title?.toLowerCase().includes("apk"))
          .slice(0, 6);
        setItems(filtered);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || "Gagal memuat trending");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items]);

  const current = items[active];

  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="container-page relative pb-12 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
              <Flame className="h-3 w-3" /> Trending now · #ComicVerse
            </div>
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.slug + active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-balance font-display text-4xl font-black leading-[1.05] tracking-tight text-text sm:text-5xl md:text-6xl">
                    {current.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-subtext">
                    {current.chapter && (
                      <span className="chip">{current.chapter}</span>
                    )}
                    {current.timeframe && (
                      <span className="chip">{current.timeframe}</span>
                    )}
                    {current.score != null && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] text-accent">
                        <Star className="h-3 w-3" />{" "}
                        {Number(current.score).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-subtext sm:text-base">
                    Masuk ke arena pembaca premium. Long-strip yang halus,
                    kontrol baca yang serius, dan koleksi tanpa batas dari
                    manga, manhwa, dan manhua paling hot minggu ini.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/comic/${current.slug}?link=${encodeURIComponent(
                        current.processedLink || ""
                      )}`}
                      className="btn-primary"
                    >
                      <Play className="h-4 w-4" /> Read now
                    </Link>
                    <Link href="/random" className="btn">
                      <Sparkles className="h-4 w-4" /> Surprise me
                    </Link>
                    <Link href="/genres" className="btn">
                      Explore genres
                    </Link>
                  </div>
                </motion.div>
              ) : error && !loading ? (
                <div className="panel flex flex-col items-start gap-4 p-6">
                  <div className="flex items-center gap-2 text-accent">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      Comic API not reachable
                    </span>
                  </div>
                  <p className="text-sm text-subtext">
                    Upstream source sedang lambat atau tidak bisa dihubungi.
                    Coba lagi sebentar lagi.
                  </p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="btn-primary"
                  >
                    <RefreshCcw className="h-4 w-4" /> Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-12 w-3/4 rounded skeleton" />
                  <div className="h-3 w-2/3 rounded skeleton" />
                  <div className="h-3 w-1/2 rounded skeleton" />
                </div>
              )}
            </AnimatePresence>

            {items.length > 1 && (
              <div className="mt-8 flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={
                      "h-1.5 rounded-full transition-all " +
                      (active === i ? "w-8 bg-accent" : "w-3 bg-border/80 hover:bg-subtext")
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/30 via-transparent to-accent/20 blur-2xl" />
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={"hero-" + current.slug + active}
                    initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.95, rotate: 2 }}
                    transition={{ duration: 0.55 }}
                    className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-border/70 bg-elevated shadow-glow"
                  >
                    <Image
                      unoptimized
                      src={safeImage(current.image)}
                      alt={current.title}
                      fill
                      sizes="(max-width: 1024px) 80vw, 420px"
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-accent">
                        Hot pick
                      </div>
                      <div className="line-clamp-2 mt-1 font-display text-lg font-black text-white">
                        {current.title}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!loading && items.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 gap-2 sm:flex">
                {items.slice(0, 4).map((p, i) => (
                  <button
                    type="button"
                    key={p.slug + i}
                    onClick={() => setActive(i)}
                    className={
                      "relative h-16 w-12 overflow-hidden rounded-md border transition " +
                      (active === i
                        ? "border-accent shadow-glow"
                        : "border-border/60 opacity-70 hover:opacity-100")
                    }
                  >
                    <Image
                      unoptimized
                      src={safeImage(p.image)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-ink-grid bg-[length:20px_20px] opacity-[0.18]" />
      <div className="particles -z-10" />
    </section>
  );
}
