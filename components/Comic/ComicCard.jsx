"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Star, BookOpen } from "lucide-react";
import { useLibrary } from "@/store/library";
import { safeImage } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ComicCard({ comic, index = 0, big = false }) {
  const isFav = useLibrary((s) => s.isFavorite(comic.slug));
  const toggleFavorite = useLibrary((s) => s.toggleFavorite);
  const link = `/comic/${comic.slug}?link=${encodeURIComponent(
    comic.processedLink || ""
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
      className={cn("comic-card group relative", big && "h-full")}
    >
      <Link
        href={link}
        className={cn(
          "block overflow-hidden rounded-2xl border border-border/60 bg-surface/70 shadow-panel transition will-change-transform hover:-translate-y-0.5 hover:shadow-ink",
          big ? "h-full" : ""
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-elevated/60",
            big ? "aspect-[2/3]" : "aspect-[2/3]"
          )}
        >
          <Image
            unoptimized
            src={safeImage(comic.image)}
            alt={comic.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(comic);
            }}
            className={cn(
              "absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition",
              isFav ? "text-accent" : "hover:text-accent"
            )}
            aria-label="Bookmark"
          >
            <Bookmark
              className={cn("h-4 w-4", isFav && "fill-current")}
            />
          </button>

          {comic.type && (
            <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
              {comic.type}
            </span>
          )}
          {comic.rating && (
            <span className="absolute left-2 top-9 flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
              <Star className="h-3 w-3" />
              {comic.rating}
            </span>
          )}

          {comic.chapter && (
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 text-white">
              <span className="rounded-md bg-bg/60 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
                {comic.chapter}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium opacity-90">
                <BookOpen className="h-3 w-3" /> Read
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="line-clamp-2 text-sm font-semibold text-text">
            {comic.title}
          </div>
          {comic.altTitle && (
            <div className="line-clamp-1 text-[11px] text-subtext">
              {comic.altTitle}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
