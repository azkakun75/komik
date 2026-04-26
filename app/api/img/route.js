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

function rangeHeaders(request, upstream) {
  const range = request.headers.get("range");
  return range ? { Range: range } : undefined;
}

export async function GET(request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("u") || url.searchParams.get("url");
  if (!raw) {
    return NextResponse.json(
      { error: "missing_url", message: "Query parameter `u` is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  let target;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json(
      { error: "invalid_url" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (!ALLOWED_PROTOCOLS.has(target.protocol)) {
    return NextResponse.json(
      { error: "blocked_protocol" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);

  try {
    const upstream = await fetch(target.toString(), {
      method: "GET",
      signal: ac.signal,
      headers: {
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: `${target.protocol}//${target.host}/`,
        ...rangeHeaders(request, target),
      },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: "upstream_failed", status: upstream.status },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const buf = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("Content-Type") || "image/jpeg";
    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL,
      "Content-Length": String(buf.byteLength),
    });
    const cl = upstream.headers.get("Content-Length");
    if (cl) headers.set("Content-Length", cl);
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
    return NextResponse.json(
      {
        error: aborted ? "upstream_timeout" : "upstream_unreachable",
      },
      { status: 504, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    clearTimeout(timer);
  }
}

export const HEAD = GET;
export const runtime = "nodejs";
