"use client";

import { useMemo, useState } from "react";
import { Quote, Shuffle, Download } from "lucide-react";
import { motion } from "framer-motion";

const QUOTES = [
  {
    text: "I alone level up. The world doesn't decide my limits—I do.",
    author: "Sung Jin-Woo",
    work: "Solo Leveling",
  },
  {
    text: "Even if you don't believe in yourself, believe in me—who believes in you.",
    author: "Kamina",
    work: "Tengen Toppa Gurren Lagann",
  },
  {
    text: "If you want to make your dreams come true, the first thing you have to do is wake up.",
    author: "Roy T. Bennett",
    work: "Webtoon Wisdom",
  },
  {
    text: "Manhwa taught me: every panel is a heartbeat, every gutter is a breath.",
    author: "Comicverse",
    work: "Reader's Manifesto",
  },
  {
    text: "Read like nobody is watching. Read like every page is the last.",
    author: "Azka Fatkhunnuha",
    work: "AFZN Studio",
  },
  {
    text: "We are the panels of the story we never finished writing.",
    author: "Anonymous",
    work: "Inkheart",
  },
  {
    text: "A hero is born from the page, not from the spotlight.",
    author: "Bam",
    work: "Tower of God",
  },
];

export default function QuotePanel() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const q = useMemo(() => QUOTES[idx % QUOTES.length], [idx]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-surface to-bg p-6 shadow-panel sm:p-10">
      <div className="absolute -right-10 -top-10 text-[14rem] leading-none text-accent/10">
        “
      </div>
      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
          <Quote className="h-3.5 w-3.5" /> Quote panel · share-worthy
        </div>
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl"
        >
          “{q.text}”
        </motion.p>
        <div className="mt-4 text-sm text-subtext">
          — <span className="text-text">{q.author}</span> · {q.work}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % QUOTES.length)}
            className="btn-primary"
          >
            <Shuffle className="h-4 w-4" /> Generate another
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator
                  .share({
                    title: "AFZN Comicverse — Quote Panel",
                    text: `“${q.text}” — ${q.author} (${q.work})`,
                  })
                  .catch(() => {});
              } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(
                  `“${q.text}” — ${q.author} (${q.work})`
                );
              }
            }}
            className="btn"
          >
            <Download className="h-4 w-4" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
