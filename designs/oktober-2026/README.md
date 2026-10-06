# Desain Konten Oktober 2026 — @gusteebakery

22 desain siap upload untuk rencana konten Oktober 2026 (lihat `../../gusteebakery-content-marketing.md`, bagian 5).
Preview grid: `preview-feed-oktober.png`.

| Tanggal | File (`png/`) | Format |
|---|---|---|
| 6 Okt | `01_…_hello-october` | Feed 1080×1440 |
| 7 Okt | `02_…_open-po-batch-A`, `02s_…_story_open-po-batch-A` | Feed + Story |
| 8 Okt | `03_…_reels-cover_donat` | Cover Reels 1080×1920 |
| 9 Okt | `04_…_save-the-date` | Feed |
| 10 Okt | `05_…_story_polling` | Story (tambah stiker polling di area kosong) |
| 12 Okt | `06_…_coming-soon` | Feed |
| 13 Okt | `07_…_story_countdown` | Story (tambah stiker countdown di bawah) |
| 14 Okt | `08_…_meet-our-newest-bake` | Feed |
| 16 Okt | `09a/09b/09c_…_carousel` | Carousel 3 slide |
| 17 Okt | `10_…_reels-cover_banana-bread` | Cover Reels |
| 19 Okt | `11_…_love-notes` | Feed |
| 21 Okt | `12_…_open-po-batch-B`, `12s_…_story_open-po-batch-B` | Feed + Story |
| 23 Okt | `13_…_reels-cover_kenalan` | Cover Reels |
| 27 Okt | `14a/14b/14c_…_carousel` | Carousel 3 slide |
| 29 Okt | `15_…_story_qna` | Story (tambah stiker pertanyaan) |
| 31 Okt | `16_…_thank-you-october` | Feed |

Feed memakai rasio 3:4 (1080×1440) agar pas dengan grid Instagram terbaru.
Cover Reels: teks berada di area tengah 3:4 supaya tetap terbaca di grid.

## Placeholder
- Teks bergaris putus-putus = data yang belum ada (nama/harga menu Oktober, nomor batch, clue, testimoni).
  Ubah di `src/config.js`.
- Kotak bergaris "FOTO" = slot foto. Taruh foto di `photos/` dengan nama file yang tertulis di kotak
  (`donat.jpg`, `banana-bread.jpg`, `menu-oktober.jpg`, `testi-1.jpg`, `testi-2.jpg`, `love-note.jpg`,
  `reels-donat.jpg`, `reels-banana.jpg`, `reels-owner.jpg`).

## Render ulang
```
node designs/oktober-2026/src/render.cjs
```
Butuh Node + Playwright (Chromium). Font (Cormorant Garamond, Fraunces, Homemade Apple, Montserrat — Google Fonts, OFL) sudah disertakan di `src/fonts/`.
