"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import {
  getTrending,
  getRecent,
  getUnlimited,
  getRecommendations,
  getPustaka,
} from "@/lib/api";
import { whenIdle } from "@/lib/utils";
import Hero from "@/components/Home/Hero";
import Carousel from "@/components/Home/Carousel";
import SectionHeader from "@/components/Comic/SectionHeader";
import LazySection from "@/components/Layout/LazySection";

const Top10 = lazy(() => import("@/components/Home/Top10"));
const QuotePanel = lazy(() => import("@/components/Bonus/QuotePanel"));
const MoodRecommend = lazy(() => import("@/components/Bonus/MoodRecommend"));
const GenreExplorer = lazy(() => import("@/components/Home/GenreExplorer"));

function bySlug(arr) {
  const seen = new Set();
  return arr.filter((c) => {
    const key = c.slug + "|" + (c.processedLink || "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function filterClean(arr) {
  return arr.filter(
    (c) =>
      c &&
      c.title &&
      !String(c.title).toLowerCase().includes("apk") &&
      !String(c.chapter || "").toLowerCase().includes("download")
  );
}

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [unlimited, setUnlimited] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    recent: true,
    unlimited: true,
    recommend: true,
    library: true,
  });

  useEffect(() => {
    let alive = true;
    const finish = (key) =>
      setLoading((s) => ({ ...s, [key]: false }));

    // Primary fetches: trending + recent are visible immediately
    getTrending()
      .then((d) => alive && setTrending(bySlug(filterClean(d))))
      .catch(() => {})
      .finally(() => finish("trending"));

    getRecent()
      .then((d) => alive && setRecent(bySlug(filterClean(d))))
      .catch(() => {})
      .finally(() => finish("recent"));

    // Secondary fetches deferred until browser is idle so the hero paints first.
    whenIdle(() => {
      if (!alive) return;
      getUnlimited()
        .then((d) => alive && setUnlimited(bySlug(filterClean(d))))
        .catch(() => {})
        .finally(() => finish("unlimited"));

      getRecommendations()
        .then((d) => alive && setRecommend(bySlug(filterClean(d))))
        .catch(() => {})
        .finally(() => finish("recommend"));

      getPustaka(1)
        .then((d) => alive && setLibrary(bySlug(filterClean(d))))
        .catch(() => {})
        .finally(() => finish("library"));
    });

    return () => {
      alive = false;
    };
  }, []);

  // Heuristic categorisation by `type` field returned per item.
  const categorize = (arr, kind) =>
    arr.filter(
      (c) =>
        String(c.type || "").toLowerCase().includes(kind) ||
        String(c.category || "").toLowerCase().includes(kind)
    );

  const merged = bySlug([
    ...recent,
    ...unlimited,
    ...library,
    ...recommend,
    ...trending,
  ]);
  const manga = categorize(merged, "manga");
  const manhwa = categorize(merged, "manhwa");
  const manhua = categorize(merged, "manhua");
  const ongoing = merged.filter((c) =>
    String(c.status || "").toLowerCase().includes("ongoing")
  );
  const completed = merged.filter((c) =>
    String(c.status || "").toLowerCase().includes("complete")
  );

  return (
    <>
      <Hero />

      <section className="container-page py-10">
        <SectionHeader
          kicker="Hot now"
          title="Trending Comics"
          subtitle="Top picks dari pembaca minggu ini, di-rank oleh skor real-time."
          href="/search?q=trending"
        />
        <Carousel items={trending} loading={loading.trending} />
      </section>

      <section className="container-page py-10">
        <SectionHeader
          kicker="Fresh ink"
          title="Recently Updated"
          subtitle="Chapter terbaru dari series favoritmu, baru saja masuk."
          href="/search?q=update"
        />
        <Carousel items={recent} loading={loading.recent} />
      </section>

      <LazySection minHeight={520}>
        <section className="container-page grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionHeader
              kicker="Popular"
              title="Popular This Week"
              subtitle="Series yang lagi naik daun di seluruh ComicVerse."
            />
            <Carousel items={unlimited} loading={loading.unlimited} />
          </div>
          <div>
            <SectionHeader
              kicker="Top 10"
              title="Top 10 Weekly"
              subtitle="Ranking top minggu ini."
            />
            <Suspense fallback={<div className="h-96 skeleton rounded-2xl" />}>
              <Top10 />
            </Suspense>
          </div>
        </section>
      </LazySection>

      <LazySection minHeight={420}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="Status: ongoing"
            title="Ongoing Series"
            subtitle="Petualangan yang masih berlangsung. Ikuti dari sekarang."
          />
          <Carousel
            items={ongoing.length ? ongoing : merged.slice(0, 18)}
            loading={loading.recent && loading.unlimited && loading.library}
          />
        </section>
      </LazySection>

      <LazySection minHeight={420}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="Status: completed"
            title="Completed Series"
            subtitle="Cerita-cerita yang siap kamu marathon dari awal sampai akhir."
          />
          <Carousel
            items={completed.length ? completed : merged.slice(8, 26)}
            loading={loading.library}
          />
        </section>
      </LazySection>

      <LazySection minHeight={420}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="Japanese roots"
            title="Manga"
            subtitle="Klasik dan modern dari Jepang."
          />
          <Carousel
            items={manga.length ? manga : merged.slice(0, 16)}
            loading={loading.library && loading.recent}
          />
        </section>
      </LazySection>

      <LazySection minHeight={420}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="Korean wave"
            title="Manhwa"
            subtitle="Vertical-scroll & full-color terbaik dari Korea."
          />
          <Carousel
            items={manhwa.length ? manhwa : merged.slice(4, 20)}
            loading={loading.library && loading.recent}
          />
        </section>
      </LazySection>

      <LazySection minHeight={420}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="Chinese epics"
            title="Manhua"
            subtitle="Sejarah, fantasi, dan cultivation Tiongkok."
          />
          <Carousel
            items={manhua.length ? manhua : merged.slice(8, 24)}
            loading={loading.library && loading.recent}
          />
        </section>
      </LazySection>

      <LazySection minHeight={300}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="Find your vibe"
            title="Genre Explorer"
            subtitle="Lompat antar dunia hanya dengan sekali klik."
            href="/genres"
          />
          <Suspense fallback={<div className="h-64 skeleton rounded-2xl" />}>
            <GenreExplorer />
          </Suspense>
        </section>
      </LazySection>

      <LazySection minHeight={420}>
        <section className="container-page py-10">
          <SectionHeader
            kicker="AI · Mood matcher"
            title="Recommend by Mood"
            subtitle="Cerita kamu hari ini dimulai dari rasa, bukan judul."
          />
          <Suspense fallback={<div className="h-64 skeleton rounded-2xl" />}>
            <MoodRecommend />
          </Suspense>
        </section>
      </LazySection>

      <LazySection minHeight={300}>
        <section className="container-page py-10">
          <Suspense fallback={<div className="h-64 skeleton rounded-2xl" />}>
            <QuotePanel />
          </Suspense>
        </section>
      </LazySection>
    </>
  );
}
