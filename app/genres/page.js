"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { getGenres } from "@/lib/api";

export default function GenresPage() {
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
    <div className="container-page py-10">
      <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">
        Genres
      </div>
      <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
        Genre Explorer
      </h1>
      <p className="mt-2 max-w-xl text-sm text-subtext">
        Pilih genre untuk filter pencarian. Setiap genre membuka galeri
        spesifik dengan kurasi judul terbaik.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(loading ? Array.from({ length: 18 }) : genres).map((g, i) => (
          <Link
            key={g?.value || i}
            href={g ? `/genres/${g.value}` : "#"}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-5 transition hover:border-accent/40"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/0 via-transparent to-accent/0 opacity-0 transition group-hover:opacity-30" />
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-elevated/60 text-accent">
              <Compass className="h-4 w-4" />
            </div>
            {g ? (
              <>
                <div className="mt-3 text-base font-semibold">{g.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-subtext">
                  {g.value}
                </div>
              </>
            ) : (
              <>
                <div className="mt-3 h-3 w-24 rounded skeleton" />
                <div className="mt-2 h-2 w-12 rounded skeleton" />
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
