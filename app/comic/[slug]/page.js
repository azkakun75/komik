"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  Star,
  Calendar,
  Tag,
  User,
  Brush,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { getComicDetail, getRecommendations } from "@/lib/api";
import { useLibrary } from "@/store/library";
import { processChapterLink, safeImage } from "@/lib/utils";
import Carousel from "@/components/Home/Carousel";
import SectionHeader from "@/components/Comic/SectionHeader";

export default function ComicDetailPage() {
  const { slug } = useParams();
  const sp = useSearchParams();
  const linkParam = sp.get("link");

  const [detail, setDetail] = useState(null);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFav = useLibrary((s) => s.isFavorite(slug));
  const toggleFavorite = useLibrary((s) => s.toggleFavorite);
  const pushRecent = useLibrary((s) => s.pushRecent);

  useEffect(() => {
    let alive = true;
    const target = linkParam || slug;
    setLoading(true);
    setError(null);

    Promise.all([
      getComicDetail(target).catch((e) => {
        setError(e.message || "Gagal memuat detail komik.");
        return null;
      }),
      getRecommendations().catch(() => []),
    ]).then(([d, recs]) => {
      if (!alive) return;
      setDetail(d);
      setRecommend(recs?.slice(0, 12) || []);
      setLoading(false);
      if (slug) pushRecent(slug);
    });

    return () => {
      alive = false;
    };
  }, [slug, linkParam, pushRecent]);

  const firstChapter = useMemo(() => {
    if (!detail?.chapters?.length) return null;
    const ordered = [...detail.chapters].reverse();
    return ordered[0] || null;
  }, [detail]);

  const latestChapter = useMemo(() => {
    if (!detail?.chapters?.length) return null;
    return detail.chapters[0] || null;
  }, [detail]);

  return (
    <article className="relative">
      {/* Backdrop */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
        {detail?.image && (
          <Image
            src={safeImage(detail.image)}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-40 blur-2xl"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/85 to-bg" />
      </div>

      <div className="container-page pt-10 sm:pt-16">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-[260px_1fr]">
            <div className="aspect-[2/3] rounded-2xl skeleton" />
            <div className="space-y-3">
              <div className="h-6 w-2/3 rounded skeleton" />
              <div className="h-3 w-1/2 rounded skeleton" />
              <div className="h-3 w-1/3 rounded skeleton" />
              <div className="h-32 rounded skeleton" />
            </div>
          </div>
        ) : !detail ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center">
            <div className="text-lg font-semibold">Tidak bisa memuat komik</div>
            <p className="mt-1 text-sm text-subtext">
              {error || "Coba refresh atau kembali ke beranda."}
            </p>
            <Link href="/" className="btn-primary mt-4">
              Kembali ke Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-[260px_1fr]">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto aspect-[2/3] w-full max-w-[260px] overflow-hidden rounded-2xl border border-border/70 bg-elevated shadow-glow"
              >
                <Image
                  src={safeImage(detail.image)}
                  alt={detail.title}
                  fill
                  sizes="260px"
                  priority
                  className="object-cover"
                />
              </motion.div>
              <div className="min-w-0">
                {detail.type && (
                  <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                    <Tag className="h-3 w-3" /> {detail.type}
                  </div>
                )}
                <h1 className="text-balance font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  {detail.title}
                </h1>
                {detail.altTitle && (
                  <div className="mt-1 text-sm text-subtext">
                    {detail.altTitle}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  {detail.rating && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
                      <Star className="h-3.5 w-3.5" /> {detail.rating}
                    </span>
                  )}
                  {detail.status && (
                    <span className="chip">{detail.status}</span>
                  )}
                  {detail.released && (
                    <span className="chip">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      {detail.released}
                    </span>
                  )}
                  {detail.author && (
                    <span className="chip">
                      <User className="mr-1 inline h-3 w-3" />
                      {detail.author}
                    </span>
                  )}
                  {detail.artist && (
                    <span className="chip">
                      <Brush className="mr-1 inline h-3 w-3" />
                      {detail.artist}
                    </span>
                  )}
                </div>

                {detail.genres?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {detail.genres.slice(0, 12).map((g, i) => {
                      const value = typeof g === "string" ? g : g.value || g.name;
                      const label = typeof g === "string" ? g : g.name || g.value;
                      return (
                        <Link
                          key={(value || "g") + i}
                          href={`/genres/${encodeURIComponent(
                            String(value || label).toLowerCase()
                          )}`}
                          className="rounded-full border border-border/60 bg-elevated/50 px-3 py-1 text-[11px] hover:border-accent/60 hover:text-accent"
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {detail.synopsis && (
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-subtext">
                    {detail.synopsis}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {firstChapter?.link && (
                    <Link
                      href={`/read?slug=${encodeURIComponent(
                        slug
                      )}&link=${encodeURIComponent(
                        processChapterLink(firstChapter.link)
                      )}&chapter=${encodeURIComponent(
                        firstChapter.chapter || ""
                      )}&title=${encodeURIComponent(detail.title)}&image=${encodeURIComponent(
                        detail.image || ""
                      )}`}
                      className="btn-primary"
                    >
                      <PlayCircle className="h-4 w-4" /> Start reading
                    </Link>
                  )}
                  {latestChapter?.link && (
                    <Link
                      href={`/read?slug=${encodeURIComponent(
                        slug
                      )}&link=${encodeURIComponent(
                        processChapterLink(latestChapter.link)
                      )}&chapter=${encodeURIComponent(
                        latestChapter.chapter || ""
                      )}&title=${encodeURIComponent(detail.title)}&image=${encodeURIComponent(
                        detail.image || ""
                      )}`}
                      className="btn"
                    >
                      Latest: {latestChapter.chapter} <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite({
                        slug,
                        title: detail.title,
                        image: detail.image,
                        processedLink: linkParam || slug,
                      })
                    }
                    className="btn"
                  >
                    <Bookmark
                      className={"h-4 w-4 " + (isFav ? "fill-accent text-accent" : "")}
                    />
                    {isFav ? "Saved" : "Save to library"}
                  </button>
                </div>
              </div>
            </div>

            {/* Chapter list */}
            <section className="mt-12">
              <SectionHeader
                kicker="Episodes"
                title="Chapters"
                subtitle={`${detail.chapters?.length || 0} chapter tersedia.`}
              />
              {detail.chapters?.length ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {detail.chapters.map((c, i) => (
                    <Link
                      key={(c.link || "c") + i}
                      href={`/read?slug=${encodeURIComponent(
                        slug
                      )}&link=${encodeURIComponent(
                        processChapterLink(c.link)
                      )}&chapter=${encodeURIComponent(
                        c.chapter || ""
                      )}&title=${encodeURIComponent(detail.title)}&image=${encodeURIComponent(
                        detail.image || ""
                      )}`}
                      className="rounded-xl border border-border/60 bg-surface/60 px-3 py-2 text-sm transition hover:border-accent/40 hover:text-accent"
                    >
                      <div className="font-semibold">Ch. {c.chapter}</div>
                      {c.uploaded && (
                        <div className="text-[11px] text-subtext">
                          {c.uploaded}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-8 text-center text-sm text-subtext">
                  Belum ada chapter yang tersedia.
                </div>
              )}
            </section>

            {recommend.length > 0 && (
              <section className="mt-14">
                <SectionHeader
                  kicker="You may also like"
                  title="Recommended"
                  subtitle="Series serupa berdasarkan minat pembaca."
                />
                <Carousel items={recommend} />
              </section>
            )}
          </>
        )}
      </div>
    </article>
  );
}
