export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface/40">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-3">
        <div className="h-3 w-3/4 rounded skeleton" />
        <div className="mt-2 h-2.5 w-1/2 rounded skeleton" />
      </div>
    </div>
  );
}
