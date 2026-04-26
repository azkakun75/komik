"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { searchComics } from "@/lib/api";
import ComicGrid from "@/components/Comic/ComicGrid";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "all", label: "Semua" },
  { id: "manga", label: "Manga" },
  { id: "manhwa", label: "Manhwa" },
  { id: "manhua", label: "Manhua" },
];

export default function SearchClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialQ = sp.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [committed, setCommitted] = useState(initialQ);
  const [type, setType] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const inputRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setCommitted("");
      return;
    }
    const t = setTimeout(() => setCommitted(q.trim()), 320);
    return () => clearTimeout(t);
  }, [q]);

  // Sync URL
  useEffect(() => {
    if (committed && committed !== initialQ) {
      router.replace(`/search?q=${encodeURIComponent(committed)}`, {
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed]);

  // Fetch
  useEffect(() => {
    if (!committed) return;
    let alive = true;
    setLoading(true);
    searchComics(committed)
      .then((d) => alive && setResults(d))
      .catch(() => alive && setResults([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [committed]);

  const filtered = useMemo(() => {
    if (type === "all") return results;
    return results.filter((c) =>
      String(c.type || c.category || "")
        .toLowerCase()
        .includes(type)
    );
  }, [results, type]);

  const visible = filtered.slice(0, page * 24);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      if (
        el.scrollHeight - window.scrollY - el.clientHeight < 600 &&
        visible.length < filtered.length
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible.length, filtered.length]);

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">
          Search
        </div>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Find your next obsession
        </h1>
        <p className="mt-2 text-sm text-subtext">
          Real-time search di seluruh katalog. Coba “Solo Leveling”, “Tower of
          God”, atau “Eleceed”.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-4 py-2">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          ) : (
            <SearchIcon className="h-5 w-5 text-subtext" />
          )}
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            autoFocus
            placeholder="Ketik judul, pengarang, atau genre..."
            className="w-full bg-transparent py-2 text-base outline-none placeholder:text-subtext/70"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                type === t.id
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border/60 bg-elevated/40 text-subtext hover:text-text"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {!committed ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center text-sm text-subtext">
            Mulai mengetik untuk pencarian live.
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-subtext">
              {loading
                ? "Mencari..."
                : `${filtered.length} hasil untuk "${committed}"`}
            </div>
            <ComicGrid
              items={visible}
              loading={loading && visible.length === 0}
            />
            {!loading && visible.length < filtered.length && (
              <div className="mt-6 text-center text-sm text-subtext">
                Memuat lebih banyak...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
