"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Settings,
  ArrowDown,
  ArrowUp,
  Book,
} from "lucide-react";
import { getChapter } from "@/lib/api";
import { useReader } from "@/store/reader";
import { useLibrary } from "@/store/library";
import { processChapterLink } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ReaderImage from "@/components/Reader/ReaderImage";

const widthMap = {
  narrow: "max-w-[640px]",
  comfort: "max-w-[820px]",
  wide: "max-w-[1040px]",
  full: "max-w-none",
};

export default function ReaderClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const slug = sp.get("slug") || "";
  const initialLink = sp.get("link") || "";
  const initialChapter = sp.get("chapter") || "";
  const passedTitle = sp.get("title") || "";
  const passedImage = sp.get("image") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterLink, setChapterLink] = useState(initialLink);
  const [chapter, setChapter] = useState(initialChapter);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);

  const { width, mode, direction, brightness, lightMode } = useReader();
  const setWidth = useReader((s) => s.setWidth);
  const setMode = useReader((s) => s.setMode);
  const setDirection = useReader((s) => s.setDirection);
  const setBrightness = useReader((s) => s.setBrightness);
  const setLightMode = useReader((s) => s.setLightMode);

  const saveHistory = useLibrary((s) => s.saveHistory);
  const toggleBookmark = useLibrary((s) => s.toggleBookmark);
  const isBookmarked = useLibrary((s) => s.isBookmarked(slug, chapterLink));
  const setProgressStore = useLibrary((s) => s.setProgress);

  // Load chapter pages
  useEffect(() => {
    if (!chapterLink) {
      setError("Link chapter tidak valid.");
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    setProgress(0);
    window.scrollTo(0, 0);

    getChapter(chapterLink)
      .then((d) => {
        if (!alive) return;
        setData(d);
        if (slug) {
          saveHistory({
            slug,
            title: passedTitle || d.title || slug,
            image: passedImage || null,
            lastChapter: chapter || d.title || "",
            lastChapterLink: chapterLink,
            processedLink: slug,
          });
        }
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterLink]);

  // Track scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.min(1, window.scrollY / total) : 0;
      setProgress(pct);
      if (slug && chapterLink) {
        const key = `${slug}::${chapterLink}`;
        setProgressStore(key, pct);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, chapterLink, setProgressStore]);

  // Hide controls on inactivity
  useEffect(() => {
    let t;
    const reveal = () => {
      setShowControls(true);
      clearTimeout(t);
      t = setTimeout(() => setShowControls(false), 2600);
    };
    reveal();
    window.addEventListener("mousemove", reveal);
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("touchstart", reveal, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", reveal);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("touchstart", reveal);
    };
  }, []);

  const goNext = () => {
    const nx = data?.navigation?.nextChapter;
    if (!nx) return;
    const link = processChapterLink(nx.link || nx.endpoint || nx.url || "");
    if (!link) return;
    setChapter(nx.chapter || "");
    setChapterLink(link);
    router.replace(
      `/read?slug=${encodeURIComponent(slug)}&link=${encodeURIComponent(
        link
      )}&chapter=${encodeURIComponent(nx.chapter || "")}&title=${encodeURIComponent(
        passedTitle
      )}&image=${encodeURIComponent(passedImage)}`,
      { scroll: false }
    );
  };

  const goPrev = () => {
    const pv = data?.navigation?.previousChapter;
    if (!pv) return;
    const link = processChapterLink(pv.link || pv.endpoint || pv.url || "");
    if (!link) return;
    setChapter(pv.chapter || "");
    setChapterLink(link);
    router.replace(
      `/read?slug=${encodeURIComponent(slug)}&link=${encodeURIComponent(
        link
      )}&chapter=${encodeURIComponent(pv.chapter || "")}&title=${encodeURIComponent(
        passedTitle
      )}&image=${encodeURIComponent(passedImage)}`,
      { scroll: false }
    );
  };

  const onJumpChapter = (c) => {
    const link = processChapterLink(c.link || "");
    if (!link) return;
    setChapter(c.chapter || "");
    setChapterLink(link);
    router.replace(
      `/read?slug=${encodeURIComponent(slug)}&link=${encodeURIComponent(
        link
      )}&chapter=${encodeURIComponent(c.chapter || "")}&title=${encodeURIComponent(
        passedTitle
      )}&image=${encodeURIComponent(passedImage)}`,
      { scroll: false }
    );
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const isLight = lightMode;
  const pages = data?.images || [];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors",
        isLight ? "bg-[#f6f1e6] text-[#141414]" : "bg-bg text-text"
      )}
      ref={containerRef}
    >
      {/* Top progress bar */}
      <div className="read-progress" style={{ width: `${progress * 100}%` }} />

      {/* Top bar */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition",
          showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
          isLight ? "bg-[#f6f1e6]/85 backdrop-blur" : "bg-bg/80 backdrop-blur-xl"
        )}
      >
        <div className="container-page flex h-14 items-center gap-3 border-b border-border/40">
          <Link
            href={`/comic/${slug}`}
            className="inline-flex items-center gap-2 text-sm hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="ml-1 min-w-0 flex-1 truncate">
            <div className="line-clamp-1 text-sm font-semibold">
              {passedTitle || data?.title || slug}
            </div>
            {chapter && (
              <div className="text-[11px] text-subtext">Chapter {chapter}</div>
            )}
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => toggleBookmark(slug, chapterLink, chapter)}
          >
            <Bookmark className={"h-4 w-4 " + (isBookmarked ? "fill-accent text-accent" : "")} />
            <span className="hidden sm:inline">
              {isBookmarked ? "Saved" : "Bookmark"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className="btn"
            aria-label="Reader settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setLightMode(!lightMode)}
            className="btn"
            aria-label="Toggle light/dark"
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {showSettings && (
          <div className="container-page py-4">
            <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/85 p-4 sm:grid-cols-4">
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-subtext">
                  Width
                </div>
                <div className="flex flex-wrap gap-1">
                  {["narrow", "comfort", "wide", "full"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWidth(w)}
                      type="button"
                      className={
                        "rounded-full px-3 py-1 text-xs " +
                        (width === w
                          ? "bg-accent text-white"
                          : "border border-border/60 bg-elevated/40 text-text hover:border-accent/60")
                      }
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-subtext">
                  Mode
                </div>
                <div className="flex flex-wrap gap-1">
                  {["long-strip", "paged"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      type="button"
                      className={
                        "rounded-full px-3 py-1 text-xs " +
                        (mode === m
                          ? "bg-accent text-white"
                          : "border border-border/60 bg-elevated/40 text-text hover:border-accent/60")
                      }
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-subtext">
                  Direction
                </div>
                <div className="flex flex-wrap gap-1">
                  {["ltr", "rtl"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDirection(d)}
                      type="button"
                      className={
                        "rounded-full px-3 py-1 text-xs uppercase " +
                        (direction === d
                          ? "bg-accent text-white"
                          : "border border-border/60 bg-elevated/40 text-text hover:border-accent/60")
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-subtext">
                  Brightness {brightness}%
                </div>
                <input
                  type="range"
                  min="50"
                  max="120"
                  step="2"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-[rgb(var(--c-accent))]"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Pages */}
      <div className="pt-20 pb-32">
        <div
          className={cn(
            "reader-strip mx-auto px-3 sm:px-4",
            widthMap[width] || widthMap.comfort,
            mode === "long-strip" && "long-strip"
          )}
          style={{ filter: `brightness(${brightness}%)`, direction }}
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] w-full rounded-md skeleton"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center text-sm text-subtext">
              {error}
            </div>
          ) : pages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center text-sm text-subtext">
              Halaman chapter tidak ditemukan.
            </div>
          ) : (
            pages.map((p, i) => {
              const src = typeof p === "string" ? p : p?.image || p?.url || p?.src;
              if (!src) return null;
              return <ReaderImage key={i + src} src={src} index={i} />;
            })
          )}
        </div>

        {/* End-of-chapter card */}
        {!loading && !error && pages.length > 0 && (
          <div className="container-page mt-10">
            <div className="panel p-6">
              <div className="text-[10px] uppercase tracking-[0.32em] text-accent">
                End of chapter
              </div>
              <div className="mt-1 font-display text-xl font-black">
                Lanjut chapter berikutnya?
              </div>
              <div className="mt-1 text-sm text-subtext">
                Bookmark progress kamu sudah otomatis tersimpan di Library.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data?.navigation?.nextChapter ? (
                  <button onClick={goNext} className="btn-primary">
                    Next chapter <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="btn opacity-50">Last chapter</span>
                )}
                {data?.navigation?.previousChapter && (
                  <button onClick={goPrev} className="btn">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                )}
                <Link href={`/comic/${slug}`} className="btn">
                  <Book className="h-4 w-4" /> All chapters
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 transition",
          showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          isLight ? "bg-[#f6f1e6]/85 backdrop-blur" : "bg-bg/85 backdrop-blur-xl"
        )}
      >
        <div className="container-page flex h-14 items-center gap-2 border-t border-border/40">
          <button
            type="button"
            onClick={goPrev}
            disabled={!data?.navigation?.previousChapter}
            className="btn disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>

          <select
            value={chapterLink}
            onChange={(e) => {
              const c = data?.chapters?.find(
                (x) => processChapterLink(x.link) === e.target.value
              );
              if (c) onJumpChapter(c);
            }}
            className="flex-1 truncate rounded-full border border-border/60 bg-elevated/50 px-4 py-2 text-sm outline-none focus:border-accent/60"
          >
            {data?.chapters?.length ? (
              data.chapters.map((c, i) => (
                <option
                  key={(c.link || "c") + i}
                  value={processChapterLink(c.link || "")}
                >
                  Chapter {c.chapter}
                </option>
              ))
            ) : (
              <option>Chapter list</option>
            )}
          </select>

          <button
            type="button"
            onClick={goNext}
            disabled={!data?.navigation?.nextChapter}
            className="btn disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="btn hidden sm:inline-flex"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="btn hidden sm:inline-flex"
            onClick={() =>
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
