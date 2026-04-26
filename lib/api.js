"use client";

import axios from "axios";
import { processComicLink, processChapterSlug, toSlug } from "./utils";

// Default: use the same-origin proxy at /api/comic/* to sidestep CORS and
// upstream IP blocks. Can be overridden for local development by setting
// NEXT_PUBLIC_API_BASE, in which case the path prefix is expected to be /comic.
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "";
const API_PREFIX = BASE_URL ? "/comic" : "/api/comic";
// All read endpoints live under the Komikstation namespace.
const KS = `${API_PREFIX}/komikstation`;

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
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

/** Normalise a raw comic record from various Komikstation endpoints. */
function normaliseComic(raw, source = "list") {
  if (!raw || typeof raw !== "object") return null;
  const title = raw.title || raw.name || raw.judul || "Untitled";
  const slug = raw.slug || raw.endpoint || toSlug(title);
  const link = raw.link || raw.href || raw.url || raw.endpoint || "";
  const processedLink = processComicLink(link || slug);
  return {
    title,
    slug,
    altTitle: raw.altTitle || raw.alt_title || raw.alternative || null,
    image:
      raw.image ||
      raw.cover ||
      raw.thumb ||
      raw.thumbnail ||
      raw.poster ||
      null,
    chapter:
      raw.chapter ||
      raw.latest_chapter ||
      raw.lastChapter ||
      raw.chapter_terbaru ||
      "",
    type: raw.type || raw.category || raw.tipe || null,
    status: raw.status || null,
    rating: raw.rating || raw.score || raw.nilai || null,
    score:
      raw.trending_score ??
      raw.recommendation_score ??
      raw.popularity_score ??
      raw.score ??
      null,
    timeframe: raw.timeframe || raw.time || null,
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
  if (Array.isArray(data)) return data;
  return [];
}

/* ----------------------------- Sections ----------------------------- */

/**
 * Komikstation homepage payload — typically returns latest + trending in the
 * same response. Cache once per render and split into the two list shapes the
 * UI consumes.
 */
let _homePromise = null;
function fetchHome() {
  if (_homePromise) return _homePromise;
  _homePromise = http.get(`${KS}/home`).then(({ data }) => {
    const trending = pickArray(
      data,
      "trending",
      "popular",
      "topManhwa",
      "top",
      "hot"
    )
      .map((x) => normaliseComic(x, "trending"))
      .filter(Boolean);
    const latest = pickArray(
      data,
      "latest",
      "latestUpdate",
      "latest_update",
      "recent",
      "comics",
      "data"
    )
      .map((x) => normaliseComic(x, "recent"))
      .filter(Boolean);
    return { trending, latest };
  });
  // Reset the cache shortly after so subsequent navigations pick up fresh
  // edge-cached upstream responses. Failures clear immediately so the next
  // caller can retry instead of being pinned to a rejected promise.
  _homePromise
    .catch(() => {
      _homePromise = null;
    })
    .finally(() => {
      setTimeout(() => {
        _homePromise = null;
      }, 30_000);
    });
  return _homePromise;
}

export async function getTrending() {
  const { trending, latest } = await fetchHome();
  // Some Komikstation snapshots only populate `latest`; fall back so the hero
  // never goes empty when the trending bucket is missing.
  return trending.length ? trending : latest;
}

export async function getRecent() {
  const { latest, trending } = await fetchHome();
  return latest.length ? latest : trending;
}

export async function getPopular(page = 1) {
  const { data } = await http.get(`${KS}/popular?page=${page}`);
  return pickArray(data, "comics", "popular", "data")
    .map((x) => normaliseComic(x, "popular"))
    .filter(Boolean);
}

// Backward-compatible alias used by the old homepage layout.
export async function getUnlimited() {
  return getPopular(1);
}

export async function getOngoing(page = 1) {
  const { data } = await http.get(`${KS}/ongoing?page=${page}`);
  return pickArray(data, "comics", "ongoing", "data")
    .map((x) => normaliseComic(x, "ongoing"))
    .filter(Boolean);
}

export async function getRecommendations() {
  const { data } = await http.get(`${KS}/recommendation`);
  return pickArray(data, "recommendations", "recommendation", "comics", "data")
    .map((x) => normaliseComic(x, "recommend"))
    .filter(Boolean);
}

export async function getTopWeekly() {
  const { data } = await http.get(`${KS}/top-weekly`);
  return pickArray(data, "top", "topWeekly", "comics", "data")
    .map((x) => normaliseComic(x, "top-weekly"))
    .filter(Boolean);
}

/**
 * Generic Komikstation list with optional filters. Any of `type`, `status`,
 * `order`, `page` may be omitted.
 */
export async function getList({ type, status, order, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (order) params.set("order", order);
  if (page) params.set("page", String(page));
  const qs = params.toString();
  const { data } = await http.get(`${KS}/list${qs ? `?${qs}` : ""}`);
  return pickArray(data, "comics", "list", "data")
    .map((x) => normaliseComic(x, "list"))
    .filter(Boolean);
}

// Backward-compatible alias used by the home/random pages.
export async function getPustaka(page = 1) {
  return getList({ page });
}

export async function getAZ(letter = "a", page = 1) {
  const safe = encodeURIComponent(String(letter).toLowerCase().slice(0, 1) || "a");
  const { data } = await http.get(`${KS}/az-list/${safe}?page=${page}`);
  return pickArray(data, "comics", "data")
    .map((x) => normaliseComic(x, "az"))
    .filter(Boolean);
}

export async function getGenres() {
  const { data } = await http.get(`${KS}/genres`);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.genres)) return data.genres;
  if (Array.isArray(data?.data)) return data.data;
  return Object.entries(data || {})
    .filter(([k]) => /^\d+$/.test(k))
    .map(([, v]) => v);
}

export async function getGenreComics(slug, page = 1) {
  const cleanSlug = encodeURIComponent(String(slug || "").trim());
  if (!cleanSlug) return [];
  const { data } = await http.get(`${KS}/genre/${cleanSlug}/${page}`);
  return pickArray(data, "comics", "data")
    .map((x) => normaliseComic(x, "genre"))
    .filter(Boolean);
}

export async function searchComics(query, page = 1) {
  if (!query || !query.trim()) return [];
  const q = encodeURIComponent(query.trim());
  const { data } = await http.get(`${KS}/search/${q}/${page}`);
  return pickArray(data, "comics", "results", "data")
    .map((x) => normaliseComic(x, "search"))
    .filter(Boolean);
}

/* ----------------------------- Detail / Chapter ----------------------------- */

export async function getComicDetail(slugOrLink) {
  const cleanSlug = processComicLink(slugOrLink);
  if (!cleanSlug) return null;
  const { data } = await http.get(`${KS}/manga/${encodeURIComponent(cleanSlug)}`);
  if (!data) return null;
  return {
    title: data.title || data.name || "Untitled",
    altTitle: data.alternative || data.altTitle || null,
    image: data.image || data.cover || data.thumb || data.poster || null,
    synopsis: data.synopsis || data.description || data.sinopsis || "",
    author: data.author || data.creator || null,
    artist: data.artist || null,
    rating: data.rating || data.score || null,
    status: data.status || null,
    type: data.type || data.category || null,
    released: data.released || data.year || data.published || null,
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
            c.slug ||
            "",
          uploaded: c.uploaded || c.released || c.date || null,
        }))
      : [],
    raw: data,
  };
}

/**
 * Fetch chapter pages. The Komikstation chapter endpoint is slug-based; we
 * accept either a full URL, a path, or a bare slug and reduce to the slug.
 */
export async function getChapter(chapterLink) {
  const slug = processChapterSlug(chapterLink);
  if (!slug) {
    throw new Error("Link chapter tidak valid.");
  }
  const { data } = await http.get(`${KS}/chapter/${encodeURIComponent(slug)}`);
  const images = Array.isArray(data?.images)
    ? data.images
    : pickArray(data, "pages", "image", "panels");
  return {
    title: data?.title || data?.chapter || "",
    images: images
      .map((p) =>
        typeof p === "string" ? p : p?.url || p?.image || p?.src || ""
      )
      .filter(Boolean),
    chapters: Array.isArray(data?.chapters)
      ? data.chapters.map((c) => ({
          chapter: c.chapter || c.number || c.title || "",
          title: c.title || null,
          link:
            c.link ||
            c.chapter_link ||
            c.endpoint ||
            c.url ||
            c.slug ||
            "",
        }))
      : [],
    navigation: {
      previousChapter:
        data?.navigation?.previousChapter ||
        data?.navigation?.prev ||
        data?.prev_chapter ||
        null,
      nextChapter:
        data?.navigation?.nextChapter ||
        data?.navigation?.next ||
        data?.next_chapter ||
        null,
    },
    raw: data,
  };
}
