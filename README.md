# SIMPEL — Sistem Informasi Pelaporan Lingkungan Kota
> **Tugas Besar Manajemen Proyek Perangkat Lunak (MPPL) — Semester 5**  
> Solusi digital terintegrasi untuk pemantauan, pelaporan, dan tindak lanjut isu lingkungan hidup perkotaan berbasis partisipasi masyarakat dan Geographic Information System (GIS).

---

## Tim Pengembang — Kelompok 5 MPPL

| No | Nama Anggota | NIM | Peran / Tanggung Jawab |
|:--:|:---|:---:|:---|
| 1 | **Nabila Safawani** | **1247050046** | Project Manager |
| 2 | **Raihan Khoirul Aziz** | **1247050006** | System Analyst |
| 3 | **Raihan Fadhila** | **1247050108** | UI/UX Designer |
| 4 | **Raisya Fathul Jabbar** | **1247050007** | Backend Developer |
| 5 | **Qoisy Ahmad Furqon** | **1247050062** | Frontend Developer 1 |
| 6 | **Rafly Ahmad Muzaki** | **1247050019** | Frontend Developer 2 |
| 7 | **Muhammad Ibnu Hanif** | **1247050057** | QA Tester & Technical Writer |

---

## Latar Belakang & Gambaran Umum

**SIMPEL (Sistem Informasi Pelaporan Lingkungan Kota)** adalah platform partisipasi publik modern yang menghubungkan warga perkotaan dengan instansi kedinasan lingkungan hidup secara transparan, cepat, dan akuntabel. Terinspirasi dari standar tata kelola aduan nasional **SP4N-LAPOR!**, SIMPEL mendigitalkan alur penanganan masalah lingkungan seperti tumpukan sampah liar, limbah industri, polusi udara, kerusakan ruang terbuka hijau (RTH), dan genangan drainase.

Dengan SIMPEL, warga tidak hanya dapat mengirimkan aduan beserta foto bukti dan titik presisi peta, tetapi juga dapat memantau transparansi penanganan secara terbuka pada feed **Laporan Masuk Terkini**, serta mengeksplorasi titik-titik insiden pada **Peta Sebaran Interaktif**.

---

## Fitur Unggulan Sistem

### 1.Formulir Pengaduan Cerdas & Berbasis Lokasi (GIS)
- **Klasifikasi Aduan**: Mendukung tipe *Pengaduan*, *Aspirasi*, dan *Permintaan Informasi*.
- **Smart City Geocoding**: Form secara otomatis mengenali nama kota/kecamatan (seperti **Bandung, Sumedang, Surabaya, Jakarta, Semarang, Yogyakarta**, dsb.) dan memosisikan koordinat GPS secara presisi.
- **Interactive Mini Map Picker**: Warga dapat mencari jalan/kota, menggunakan tombol **GPS Saya**, atau menggeser pin lokasi langsung di peta.
- **Anti-Overlapping Markers**: Koordinat diolah sedemikian rupa agar aduan pada lokasi yang sama tidak saling bertumpuk dan tetap dapat diklik secara terpisah.

### 2.Transparansi Nama Akun & Opsi Anonim
- **Identitas Transparan**: Setiap warga yang mengirimkan aduan/aspirasi akan tertera nama akunnya secara otomatis pada feed publik.
- **Opsi Anonim**: Warga dapat mencentang opsi *Kirim sebagai Anonim* apabila ingin menyembunyikan identitas akunnya dari publik demi privasi dan keamanan pelapor.
- **Privasi Rahasia**: Opsi rahasia untuk aduan sensitif yang hanya dapat dibaca oleh aparat verifikator dinas.

### 3.Peta Persebaran Interaktif Publik
- Peta sebaran insiden lingkungan berbasis **Leaflet JS & OpenStreetMap**.
- Dilengkapi **Auto-Fit Bounds**: Peta otomatis menyesuaikan rentang zoom dan pusat pandang agar semua titik penanda dari berbagai daerah (misal titik di Bandung dan Surabaya) langsung terlihat bersamaan di layar.
- Filter interaktif berdasarkan status penanganan (*Menunggu Verifikasi*, *Sedang Diproses*, *Selesai*, *Ditolak*) dan kategori isu.
- Pop-up penanda dilengkapi informasi pelapor, ringkasan aduan, dan tombol langsung **Lihat Detail Aduan**.

### 4.Laporan Masuk Terkini & Pop-up Detail
- Menampilkan daftar laporan masuk terbaru masyarakat secara langsung di beranda.
- Setiap kartu menampilkan foto bukti, kategori, status, nama akun pengirim (atau badge *Anonim*), wilayah kejadian, dan tanggal.
- Klik pada kartu laporan untuk membuka **Modal Detail Aduan Transparan**, yang memuat alur tindak lanjut dinas serta catatan resmi petugas lapangan.

### 5.Portal Resmi Petugas / Admin (`/admin`)
- **Meja Kerja Petugas**: Validasi status laporan (*Menunggu Verifikasi*, *Diproses*, *Selesai*, *Ditolak*) dan pemberian catatan tindak lanjut regu lapangan.
- **Peta Pantau Wilayah (GIS Monitoring)**: Peta terdedikasi petugas dengan visualisasi warna status insiden kota dan fitur pemusatan peta (*Reset Bounds*).
- **Dashboard Analitik**: Diagram proporsi klasifikasi aduan, rasio status penanganan, dan statistik isu lingkungan per wilayah.
- **Ekspor Dokumen Resmi**: Unduh rekapitulasi data laporan ke dalam format **PDF Resmi** bersertifikat instansi.

### 6.Autentikasi Pengguna & Petugas
- **Warga**: Masuk aman tanpa password rumit menggunakan kode verifikasi **OTP Email Nyata** (dikirimkan langsung ke kotak masuk pengguna melalui integrasi EmailJS).
- **Petugas / Administrator**: Login berotoritas tinggi dengan kredensial staf dinas resmi.

---

## Arsitektur & Teknologi (Tech Stack)

| Lapisan | Teknologi yang Digunakan |
|:---|:---|
| **Backend Framework** | [Laravel 12](https://laravel.com) (PHP 8.2+) |
| **Frontend Rendering** | Blade Templating Engine, Semantic HTML5 |
| **Styling & Design System** | Modern Vanilla CSS (LAPOR! Civic Red visual identity, Flexbox/Grid, Responsive Mobile-First) |
| **Peta Digital (GIS)** | [Leaflet.js](https://leafletjs.com/) v1.9.4 & OpenStreetMap Tiles |
| **Layanan Email OTP** | EmailJS Browser SDK & Laravel OTP Service |
| **Ekspor PDF** | jsPDF & jsPDF-AutoTable |
| **Penyimpanan Data** | SQLite / MySQL & Browser Local Storage Synchronization |

---

## Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- PHP >= 8.2
- Composer
- Node.js & npm

### Langkah Instalasi

1. **Clone repositori dan masuk ke direktori proyek**:
   ```bash
   cd simpel-app
   ```

2. **Salin berkas lingkungan (`.env`)**:
   ```bash
   cp .env.example .env
   ```

3. **Install dependensi PHP & JavaScript**:
   ```bash
   composer install
   npm install
   ```

4. **Generate application key**:
   ```bash
   php artisan key:generate
   ```

5. **Jalankan migrasi database**:
   ```bash
   php artisan migrate
   ```

6. **Jalankan server pengembangan**:
   Buka dua terminal terpisah:
   ```bash
   # Terminal 1: Laravel Backend
   php artisan serve
   ```
   ```bash
   # Terminal 2: Asset Bundler
   npm run dev
   ```

7. **Akses aplikasi di browser**:
   - **Portal Warga**: `http://127.0.0.1:8000`
   - **Portal Petugas / Admin**: `http://127.0.0.1:8000/admin`

---

## Kredensial Uji Coba Default

- **Akun Warga**: Masukkan email aktif Anda pada menu **Masuk**, sistem akan mengirimkan 6 digit OTP langsung ke email Anda.
- **Akun Administrator**:
  - Email: `admin@simpel.go.id`
  - Password: `admin123`

---

## Lisensi & Hak Cipta
Hak Cipta &copy; 2026 **SIMPEL — Kelompok 5 Manajemen Proyek Perangkat Lunak (MPPL)**.  
Dikembangkan untuk keperluan akademik dan kemajuan tata kelola lingkungan kota berkelanjutan.
