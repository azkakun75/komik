"use client";

import { useState, useEffect } from "react";
import { Wand2, Heart, Compass, Skull, Sparkles, Smile, Swords } from "lucide-react";
import { searchComics } from "@/lib/api";
import ComicGrid from "@/components/Comic/ComicGrid";

const MOODS = [
  { id: "epic", label: "Epic action", icon: Swords, q: "action" },
  { id: "feels", label: "Feels & romance", icon: Heart, q: "romance" },
  { id: "dark", label: "Dark & mature", icon: Skull, q: "horror" },
  { id: "fantasy", label: "Fantasy escape", icon: Sparkles, q: "fantasy" },
  { id: "comedy", label: "Light & funny", icon: Smile, q: "comedy" },
  { id: "explore", label: "Adventure", icon: Compass, q: "adventure" },
];

export default function MoodRecommend() {
  const [mood, setMood] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mood) return;
    let alive = true;
    setLoading(true);
    searchComics(mood.q)
      .then((d) => alive && setItems(d.slice(0, 12)))
      .catch(() => alive && setItems([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [mood]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {MOODS.map((m) => {
          const Icon = m.icon;
          const active = mood?.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m)}
              className={
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition " +
                (active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border/60 bg-elevated/40 text-text hover:border-accent/60 hover:text-accent")
              }
            >
              <Icon className="h-4 w-4" />
              {m.label}
            </button>
          );
        })}
        <div className="ml-auto inline-flex items-center gap-2 text-xs text-subtext">
          <Wand2 className="h-3.5 w-3.5 text-accent" />
          AI-mood matcher (heuristic)
        </div>
      </div>

      {mood ? (
        <ComicGrid items={items} loading={loading} skeletonCount={6} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center text-sm text-subtext">
          Pilih mood-mu di atas. AFZN AI akan ngusulin komik yang cocok.
        </div>
      )}
    </div>
  );
}
