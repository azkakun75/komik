import { NextResponse } from "next/server";

const UPSTREAM = "https://www.sankavollerei.com";
const UPSTREAM_TIMEOUT_MS = 12_000;

// Cache upstream responses on the edge for 60s, then serve stale for 5 min
// while revalidating in background.
const CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300, stale-if-error=600";

function buildUpstreamUrl(request, segments) {
  const path = segments?.map(encodeURIComponent).join("/") || "";
  const search = new URL(request.url).search || "";
  return `${UPSTREAM}/comic/${path}${search}`;
}

async function proxy(request, { params }) {
  const segments = Array.isArray(params?.path) ? params.path : [];
  const target = buildUpstreamUrl(request, segments);

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(target, {
      method: "GET",
      signal: ac.signal,
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: `${UPSTREAM}/`,
        Origin: UPSTREAM,
      },
      // Next.js edge data cache — 60s TTL at the runtime level too.
      next: { revalidate: 60 },
    });

    const body = await upstream.text();
    const res = new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": upstream.ok ? CACHE_CONTROL : "no-store",
      },
    });
    return res;
  } catch (err) {
    const aborted = err?.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted ? "upstream_timeout" : "upstream_unreachable",
        message: aborted
          ? "Upstream comic API took too long to respond."
          : "Could not reach the comic API.",
        target,
      },
      { status: 504, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    clearTimeout(timer);
  }
}

export const GET = proxy;
export const HEAD = proxy;
export const revalidate = 60;
export const runtime = "nodejs";
