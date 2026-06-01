# 🚀 Quiz Interaktif Koding dan Kecerdasan Artifisial

> Media pembelajaran digital untuk siswa SD karya **Ranti Mulyanti**.

Selamat datang di project **Quiz Interaktif Koding dan Kecerdasan Artifisial**. Aplikasi ini dibuat untuk membantu siswa belajar dan mengerjakan asesmen dengan tampilan yang lebih menarik, ringan, dan mudah digunakan melalui **GitHub Pages**.

## 👩‍🏫 Pembuat

**Ranti Mulyanti**  
Guru dan pengembang media pembelajaran interaktif.

## ✨ Fitur Utama

- 🎒 Form identitas siswa: nama dan kelas.
- 🧩 10 soal interaktif berbasis materi Koding dan Kecerdasan Artifisial.
- ⏱️ Timer 60 detik untuk setiap soal.
- ✅ Feedback benar atau salah setelah siswa menjawab.
- 🏆 Skor akhir otomatis, 10 poin untuk setiap soal.
- 📊 Dashboard admin untuk melihat nama siswa, kelas, skor, jumlah benar, dan waktu submit.
- 📁 Database manual menggunakan `db.json`.
- 📤 Export nilai ke CSV dan JSON.
- 📥 Import JSON hasil siswa ke dashboard admin.

## 🔗 Halaman

- `index.html`  
  Halaman utama untuk siswa mengerjakan quiz.

- `admin.html`  
  Dashboard admin untuk melihat dan mengelola nilai.

- `db.json`  
  Database manual statis untuk menyimpan rekap nilai.

## 🌐 Link GitHub Pages

Halaman siswa:

```text
https://ranti26.github.io/quiz-koding/
```

Dashboard admin:

```text
https://ranti26.github.io/quiz-koding/admin.html
```

## 🗂️ Mode Database JSON Manual

GitHub Pages adalah hosting statis, jadi JavaScript tidak bisa menulis langsung ke file `db.json` di repository. Karena itu, project ini memakai alur database JSON manual.

Alur penggunaan:

1. Siswa menyelesaikan quiz.
2. Siswa klik **Unduh Hasil JSON** di halaman skor akhir.
3. Admin membuka `admin.html`.
4. Admin klik **Import JSON** untuk memasukkan file hasil siswa.
5. Setelah semua file masuk, admin klik **Export JSON**.
6. Upload hasil export sebagai `db.json` ke repository GitHub.
7. Dashboard admin akan membaca data terbaru dari `db.json`.

## 📦 Struktur Project

```text
.
|-- index.html
|-- admin.html
|-- admin.js
|-- quiz-config.js
|-- quiz-submit.js
|-- db.json
|-- google-apps-script.js
|-- LICENSE.md
`-- README.md
```

## 🛡️ Lisensi dan Hak Cipta

Project ini dilindungi oleh lisensi **All Rights Reserved**.

Copyright (c) 2026 **Ranti Mulyanti**.

Kode, desain, materi, dan aset pada project ini **tidak boleh disalin, dimodifikasi, dipublikasikan ulang, dijual, atau digunakan oleh pihak lain tanpa izin tertulis dari Ranti Mulyanti**.

Lihat detail lisensi di [LICENSE.md](LICENSE.md).

## 💡 Catatan

Project ini dibuat untuk mendukung pembelajaran yang lebih interaktif, menyenangkan, dan mudah dikelola oleh guru.
