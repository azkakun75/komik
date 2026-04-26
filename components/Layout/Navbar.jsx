"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Library,
  Compass,
  Sparkles,
  Shuffle,
  Home,
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import { SITE } from "@/lib/themes";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/genres", label: "Genres", icon: Compass },
  { href: "/library", label: "Library", icon: Library },
  { href: "/random", label: "Surprise", icon: Sparkles },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={
        "sticky top-0 z-40 transition-colors " +
        (scrolled
          ? "border-b border-border/50 bg-bg/85 backdrop-blur-xl"
          : "bg-transparent")
      }
    >
      <div className="container-page flex h-16 items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-accent text-white shadow-glow">
            <span className="absolute inset-0 rounded-xl bg-accent/30 blur-md" />
            <span className="relative font-display text-sm font-black">A</span>
          </span>
          <div className="hidden sm:block">
            <div className="font-display text-sm font-black leading-none tracking-wide">
              {SITE.short.toUpperCase()}
            </div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-accent">
              AFZN Studio
            </div>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition " +
                  (active
                    ? "text-text"
                    : "text-subtext hover:text-text")
                }
              >
                <Icon className="h-4 w-4" />
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-elevated/70 ring-1 ring-accent/40"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={onSubmit}
          className="ml-auto hidden items-center gap-2 md:flex"
        >
          <div className="group relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtext" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Cari komik, manhwa, manhua..."
              className="w-72 rounded-full border border-border/60 bg-elevated/50 py-2 pl-9 pr-4 text-sm text-text placeholder:text-subtext/80 outline-none transition focus:border-accent/60 focus:bg-elevated"
            />
          </div>
          <ThemeSwitcher />
        </form>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto inline-flex items-center justify-center rounded-full border border-border/60 bg-elevated/40 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="container-page space-y-3 pb-4">
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtext" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="Cari komik..."
                  className="w-full rounded-full border border-border/60 bg-elevated/50 py-2 pl-9 pr-4 text-sm text-text outline-none focus:border-accent/60"
                />
              </div>
              <ThemeSwitcher compact />
            </form>
            <div className="grid grid-cols-2 gap-2">
              {links.concat({ href: "/search", label: "Search", icon: Search }).map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href + "-m"}
                    href={l.href}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-elevated/50 px-3 py-2 text-sm"
                  >
                    <Icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
