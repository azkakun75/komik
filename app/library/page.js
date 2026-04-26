"use client";

import Link from "next/link";
import Image from "next/image";
import { useLibrary } from "@/store/library";
import { safeImage } from "@/lib/utils";
import SectionHeader from "@/components/Comic/SectionHeader";
import { Bookmark, Trash2, History, Heart, Eye } from "lucide-react";

export default function LibraryPage() {
  const favorites = useLibrary((s) => s.favorites);
  const history = useLibrary((s) => s.history);
  const recent = useLibrary((s) => s.recentViewed);
  const removeFavorite = useLibrary((s) => s.removeFavorite);
  const removeHistory = useLibrary((s) => s.removeHistory);
  const clearHistory = useLibrary((s) => s.clearHistory);

  const favList = Object.values(favorites || {}).sort(
    (a, b) => (b.addedAt || 0) - (a.addedAt || 0)
  );
  const histList = Object.values(history || {}).sort(
    (a, b) => (b.readAt || 0) - (a.readAt || 0)
  );

  return (
    <div className="container-page py-10">
      <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">
        Your space
      </div>
      <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
        Library
      </h1>
      <p className="mt-2 max-w-xl text-sm text-subtext">
        Semua koleksi favorit, history baca, dan progress bookmark kamu.
        Tersimpan secara lokal di perangkat ini.
      </p>

      <section className="mt-10">
        <SectionHeader
          kicker={`${favList.length} saved`}
          title="Favorite Comics"
          subtitle="Series yang kamu tandai untuk dibaca nanti."
        />
        {favList.length === 0 ? (
          <Empty icon={<Heart className="h-5 w-5" />} text="Belum ada favorit. Tekan ikon bookmark di card untuk menyimpannya." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favList.map((f) => (
              <div key={f.slug} className="comic-card group relative">
                <Link
                  href={`/comic/${f.slug}?link=${encodeURIComponent(
                    f.processedLink || ""
                  )}`}
                  className="block overflow-hidden rounded-2xl border border-border/60 bg-surface/70 shadow-panel"
                >
                  <div className="relative aspect-[2/3] bg-elevated/60">
                    <Image
                      src={safeImage(f.image)}
                      alt={f.title}
                      fill
                      sizes="(max-width:640px) 50vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-2 text-sm font-semibold">
                      {f.title}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => removeFavorite(f.slug)}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white hover:bg-accent"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            kicker={`${histList.length} entries`}
            title="Continue Reading"
            subtitle="Kembali tepat di chapter terakhir kamu baca."
          />
          {histList.length > 0 && (
            <button
              onClick={clearHistory}
              className="btn"
              type="button"
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          )}
        </div>
        {histList.length === 0 ? (
          <Empty icon={<History className="h-5 w-5" />} text="Belum ada riwayat baca." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {histList.map((h) => (
              <div
                key={h.slug}
                className="flex gap-3 rounded-2xl border border-border/60 bg-surface/70 p-3"
              >
                <Link
                  href={`/comic/${h.slug}`}
                  className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-elevated"
                >
                  {h.image && (
                    <Image
                      src={safeImage(h.image)}
                      alt={h.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/comic/${h.slug}`}
                    className="line-clamp-1 font-semibold hover:text-accent"
                  >
                    {h.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-subtext">
                    Last read: Chapter {h.lastChapter}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link
                      className="btn-primary h-8 px-3 text-xs"
                      href={`/read?slug=${encodeURIComponent(
                        h.slug
                      )}&link=${encodeURIComponent(
                        h.lastChapterLink || ""
                      )}&chapter=${encodeURIComponent(
                        h.lastChapter || ""
                      )}&title=${encodeURIComponent(
                        h.title || ""
                      )}&image=${encodeURIComponent(h.image || "")}`}
                    >
                      Resume
                    </Link>
                    <button
                      type="button"
                      className="btn h-8 px-3 text-xs"
                      onClick={() => removeHistory(h.slug)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <SectionHeader
          kicker={`${recent.length} comics`}
          title="Recently Viewed"
          subtitle="Series yang baru kamu lihat."
        />
        {recent.length === 0 ? (
          <Empty icon={<Eye className="h-5 w-5" />} text="Belum ada history view." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {recent.map((slug) => (
              <Link
                key={slug}
                href={`/comic/${slug}`}
                className="rounded-full border border-border/60 bg-elevated/40 px-3 py-1 text-xs hover:border-accent/60 hover:text-accent"
              >
                {slug}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <SectionHeader
          kicker="Bookmarks"
          title="Bookmarked Chapters"
          subtitle="Chapter yang kamu bookmark untuk re-read cepat."
        />
        <BookmarkList />
      </section>
    </div>
  );
}

function BookmarkList() {
  const bookmarks = useLibrary((s) => s.bookmarks);
  const toggleBookmark = useLibrary((s) => s.toggleBookmark);
  const entries = Object.entries(bookmarks || {}).flatMap(([slug, chapters]) =>
    Object.entries(chapters || {}).map(([link, info]) => ({
      slug,
      link,
      ...info,
    }))
  );
  if (entries.length === 0) {
    return <Empty icon={<Bookmark className="h-5 w-5" />} text="Belum ada bookmark chapter." />;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((b) => (
        <div
          key={b.slug + b.link}
          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/70 p-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-elevated/60 text-accent">
            <Bookmark className="h-4 w-4 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/comic/${b.slug}`}
              className="line-clamp-1 font-semibold hover:text-accent"
            >
              {b.slug}
            </Link>
            <div className="text-xs text-subtext">Chapter {b.chapter}</div>
          </div>
          <Link
            className="btn h-8 px-3 text-xs"
            href={`/read?slug=${encodeURIComponent(
              b.slug
            )}&link=${encodeURIComponent(b.link)}&chapter=${encodeURIComponent(
              b.chapter || ""
            )}`}
          >
            Open
          </Link>
          <button
            type="button"
            onClick={() => toggleBookmark(b.slug, b.link, b.chapter)}
            className="btn h-8 px-3 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Empty({ icon, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-elevated/60 text-accent">
        {icon}
      </div>
      <p className="mt-3 text-sm text-subtext">{text}</p>
    </div>
  );
}
