# manabu-zen-jlpt (VLearn JLPT)

Aplikasi belajar bahasa Jepang untuk persiapan JLPT. Saat ini berisi materi level **N5** dengan berbagai mode belajar yang interaktif.

## Akses Online

- **Live Website:** <https://dev-vislian.github.io/VLearn-JLPT/>

## Fitur

- **Kana** — Belajar hiragana & katakana dengan 5 mode: Grid, Flashcard, Cocokkan, Kuis, dan Rush.
- **JLPT N5** — Materi kanji, kosakata, dan tata bahasa yang dikelompokkan per unit.
  - **Ringkasan** — Daftar materi lengkap dengan pencarian, bookmark, dan audio.
  - **Flashcard** — Hafalan kartu bolak-balik (Jepang ↔ Indonesia).
  - **Cocokkan** — Pasangkan karakter dengan arti.
  - **Kuis** — Pilihan ganda dengan skor.
  - **Matome** — Latihan kontekstual berbasis kalimat.
- **Zen Mode** — Timer pomodoro untuk sesi belajar fokus.
- **Favorites** — Kumpulan item yang di-bookmark.
- **Furigana toggle** — Tampilkan/sembunyikan furigana.
- **Text-to-Speech** — Dengarkan pelafalan bahasa Jepang.

## Alur Navigasi

```
Beranda (/)
  ├── Kana (/kana)
  ├── N5 (/n5)
  │     └── Materi: Kanji | Kosakata | Tata Bahasa (/n5/kanji, /n5/vocab, /n5/grammar)
  │           └── Daftar Unit (/n5/kanji/unit-1, dst.)
  │                 └── Aktivitas: Ringkasan | Flashcard | Cocokkan | Kuis | Matome
  ├── Favorit (/favorites)
  └── Zen Mode (/zen)
```

Level N4–N1 sudah terlihat di Beranda namun masih terkunci (badge "Segera Hadir") karena materinya belum tersedia.

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