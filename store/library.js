"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initial = {
  favorites: {}, // slug -> {title, image, processedLink, addedAt}
  history: {}, // slug -> {title, image, processedLink, lastChapter, lastChapterLink, readAt}
  bookmarks: {}, // slug -> { [chapterLink]: { chapter, addedAt } }
  recentViewed: [], // ordered list of slugs (newest first), max 30
  progress: {}, // chapterKey -> 0..1
};

export const useLibrary = create(
  persist(
    (set, get) => ({
      ...initial,

      addFavorite: (comic) =>
        set((s) => ({
          favorites: {
            ...s.favorites,
            [comic.slug]: {
              slug: comic.slug,
              title: comic.title,
              image: comic.image,
              processedLink: comic.processedLink,
              addedAt: Date.now(),
            },
          },
        })),
      removeFavorite: (slug) =>
        set((s) => {
          const next = { ...s.favorites };
          delete next[slug];
          return { favorites: next };
        }),
      toggleFavorite: (comic) => {
        const f = get().favorites[comic.slug];
        if (f) get().removeFavorite(comic.slug);
        else get().addFavorite(comic);
      },
      isFavorite: (slug) => Boolean(get().favorites[slug]),

      pushRecent: (slug) =>
        set((s) => {
          const list = [slug, ...s.recentViewed.filter((x) => x !== slug)].slice(
            0,
            30
          );
          return { recentViewed: list };
        }),

      saveHistory: (entry) =>
        set((s) => ({
          history: {
            ...s.history,
            [entry.slug]: { ...s.history[entry.slug], ...entry, readAt: Date.now() },
          },
        })),

      clearHistory: () => set({ history: {} }),
      removeHistory: (slug) =>
        set((s) => {
          const next = { ...s.history };
          delete next[slug];
          return { history: next };
        }),

      toggleBookmark: (slug, chapterLink, chapter) =>
        set((s) => {
          const cur = s.bookmarks[slug] || {};
          const next = { ...cur };
          if (next[chapterLink]) delete next[chapterLink];
          else next[chapterLink] = { chapter, addedAt: Date.now() };
          return { bookmarks: { ...s.bookmarks, [slug]: next } };
        }),
      isBookmarked: (slug, chapterLink) =>
        Boolean(get().bookmarks?.[slug]?.[chapterLink]),

      setProgress: (key, value) =>
        set((s) => ({ progress: { ...s.progress, [key]: value } })),
    }),
    {
      name: "afzn-comicverse-library",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined)),
      version: 1,
    }
  )
);
