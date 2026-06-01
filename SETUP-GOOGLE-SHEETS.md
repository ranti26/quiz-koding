# 📊 Setup Google Sheets untuk Database Nilai

Panduan ini membuat nilai siswa otomatis masuk ke Google Sheets setelah siswa selesai mengerjakan quiz.

## 1. Buat Google Sheets

1. Buka Google Drive.
2. Buat file **Google Sheets** baru.
3. Beri nama, misalnya:

```text
Database Nilai Quiz Koding
```

## 2. Buka Apps Script

1. Di Google Sheets, klik menu **Extensions**.
2. Pilih **Apps Script**.
3. Hapus isi file `Code.gs`.
4. Salin semua isi file:

```text
google-apps-script.js
```

5. Tempel ke `Code.gs`.
6. Klik **Save**.

## 3. Ganti Kode Admin

Di Apps Script, cari bagian ini:

```javascript
const ADMIN_KEY = "admin123";
```

Ganti `admin123` dengan kode yang Ibu inginkan, misalnya:

```javascript
const ADMIN_KEY = "ranti2026";
```

Kode ini dipakai dashboard admin untuk membaca data nilai.

## 4. Deploy sebagai Web App

1. Klik **Deploy**.
2. Pilih **New deployment**.
3. Klik ikon gear, pilih **Web app**.
4. Isi pengaturan:

```text
Execute as: Me
Who has access: Anyone
```

5. Klik **Deploy**.
6. Jika diminta izin, klik **Authorize access**.
7. Copy URL Web App yang muncul.

URL biasanya berbentuk:

```text
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
```

## 5. Masukkan URL ke quiz-config.js

Buka file:

```text
quiz-config.js
```

Isi bagian `endpointUrl` dengan URL Web App:

```javascript
window.QUIZ_CONFIG = {
  dbJsonUrl: "db.json",
  endpointUrl: "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec",
  adminKey: "ranti2026"
};
```

Pastikan `adminKey` sama dengan `ADMIN_KEY` di Apps Script.

## 6. Upload Ulang ke GitHub

Setelah `quiz-config.js` diubah:

1. Commit perubahan.
2. Push ke GitHub.
3. Tunggu GitHub Pages update.

## 7. Cara Pakai

Siswa membuka:

```text
https://ranti26.github.io/quiz-koding/
```

Admin membuka:

```text
https://ranti26.github.io/quiz-koding/admin.html
```

Setelah siswa selesai quiz dan menekan **Lihat Hasil**, nilai otomatis dikirim ke Google Sheets.

## Catatan Penting

- Jangan bagikan kode admin kepada siswa.
- Jika Apps Script diedit, lakukan deploy ulang atau pilih **Manage deployments > Edit > New version**.
- Kalau dashboard belum menampilkan data, klik **Muat Data**.
