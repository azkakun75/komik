"use client";

import { useEffect, useRef, useState } from "react";
import { proxyImage } from "@/lib/utils";

/**
 * A single chapter page rendered inside the reader strip.
 *
 * Two important behaviours layered on top of native `loading="lazy"`:
 *
 * 1. The actual <img> is only mounted once the slot enters (or is close to)
 *    the viewport, via IntersectionObserver. Comic chapters can have 50+
 *    pages, and forcing the browser to layout every image immediately costs
 *    real time on low-end mobile devices even with native lazy decoding.
 * 2. The src is routed through `/api/img` so the browser hits Vercel's edge
 *    cache instead of the slow upstream image CDN. Subsequent reads of the
 *    same chapter are served almost instantly.
 */
export default function ReaderImage({ src, index = 0, eagerCount = 2 }) {
  const eager = index < eagerCount;
  const [shouldLoad, setShouldLoad] = useState(eager);
  const slotRef = useRef(null);

  useEffect(() => {
    if (shouldLoad) return undefined;
    if (typeof window === "undefined") return undefined;
    const node = slotRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            return;
          }
        }
      },
      // Pre-load roughly two screens ahead so scrolling stays smooth.
      { rootMargin: "1500px 0px 1500px 0px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const proxied = shouldLoad ? proxyImage(src) : null;

  return (
    <div ref={slotRef} className="reader-img-slot">
      {shouldLoad ? (
        <img
          src={proxied}
          alt={`Page ${index + 1}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "low"}
          className="reader-img select-none"
          draggable={false}
        />
      ) : (
        <div className="reader-img-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
