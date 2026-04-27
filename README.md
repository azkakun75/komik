# AFZN STUDIO — Comic Reader

Platform baca manhwa / manhua / komik modern, dibangun ulang di atas
arsitektur React + Vite untuk performa tinggi dan tampilan yang bersih.

## ✨ Fitur

- Halaman Home, Terbaru, Trending, Pustaka, All Comic, History, Detail, Reader
- Reader mode dengan dark / light theme
- Search live dengan debouncing
- Tracking statistik opsional (Express + SQLite)
- Mobile responsive, sticky navbar, floating socials

## 🚀 Teknologi

- **Framework**: React 19 + React Router 7
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Backend (opsional)**: Express + better-sqlite3 untuk statistik

## 📚 API & Resources

Comic API: [https://www.sankavollerei.com/comic](https://www.sankavollerei.com/comic)

## 📦 Instalasi

```sh
git clone https://github.com/azkakun75/komik.git
cd komik
npm install
```

## 🛠 Development

```sh
# Frontend saja
npm run dev

# Frontend + statistik backend (Express + SQLite)
npm run dev:all
```

## 🏗 Build

```sh
npm run build
npm run preview
```

## ⚙ Environment Variables

| Variable        | Deskripsi                                    |
| --------------- | -------------------------------------------- |
| `VITE_API_URL`  | URL backend statistik (opsional)             |
| `PORT`          | Port untuk server statistik (default `8062`) |

Jika `VITE_API_URL` kosong, fitur tracking & halaman Statistics akan
dinonaktifkan secara aman tanpa error.

## 👤 Creator

**Azka Fatkhunnuha** — Founder, AFZN Studio

- TikTok: [@azkafatkhunnuha](https://tiktok.com/@azkafatkhunnuha)
- Instagram: [@abcdazkaaa](https://instagram.com/abcdazkaaa)
- Website: [azkafatkhunnuha.my.id](https://azkafatkhunnuha.my.id)
- Support: [sociabuzz.com/abcdazka/tribe](https://sociabuzz.com/abcdazka/tribe)

## 🙏 Credits

Dibangun di atas pekerjaan sebelumnya:

- [SankaVollereii/juju-manhwa-2.0](https://github.com/SankaVollereii/juju-manhwa-2.0) — basis kode
- [idlanyor/manhwa](https://github.com/idlanyor/manhwa) — recode pertama
- [Rhakelino/juju-manhwa-2.0](https://github.com/Rhakelino/juju-manhwa-2.0) — sumber asli

## 📄 License

Untuk keperluan edukasi & pribadi. Konten komik adalah milik penerbit masing-masing.
