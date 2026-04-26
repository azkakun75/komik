import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a comic title or messy URL fragment to a clean URL slug.
 */
export function toSlug(input) {
  if (!input) return "";
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The Sanka API exposes detail by passing a path fragment derived from komiku.
 * Items returned in lists carry a `link` (absolute or relative). We normalise
 * it to the last path segment that the detail endpoint expects.
 */
export function processComicLink(link) {
  if (!link) return "";
  let pathname = link;
  try {
    const u = new URL(link);
    pathname = u.pathname;
  } catch (_) {
    // already a path
  }
  return pathname
    .replace(/^\/manga\//, "/")
    .replace(/^\/plus\//, "/")
    .replace(/^\/detail-komik\//, "/")
    .replace(/^\/+|\/+$/g, "");
}

/**
 * Legacy helper kept for components that pre-date the Komikstation API.
 * Returns a leading-slash path. New call-sites should use `processChapterSlug`.
 */
export function processChapterLink(link) {
  if (!link) return "";
  let pathname = link;
  try {
    const u = new URL(link);
    pathname = u.pathname;
  } catch (_) {}
  if (!pathname.startsWith("/")) pathname = "/" + pathname;
  return pathname;
}

/**
 * The Komikstation chapter endpoint is `/chapter/:slug` — it expects a bare
 * slug like `solo-leveling-chapter-1`. Inputs may arrive as a full URL, a
 * pathname, or already-clean slug; reduce all of them to the last meaningful
 * path segment.
 */
export function processChapterSlug(input) {
  if (!input) return "";
  let pathname = String(input);
  try {
    const u = new URL(input);
    pathname = u.pathname;
  } catch (_) {
    // already a path or slug
  }
  const trimmed = pathname.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "";
  const parts = trimmed.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last;
}

/**
 * Wrap an external image URL with the same-origin `/api/img` proxy so the
 * browser fetches from Vercel's edge cache (1d fresh, 30d stale) instead of
 * the slow upstream CDN. Local paths, data: / blob: URLs, and already-proxied
 * URLs pass through unchanged.
 */
export function proxyImage(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("/")) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.includes("/api/img?")) return url;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return url;
  } catch {
    return url;
  }
  return `/api/img?u=${encodeURIComponent(url)}`;
}

/**
 * Resolve an upstream image URL into something the browser can render fast:
 * fall back to the local placeholder when the URL is missing/garbage, then
 * route everything else through the same-origin image proxy so the browser
 * gets edge-cached responses instead of hitting the slow upstream CDN.
 */
export function safeImage(url, fallback = "/placeholder-cover.svg") {
  if (!url) return fallback;
  if (typeof url !== "string") return fallback;
  if (url.includes("lazy.jpg") || url.includes("placeholder")) return fallback;
  return proxyImage(url);
}

export function formatNumber(n) {
  if (n == null || isNaN(Number(n))) return "—";
  const num = Number(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function whenIdle(cb, timeout = 1500) {
  if (typeof window === "undefined") return;
  const ric =
    typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback
      : (fn) => setTimeout(fn, 1);
  ric(cb, { timeout });
}

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
