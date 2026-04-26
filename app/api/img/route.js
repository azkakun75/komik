import { NextResponse } from "next/server";

// Long-lived image proxy. Fetches an arbitrary upstream image, then re-emits
// it with aggressive edge caching so subsequent requests hit Vercel's edge
// instead of the slow upstream image CDN. Used by the reader (where each
// chapter has dozens of unique URLs) and as an opt-in src for thumbnails.

const FETCH_TIMEOUT_MS = 12_000;
// Aggressive cache: 1 day fresh on the edge, 30 days stale-while-revalidate,
// 90 days stale-if-error. The upstream URL is part of the cache key so any
// change to the URL bypasses the cached entry.
const CACHE_CONTROL =
  "public, s-maxage=86400, stale-while-revalidate=2592000, stale-if-error=7776000, immutable";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

// Optional hostname suffix allowlist. When `IMG_PROXY_ALLOWED_HOSTS` is set
// (comma-separated suffixes), only upstream hosts whose hostname ends with one
// of those entries are proxied. Left unset to keep the proxy permissive enough
// for the rotating set of komik image CDNs in production; the SSRF blast
// radius is already constrained by the private-IP block + manual redirect
// handling below.
const ALLOWED_SUFFIXES = (() => {
  const env = process.env.IMG_PROXY_ALLOWED_HOSTS;
  if (!env) return null;
  const list = env
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return list.length ? new Set(list) : null;
})();

function isHostAllowed(hostname) {
  if (!ALLOWED_SUFFIXES) return true;
  const h = String(hostname || "").toLowerCase();
  if (!h) return false;
  for (const suffix of ALLOWED_SUFFIXES) {
    if (h === suffix) return true;
    if (h.endsWith("." + suffix)) return true;
  }
  return false;
}

// Block hostnames that would resolve to private/loopback/link-local/metadata
// addresses or that are themselves IP literals in those ranges. This is the
// last line of defence against SSRF: even when an attacker controls a domain
// in the allowlist (e.g. via subdomain), we never want to issue requests to
// internal-looking hostnames.
function isHostnameInternal(hostname) {
  const h = String(hostname || "").toLowerCase();
  if (!h) return true;
  if (h === "localhost") return true;
  if (h.endsWith(".localhost")) return true;
  if (h.endsWith(".internal")) return true;
  if (h.endsWith(".local")) return true;
  // IPv4 literal checks.
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true; // multicast / reserved
  }
  // IPv6 loopback / link-local / unique-local literals (URL hostnames carry
  // them in `[…]` form which is stripped by the URL parser).
  if (h === "::1" || h === "::") return true;
  if (h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")) {
    return true;
  }
  return false;
}

function rangeHeaders(request) {
  const range = request.headers.get("range");
  return range ? { Range: range } : undefined;
}

function jsonError(error, status, extra) {
  return NextResponse.json(
    { error, ...(extra || {}) },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("u") || url.searchParams.get("url");
  if (!raw) {
    return jsonError("missing_url", 400, {
      message: "Query parameter `u` is required.",
    });
  }

  let target;
  try {
    target = new URL(raw);
  } catch {
    return jsonError("invalid_url", 400);
  }
  if (!ALLOWED_PROTOCOLS.has(target.protocol)) {
    return jsonError("blocked_protocol", 400);
  }
  if (isHostnameInternal(target.hostname)) {
    return jsonError("blocked_host", 403);
  }
  if (!isHostAllowed(target.hostname)) {
    return jsonError("blocked_host", 403);
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);

  try {
    // `redirect: "manual"` so the proxy never follows a 30x into an internal
    // address, which would otherwise bypass the allowlist + private-IP guard.
    const upstream = await fetch(target.toString(), {
      method: "GET",
      signal: ac.signal,
      redirect: "manual",
      headers: {
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: `${target.protocol}//${target.host}/`,
        ...rangeHeaders(request),
      },
      next: { revalidate: 86400 },
    });

    // Surface redirects as a hard error rather than chasing them (which could
    // smuggle traffic to an internal host). Callers can re-issue with the new
    // location explicitly if they want the proxy to follow it.
    if (upstream.status >= 300 && upstream.status < 400) {
      return jsonError("upstream_redirect", 502, {
        location: upstream.headers.get("Location") || null,
      });
    }

    if (!upstream.ok && upstream.status !== 206) {
      return jsonError("upstream_failed", 502, { status: upstream.status });
    }

    const buf = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("Content-Type") || "image/jpeg";
    // `Content-Length` reflects `buf.byteLength` — the actual decoded body
    // we are about to ship. Do not copy upstream's `Content-Length` because
    // that may be the compressed (gzip) wire size, which would mismatch the
    // body we've already decompressed via arrayBuffer() and could stall the
    // browser.
    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL,
      "Content-Length": String(buf.byteLength),
    });
    const cr = upstream.headers.get("Content-Range");
    if (cr) headers.set("Content-Range", cr);
    const ar = upstream.headers.get("Accept-Ranges");
    if (ar) headers.set("Accept-Ranges", ar);

    return new NextResponse(buf, {
      status: upstream.status,
      headers,
    });
  } catch (err) {
    const aborted = err?.name === "AbortError";
    return jsonError(
      aborted ? "upstream_timeout" : "upstream_unreachable",
      504
    );
  } finally {
    clearTimeout(timer);
  }
}

export const HEAD = GET;
export const runtime = "nodejs";
