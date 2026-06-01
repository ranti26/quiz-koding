# Quiz Interaktif Koding dan Kecerdasan Artifisial

> Dibuat untuk pembelajaran siswa SD oleh **Ranti Mulyanti**.

Quiz berbasis **HTML, CSS, dan JavaScript** yang siap dipasang di **GitHub Pages**. Siswa mengisi identitas, mengerjakan soal satu per satu dengan timer, lalu nilai akhir tersimpan dan bisa dibaca melalui dashboard admin.

## Fitur

- Tampilan quiz ramah siswa sekolah dasar.
- Identitas siswa: nama dan kelas.
- 10 soal, masing-masing bernilai 10 poin.
- Timer 60 detik untuk setiap soal.
- Feedback benar atau salah setelah menjawab.
- Skor akhir otomatis.
- Dashboard admin untuk melihat nama, kelas, skor, jumlah benar, dan waktu submit.
- Export CSV untuk rekap nilai.
- Export dan import JSON untuk mode database manual.

## Halaman

- `index.html`  
  Halaman utama untuk siswa mengerjakan quiz.

- `admin.html`  
  Dashboard admin untuk melihat dan mengelola nilai.

- `db.json`  
  Database manual statis. File ini bisa diganti/upload ulang ke GitHub jika ingin dashboard membaca data dari JSON.

## Cara Pakai di GitHub Pages

1. Upload semua file di folder ini ke repository GitHub.
2. Buka `Settings > Pages`.
3. Pilih `Deploy from a branch`.
4. Pilih branch `main` dan folder `/root`.
5. Tunggu link GitHub Pages aktif.

Contoh link:

```text
https://username.github.io/quiz-koding/
https://username.github.io/quiz-koding/admin.html
```

## Mode Database JSON Manual

GitHub Pages adalah hosting statis, jadi JavaScript tidak bisa menulis langsung ke `db.json` di repository. Alur manual yang bisa dipakai:

1. Buka `admin.html`.
2. Jika ada data lokal, klik **Export JSON**.
3. File akan terunduh dengan nama `db.json`.
4. Upload/ganti file `db.json` di repository GitHub.
5. Setelah GitHub Pages update, dashboard admin akan membaca data dari `db.json`.

Untuk menggabungkan data dari komputer lain, gunakan tombol **Import JSON**, lalu export ulang menjadi `db.json`.

Jika siswa mengerjakan dari perangkat masing-masing:

1. Siswa menyelesaikan quiz.
2. Siswa klik **Unduh Hasil JSON** di halaman skor akhir.
3. Admin membuka `admin.html`.
4. Admin klik **Import JSON** untuk memasukkan file hasil siswa.
5. Setelah semua file masuk, admin klik **Export JSON**.
6. Upload hasil export sebagai `db.json` ke GitHub.

## Struktur Project

```text
.
├── index.html
├── admin.html
├── admin.js
├── quiz-config.js
├── quiz-submit.js
├── db.json
├── google-apps-script.js
└── README.md
```

## Kredit

Materi dan pengembangan quiz: **Ranti Mulyanti**

Dirancang agar kegiatan asesmen terasa lebih interaktif, ringan, dan mudah digunakan di kelas.
