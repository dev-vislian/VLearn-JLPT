# manabu-zen-jlpt (VLearn JLPT)

Aplikasi belajar bahasa Jepang untuk persiapan JLPT. Saat ini berisi materi level **N5** dengan berbagai mode belajar yang interaktif.

## Akses Online

- **Live Website:** <https://dev-vislian.github.io/VLearn-JLPT/>

## Fitur

- **Kana** — Belajar hiragana & katakana dengan 4 mode: Grid, Flashcard, Match, dan Quiz.
- **JLPT N5** — Materi kanji, kosakata, dan grammar yang dikelompokkan per unit.
  - **Summary** — Daftar materi lengkap dengan pencarian, bookmark, dan audio.
  - **Flashcard** — Hafalan kartu bolak-balik (Jepang ↔ Indonesia).
  - **Match** — Pasangkan karakter dengan arti.
  - **Quiz** — Pilihan ganda dengan skor.
  - **Matome** — Latihan kontekstual berbasis kalimat.
- **Zen Mode** — Timer pomodoro untuk sesi belajar fokus.
- **Favorites** — Kumpulan item yang di-bookmark.
- **Furigana toggle** — Tampilkan/sembunyikan furigana.
- **Text-to-Speech** — Dengarkan pelafalan bahasa Jepang.

## Teknologi

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Deploy otomatis ke GitHub Pages via GitHub Actions

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

## Build Offline

```bash
npm run build -- --mode offline
```

Build offline berada di folder `dist-offline/` dan bisa dibuka langsung via `file://`.

## Struktur Data

- `src/data/kana.js` — data hiragana & katakana.
- `src/data/n5/vocab/` — kosakata N5 (16 unit).
- `src/data/n5/kanji/` — kanji N5 (5 unit).
- `src/data/n5/grammar/` — grammar N5 (16 unit).

## Deployment

Workflow `.github/workflows/deploy.yml` otomatis membangun dan deploy aplikasi ke GitHub Pages setiap push ke branch `main`.