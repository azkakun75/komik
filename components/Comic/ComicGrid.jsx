import ComicCard from "./ComicCard";
import SkeletonCard from "./SkeletonCard";

export default function ComicGrid({ items, loading, skeletonCount = 12 }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-8 text-center text-sm text-subtext">
        Tidak ada komik ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((c, i) => (
        <ComicCard
          key={(c.slug || "x") + (c.processedLink || "") + i}
          comic={c}
          index={i}
        />
      ))}
    </div>
  );
}
