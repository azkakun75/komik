"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTrending } from "@/lib/api";
import { safeImage } from "@/lib/utils";

export default function Top10() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getTrending()
      .then((d) => {
        if (!alive) return;
        // Prefer weekly timeframe if present, else fall back to whole list.
        const weekly = d.filter(
          (x) =>
            String(x.timeframe || "").toLowerCase().includes("week") &&
            !x.title?.toLowerCase().includes("apk")
        );
        const list = (weekly.length ? weekly : d).slice(0, 10);
        setItems(list);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
      {(loading ? Array.from({ length: 10 }) : items).map((c, i) => (
        <div
          key={i + (c?.slug || "")}
          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/60 p-3 transition hover:border-accent/40"
        >
          <div className="relative w-9 shrink-0 text-right font-display text-3xl font-black leading-none tracking-tighter text-accent">
            <span
              className="absolute inset-0 -z-10 blur-[14px]"
              aria-hidden
              style={{ background: "rgb(var(--c-accent)/0.55)" }}
            />
            {String(i + 1).padStart(2, "0")}
          </div>
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-elevated">
            {!loading && c?.image ? (
              <Image
                unoptimized
                src={safeImage(c.image)}
                alt={c.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 skeleton" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {loading ? (
              <>
                <div className="h-3 w-2/3 rounded skeleton" />
                <div className="mt-2 h-2.5 w-1/2 rounded skeleton" />
              </>
            ) : (
              <Link
                href={`/comic/${c.slug}?link=${encodeURIComponent(
                  c.processedLink || ""
                )}`}
                className="block"
              >
                <div className="line-clamp-1 text-sm font-semibold">
                  {c.title}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-subtext">
                  {c.chapter && <span>{c.chapter}</span>}
                  {c.timeframe && <span>· {c.timeframe}</span>}
                </div>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
