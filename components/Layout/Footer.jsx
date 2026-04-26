"use client";

import Link from "next/link";
import { SITE } from "@/lib/themes";
import { Heart } from "lucide-react";

const SOCIAL_ICON = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16.6 5.82A4.27 4.27 0 0 1 14.49 2H11v13.07a2.6 2.6 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.06a6.06 6.06 0 1 0 5.21 6V8.74a7.7 7.7 0 0 0 4.6 1.5V6.7a4.3 4.3 0 0 1-2.4-.88Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 21s-7-4.5-9.5-9.2C.5 7.5 3 4 6.5 4 9 4 10.5 5.5 12 7c1.5-1.5 3-3 5.5-3 3.5 0 6 3.5 4 7.8C19 16.5 12 21 12 21Z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border/60 bg-surface/60">
      <div className="absolute inset-0 -z-10 bg-ink-grid bg-[length:18px_18px] opacity-[0.18]" />
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl font-black leading-tight">
              AFZN STUDIO
              <span className="block text-accent">COMICVERSE</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-subtext">
              {SITE.tagline}. Premium digital reader untuk manga, manhwa, dan
              manhua. Dibangun dengan obsesi terhadap detail.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SITE.creator.socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  aria-label={s.label}
                >
                  {SOCIAL_ICON[s.id]}
                  <span className="text-xs">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-subtext">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="hover:text-accent" href="/">Home</Link></li>
              <li><Link className="hover:text-accent" href="/search">Search</Link></li>
              <li><Link className="hover:text-accent" href="/genres">Genres</Link></li>
              <li><Link className="hover:text-accent" href="/library">Library</Link></li>
              <li><Link className="hover:text-accent" href="/random">Surprise Me</Link></li>
              <li><Link className="hover:text-accent" href="/about">About Creator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-subtext">
              Creator
            </h4>
            <div className="mt-4 panel p-5">
              <div className="text-sm text-subtext">Designed & built by</div>
              <div className="mt-1 font-display text-xl font-black">
                {SITE.creator.name}
              </div>
              <div className="text-xs text-subtext">{SITE.creator.role}</div>
              <a
                href={SITE.creator.socials.find((s) => s.id === "support")?.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-4 w-full justify-center"
              >
                <Heart className="h-4 w-4" />
                Support the creator
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-center text-xs text-subtext sm:flex-row sm:text-left">
          <div>© 2026 AFZN STUDIO COMICVERSE</div>
          <div>
            Created with <span className="text-accent">❤</span> by{" "}
            <a
              className="font-semibold text-text hover:text-accent"
              href="https://azkafatkhunnuha.my.id"
              target="_blank"
              rel="noreferrer"
            >
              Azka Fatkhunnuha
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
