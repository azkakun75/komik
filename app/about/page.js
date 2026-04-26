import Link from "next/link";
import { SITE } from "@/lib/themes";
import { Heart, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Creator",
  description:
    "Tentang Azka Fatkhunnuha, pendiri AFZN STUDIO COMICVERSE. Kreator UI, designer, dan storyteller dari Indonesia.",
};

const ICONS = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16.6 5.82A4.27 4.27 0 0 1 14.49 2H11v13.07a2.6 2.6 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.06a6.06 6.06 0 1 0 5.21 6V8.74a7.7 7.7 0 0 0 4.6 1.5V6.7a4.3 4.3 0 0 1-2.4-.88Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 21s-7-4.5-9.5-9.2C.5 7.5 3 4 6.5 4 9 4 10.5 5.5 12 7c1.5-1.5 3-3 5.5-3 3.5 0 6 3.5 4 7.8C19 16.5 12 21 12 21Z" />
    </svg>
  ),
};

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">
        About the creator
      </div>
      <h1 className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">
        {SITE.creator.name}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-subtext">
        AFZN STUDIO COMICVERSE adalah obsesi pribadi Azka untuk membuat
        pengalaman baca komik se-premium mungkin — long-strip yang lembut,
        kontrol baca yang serius, dan UI yang berani. Dibangun dari Indonesia,
        untuk dunia.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-accent/15 via-surface to-bg p-8 shadow-panel">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Founder · Creative Director
            </div>
            <h2 className="font-display text-3xl font-black leading-tight">
              Designed with obsession.
              <br />
              <span className="text-accent">Read with imagination.</span>
            </h2>
            <p className="mt-4 text-sm text-subtext">
              “{SITE.creator.quote}”
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SITE.creator.socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-elevated/50 px-3 py-4 text-xs hover:border-accent/60 hover:text-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accent">
                    {ICONS[s.id]}
                  </span>
                  <span className="font-semibold">{s.label}</span>
                </a>
              ))}
            </div>

            <a
              href={SITE.creator.socials.find((x) => x.id === "support")?.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6"
            >
              <Heart className="h-4 w-4" /> Support the creator
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <FAQItem title="Apa itu AFZN STUDIO COMICVERSE?">
            Platform baca komik modern (manga/manhwa/manhua) dengan UI premium
            ala webtoon platform berbayar — gratis, dan dibangun oleh
            independent creator.
          </FAQItem>
          <FAQItem title="Sumber data komik?">
            Semua data komik di-fetch dari REST API publik{" "}
            <a
              href="https://www.sankavollerei.com"
              className="text-accent underline"
              target="_blank"
              rel="noreferrer"
            >
              Sanka Vollerei
            </a>
            . Komikversse tidak menyimpan atau hosting konten apapun.
          </FAQItem>
          <FAQItem title="Apa yang membuatnya berbeda?">
            Empat tema visual pilihan, reader dengan mode long-strip + paged,
            kontrol brightness, library lokal yang persisten, AI mood matcher,
            quote panel, dan PWA installable.
          </FAQItem>
          <FAQItem title="Mau kerja bareng?">
            <Link href="https://azkafatkhunnuha.my.id" className="text-accent">
              Cek portfolio Azka
            </Link>{" "}
            atau{" "}
            <a
              className="text-accent"
              href="https://instagram.com/abcdazkaaa"
              target="_blank"
              rel="noreferrer"
            >
              DM via Instagram
            </a>
            .
          </FAQItem>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ title, children }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 shadow-panel">
      <div className="font-display text-base font-bold">{title}</div>
      <p className="mt-1 text-sm text-subtext">{children}</p>
    </div>
  );
}
