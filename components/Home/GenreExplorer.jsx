"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGenres } from "@/lib/api";
import { Compass } from "lucide-react";

const COLOR_RING = [
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-cyan-500",
  "from-indigo-500 to-fuchsia-500",
  "from-amber-500 to-rose-500",
  "from-sky-500 to-emerald-500",
  "from-violet-500 to-pink-500",
];

export default function GenreExplorer() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getGenres()
      .then((d) => alive && setGenres(d || []))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {(loading ? Array.from({ length: 12 }) : genres).map((g, i) => (
        <Link
          key={g?.value || i}
          href={g ? `/genres/${g.value}` : "/genres"}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-4 transition hover:border-accent/40"
        >
          <div
            className={
              "absolute -inset-px -z-10 bg-gradient-to-br opacity-0 blur transition group-hover:opacity-30 " +
              COLOR_RING[i % COLOR_RING.length]
            }
          />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-elevated/60 text-accent">
              <Compass className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              {g ? (
                <>
                  <div className="line-clamp-1 text-sm font-semibold">
                    {g.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-subtext">
                    {g.value}
                  </div>
                </>
              ) : (
                <>
                  <div className="h-3 w-20 rounded skeleton" />
                  <div className="mt-1 h-2 w-12 rounded skeleton" />
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
