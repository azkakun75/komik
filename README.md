# AFZN STUDIO COMICVERSE

> **Read Comics Beyond Limits.** Premium digital comic reader (manga · manhwa · manhua) — built by **Azka Fatkhunnuha** (AFZN Studio).

A Next.js 14 web app that consumes the public **Sanka Vollerei Comic REST API** and presents it through a luxury, multi-theme reading experience.

---

## ✨ Features

- **4 distinct visual themes** (theme switcher persists locally):
  - **Neo Crimson** — pitch-black / ink-red
  - **Emerald Reader** — deep green-black / neon emerald
  - **Royal Ink** — navy black / violet & silver
  - **Manga Paper** — cream paper / black ink / red accent
- **Premium vertical reader** — long-strip & paged modes, lazy loading, brightness, width, direction (LTR/RTL), fullscreen, auto-hide controls, top progress bar, end-of-chapter card with next/prev nav, bookmark, scroll-progress save.
- **Library** (Zustand + persist) — favorites, reading history, bookmarked chapters, recently viewed.
- **Live search** with infinite scroll + type filter (manga / manhwa / manhua).
- **Genre Explorer** with dynamic genre detail pages.
- **Bonus**: Random Comic, Surprise Me, Top 10 Weekly, Quote Panel generator, AI Mood Recommend, floating creator card, Quick Search (`⌘K`), Continue Reading popup, **PWA installable**.
- **Loading intro** with ink spread + glow title + comic slash sweep.
- **SEO** — dynamic metadata, sitemap, robots, manifest, theme-color.

---

## 🧩 API mapping

The user-supplied endpoint list (`/comic/home`, `/comic/recent`, etc.) does not exist on the actual API. Endpoints have been auto-adapted to match the live Sanka Vollerei API (verified against `https://github.com/SankaVollereii/juju-manhwa-2.0`):

| App section            | Real endpoint used                            |
| ---------------------- | --------------------------------------------- |
| Trending               | `GET /comic/trending`                         |
| Recently Updated       | `GET /comic/terbaru`                          |
| Popular / Unlimited    | `GET /comic/unlimited`                        |
| Library / Pustaka      | `GET /comic/pustaka/:page`                    |
| Recommendations        | `GET /comic/recommendations`                  |
| Genres                 | `GET /comic/genres`                           |
| Comic Detail           | `GET /comic/comic/:slug`                      |
| Chapter pages          | `GET /comic/chapter<chapterLink>`             |
| Search                 | `GET /comic/search?q=:query`                  |

Override the base URL via `NEXT_PUBLIC_API_BASE` env var (defaults to `https://www.sankavollerei.com`).

---

## 🛠️ Tech stack

- **Next.js 14** (App Router) + React 18
- **Tailwind CSS** (CSS variables for theming)
- **Framer Motion** (page/intro transitions, hero carousel)
- **Zustand** (library/reader stores, persisted)
- **Swiper.js** (homepage carousels)
- **Axios** (HTTP)
- **Lucide React** (icons)

---

## 🚀 Getting started

```bash
# Install
npm install

# Dev server
npm run dev

# Production build
npm run build && npm start
```

The app reads no auth keys from the API — it works out of the box.

### Environment variables (optional)

```env
NEXT_PUBLIC_API_BASE=https://www.sankavollerei.com
```

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel (default Next.js preset is auto-detected).
3. Optionally set `NEXT_PUBLIC_API_BASE` if you proxy the API through your own host.
4. Done. Every push to `main` ships an auto-preview.

---

## 👤 Creator

**Azka Fatkhunnuha** — Founder & Creative Director, AFZN Studio.

- TikTok: <https://tiktok.com/@azkafatkhunnuha>
- Instagram: <https://instagram.com/abcdazkaaa>
- Website: <https://azkafatkhunnuha.my.id>
- Support: <https://sociabuzz.com/abcdazka/tribe>

> © 2026 AFZN STUDIO COMICVERSE — Created with ❤ by Azka Fatkhunnuha.

---

## 📜 License

MIT. Comic data is fetched from the third-party Sanka Vollerei API; this project does **not** host or store any comic content.
