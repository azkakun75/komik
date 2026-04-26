"use client";

import axios from "axios";
import { processComicLink, processChapterLink, toSlug } from "./utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://www.sankavollerei.com";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 25_000,
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const data = err?.response?.data;
    const message =
      data?.message ||
      err?.message ||
      "Permintaan ke server komik gagal. Coba lagi.";
    return Promise.reject(new Error(message));
  }
);

/** Normalise a raw comic record from various Sanka endpoints into a stable shape. */
function normaliseComic(raw, source = "list") {
  if (!raw || typeof raw !== "object") return null;
  const title = raw.title || raw.name || "Untitled";
  const slug = raw.slug || toSlug(title);
  const link = raw.link || raw.href || raw.url || "";
  const processedLink = processComicLink(link);
  return {
    title,
    slug,
    altTitle: raw.altTitle || raw.alt_title || raw.alternative || null,
    image: raw.image || raw.cover || raw.thumb || raw.thumbnail || null,
    chapter: raw.chapter || raw.latest_chapter || raw.lastChapter || "",
    type: raw.type || raw.category || null,
    status: raw.status || null,
    rating: raw.rating || raw.score || null,
    score:
      raw.trending_score ??
      raw.recommendation_score ??
      raw.popularity_score ??
      null,
    timeframe: raw.timeframe || null,
    reason: raw.reason || null,
    href: link,
    processedLink,
    source,
  };
}

function pickArray(data, ...keys) {
  for (const k of keys) {
    if (Array.isArray(data?.[k])) return data[k];
  }
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

/* ----------------------------- Sections ----------------------------- */

export async function getTrending() {
  const { data } = await http.get("/comic/trending");
  return pickArray(data, "trending", "comics").map((x) =>
    normaliseComic(x, "trending")
  );
}

export async function getRecent() {
  const { data } = await http.get("/comic/terbaru");
  return pickArray(data, "comics", "data").map((x) => normaliseComic(x, "recent"));
}

export async function getUnlimited() {
  const { data } = await http.get("/comic/unlimited");
  return pickArray(data, "comics", "data").map((x) =>
    normaliseComic(x, "unlimited")
  );
}

export async function getPustaka(page = 1) {
  const { data } = await http.get(`/comic/pustaka/${page}`);
  return pickArray(data, "comics", "data").map((x) => normaliseComic(x, "library"));
}

export async function getRecommendations() {
  const { data } = await http.get("/comic/recommendations");
  return pickArray(data, "recommendations", "data").map((x) =>
    normaliseComic(x, "recommend")
  );
}

export async function getGenres() {
  const { data } = await http.get("/comic/genres");
  // The API returns either an object keyed by index, or an array.
  if (Array.isArray(data)) return data;
  return Object.entries(data || {})
    .filter(([k]) => /^\d+$/.test(k))
    .map(([, v]) => v);
}

export async function searchComics(query) {
  if (!query || !query.trim()) return [];
  const { data } = await http.get(
    `/comic/search?q=${encodeURIComponent(query.trim())}`
  );
  const arr = Array.isArray(data?.data) ? data.data : pickArray(data);
  return arr.map((x) => normaliseComic(x, "search"));
}

/* ----------------------------- Detail / Chapter ----------------------------- */

/**
 * Fetch comic detail. Sanka expects a path-like slug at /comic/comic/<slug>.
 * We accept either the canonical processedLink or a plain slug.
 */
export async function getComicDetail(slugOrLink) {
  const cleanSlug = processComicLink(slugOrLink);
  const { data } = await http.get(`/comic/comic/${cleanSlug}`);
  if (!data) return null;
  return {
    title: data.title || data.name || "Untitled",
    altTitle: data.alternative || data.altTitle || null,
    image: data.image || data.cover || data.thumb || null,
    synopsis: data.synopsis || data.description || "",
    author: data.author || data.creator || null,
    artist: data.artist || null,
    rating: data.rating || data.score || null,
    status: data.status || null,
    type: data.type || data.category || null,
    released: data.released || data.year || null,
    genres: Array.isArray(data.genres)
      ? data.genres
      : Array.isArray(data.genre)
      ? data.genre
      : [],
    chapters: Array.isArray(data.chapters)
      ? data.chapters.map((c) => ({
          chapter: c.chapter || c.number || c.title || "",
          title: c.title || c.chapter_title || null,
          link:
            c.chapter_link ||
            c.link ||
            c.url ||
            c.href ||
            c.endpoint ||
            "",
          uploaded: c.uploaded || c.released || c.date || null,
        }))
      : [],
    raw: data,
  };
}

/**
 * Fetch chapter pages. The chapter href looks like "/some-slug-chapter-12/" and
 * the API expects /comic/chapter<that-href>.
 */
export async function getChapter(chapterLink) {
  const path = processChapterLink(chapterLink);
  const { data } = await http.get(`/comic/chapter${path}`);
  return {
    title: data?.title || data?.chapter || "",
    images: Array.isArray(data?.images) ? data.images : pickArray(data, "pages"),
    chapters: Array.isArray(data?.chapters)
      ? data.chapters.map((c) => ({
          chapter: c.chapter || c.number || c.title || "",
          title: c.title || null,
          link: c.link || c.chapter_link || c.endpoint || c.url || "",
        }))
      : [],
    navigation: {
      previousChapter: data?.navigation?.previousChapter || null,
      nextChapter: data?.navigation?.nextChapter || null,
    },
    raw: data,
  };
}
