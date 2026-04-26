"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrending, getUnlimited, getPustaka } from "@/lib/api";
import { shuffle } from "@/lib/utils";
import { Sparkles, RefreshCcw } from "lucide-react";
import ComicCard from "@/components/Comic/ComicCard";
import SkeletonCard from "@/components/Comic/SkeletonCard";

export default function RandomPage() {
  const router = useRouter();
  const [pool, setPool] = useState([]);
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);

  const reroll = (source = pool) => {
    if (!source.length) return;
    setSpinning(true);
    setTimeout(() => {
      setPicks(shuffle(source).slice(0, 6));
      setSpinning(false);
    }, 350);
  };

  useEffect(() => {
    let alive = true;
    Promise.all([
      getTrending().catch(() => []),
      getUnlimited().catch(() => []),
      getPustaka(1).catch(() => []),
      getPustaka(2).catch(() => []),
    ])
      .then(([t, u, p1, p2]) => {
        if (!alive) return;
        const merged = [...t, ...u, ...p1, ...p2].filter(
          (c) =>
            c &&
            c.title &&
            !String(c.title).toLowerCase().includes("apk")
        );
        // dedupe
        const seen = new Set();
        const dedup = merged.filter((c) => {
          const k = c.slug + (c.processedLink || "");
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        setPool(dedup);
        setPicks(shuffle(dedup).slice(0, 6));
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const goSurprise = () => {
    if (!pool.length) return;
    const r = pool[Math.floor(Math.random() * pool.length)];
    router.push(
      `/comic/${r.slug}?link=${encodeURIComponent(r.processedLink || "")}`
    );
  };

  return (
    <div className="container-page py-10">
      <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">
        Surprise me
      </div>
      <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
        Random Comic Roulette
      </h1>
      <p className="mt-2 max-w-xl text-sm text-subtext">
        Bingung mau baca apa? Biar AFZN yang putuskan. Tekan tombol untuk
        random pick, atau klik salah satu kartu di bawah.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={goSurprise}
          className="btn-primary"
          disabled={loading || pool.length === 0}
        >
          <Sparkles className="h-4 w-4" /> Surprise me
        </button>
        <button
          type="button"
          onClick={() => reroll()}
          className="btn"
          disabled={loading}
        >
          <RefreshCcw
            className={"h-4 w-4 " + (spinning ? "animate-spin" : "")}
          />
          Reroll selection
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {(loading || spinning ? Array.from({ length: 6 }) : picks).map((c, i) =>
          c ? (
            <ComicCard
              key={(c.slug || "") + i}
              comic={c}
              index={i}
            />
          ) : (
            <SkeletonCard key={"s" + i} />
          )
        )}
      </div>
    </div>
  );
}
