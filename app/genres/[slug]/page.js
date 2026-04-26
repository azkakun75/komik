"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGenreComics, getGenres } from "@/lib/api";
import ComicGrid from "@/components/Comic/ComicGrid";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GenreDetailPage() {
  const { slug } = useParams();
  const [name, setName] = useState(slug);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const lastSlugRef = useRef(slug);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    // When the user navigates to a different genre, force this fetch (and the
    // next render) to start from page 1 instead of inheriting whatever page
    // they were viewing on the previous genre. Doing the reset inline avoids
    // a wasted upstream request that would otherwise fire with the stale page
    // before a separate `setPage(1)` effect could land.
    const slugChanged = lastSlugRef.current !== slug;
    lastSlugRef.current = slug;
    const effectivePage = slugChanged ? 1 : page;
    if (slugChanged && page !== 1) {
      setPage(1);
    }

    Promise.all([
      getGenreComics(slug || "", effectivePage).catch(() => []),
      getGenres()
        .then((g) => g)
        .catch(() => []),
    ]).then(([res, all]) => {
      if (!alive) return;
      const found = (all || []).find(
        (g) =>
          String(g.value || g.slug || "").toLowerCase() ===
          String(slug).toLowerCase()
      );
      if (found?.name) setName(found.name);
      setItems(res || []);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug, page]);

  return (
    <div className="container-page py-10">
      <Link
        href="/genres"
        className="inline-flex items-center gap-2 text-sm text-subtext hover:text-accent"
      >
        <ChevronLeft className="h-4 w-4" /> Back to genres
      </Link>
      <h1 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">
        Genre · <span className="text-accent">{name}</span>
      </h1>
      <p className="mt-1 text-sm text-subtext">
        Kurasi judul yang termasuk genre ini.
      </p>

      <div className="mt-8">
        <ComicGrid items={items} loading={loading} skeletonCount={12} />
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          className="btn"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <span className="text-xs uppercase tracking-[0.3em] text-subtext">
          Page {page}
        </span>
        <button
          type="button"
          className="btn"
          disabled={loading || items.length === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
