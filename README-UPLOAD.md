# Upload ke GitHub Pages

Folder ini siap diupload ke GitHub Pages.

## File utama

- `index.html`: halaman quiz untuk siswa.
- `admin.html`: dashboard admin nilai.
- `quiz-config.js`: pengaturan endpoint Google Sheets dan kode admin.
- `google-apps-script.js`: kode backend Google Sheets.

## Upload ke GitHub

1. Buat repository baru di GitHub, misalnya `quiz-koding`.
2. Upload semua file di folder `quiz-koding-pages`.
3. Buka `Settings > Pages`.
4. Pada `Build and deployment`, pilih `Deploy from a branch`.
5. Pilih branch `main` dan folder `/root`.
6. Simpan, lalu tunggu GitHub membuat link.

Link siswa biasanya menjadi:

`https://USERNAME.github.io/quiz-koding/`

Link admin:

`https://USERNAME.github.io/quiz-koding/admin.html`

## Agar nilai siswa masuk online

GitHub Pages tidak punya database. Untuk menyimpan nilai online, pakai Google Sheets:

1. Buat Google Sheets baru.
2. Buka `Extensions > Apps Script`.
3. Hapus isi `Code.gs`, lalu tempel isi `google-apps-script.js`.
4. Ubah `ADMIN_KEY` jika perlu.
5. Klik `Deploy > New deployment`.
6. Pilih tipe `Web app`.
7. `Execute as`: `Me`.
8. `Who has access`: `Anyone`.
9. Copy URL Web App.
10. Tempel URL itu ke `quiz-config.js` pada bagian `endpointUrl`.
11. Upload ulang `quiz-config.js` ke GitHub.

Setelah itu siswa mengerjakan lewat `index.html`, dan nilai bisa dibuka lewat `admin.html`.
