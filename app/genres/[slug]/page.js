"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { searchComics, getGenres } from "@/lib/api";
import ComicGrid from "@/components/Comic/ComicGrid";
import { ChevronLeft } from "lucide-react";

export default function GenreDetailPage() {
  const { slug } = useParams();
  const [name, setName] = useState(slug);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      searchComics(slug || "")
        .then((d) => d)
        .catch(() => []),
      getGenres()
        .then((g) => g)
        .catch(() => []),
    ]).then(([res, all]) => {
      if (!alive) return;
      const found = (all || []).find(
        (g) => String(g.value).toLowerCase() === String(slug).toLowerCase()
      );
      if (found?.name) setName(found.name);
      const filtered = (res || []).filter((c) => {
        const t = String(c.type || c.category || "").toLowerCase();
        const g = String(c.genres || "").toLowerCase();
        return (
          t.includes(String(slug).toLowerCase()) ||
          g.includes(String(slug).toLowerCase()) ||
          true // search results already query-relevant
        );
      });
      setItems(filtered);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

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
        Kurasi judul yang mengandung kata kunci genre ini.
      </p>

      <div className="mt-8">
        <ComicGrid items={items} loading={loading} skeletonCount={12} />
      </div>
    </div>
  );
}
