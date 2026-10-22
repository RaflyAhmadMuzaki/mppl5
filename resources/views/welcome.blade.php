<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description"
    content="SIPELIK - Layanan Aspirasi dan Pengaduan Online Lingkungan Kota. Sampaikan laporan kerusakan lingkungan langsung kepada dinas berwenang.">
  <title>SIMPEL - Layanan Pengaduan Online Lingkungan Kota</title>

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
    rel="stylesheet">

  <!-- Leaflet CSS & JS for Geospatial Mapping -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Application Stylesheet -->
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <!-- Aksesibilitas: Skip Link -->
  <a href="#mainContent" class="skip-link">Langsung ke formulir laporan</a>

  <!-- Top Bar / Navbar Bergaya LAPOR! (Responsif Desktop & Mobile) -->
  <header class="lapor-navbar">
    <div class="nav-container">
      <div class="nav-brand-group">
        <button type="button" class="btn-citizen-toggle" id="btnCitizenDrawerOpen" aria-label="Buka Menu Navigasi Samping">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="nav-brand">
          <a href="#home" class="brand-link" id="brandHomeLink">
            <div class="brand-emblem" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-main">SIMPEL</span>
              <span class="brand-sub">Pengaduan Lingkungan Kota</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Menu Navigasi Desktop -->
      <nav class="nav-menu" id="mainNavMenu" aria-label="Menu Utama">
        <button type="button" class="nav-link active" data-tab="tabBeranda">BERANDA</button>
        <button type="button" class="nav-link" id="navLinkLaporanTerkini" data-tab="tabLaporanTerkini">LAPORAN TERKINI</button>
        <button type="button" class="nav-link" data-tab="tabPeta">PETA SEBARAN</button>
        <button type="button" class="nav-link" data-tab="tabStatistik">STATISTIK</button>
        <button type="button" class="nav-link" data-tab="tabTentang">TENTANG SIMPEL</button>
        <a href="/admin" class="nav-link hidden" id="navLinkAdmin" style="color:#c1121f;font-weight:800;">PORTAL PETUGAS &rarr;</a>
      </nav>

      <div class="nav-actions">
        <!-- Tombol Masuk & Daftar / Profil Pengguna Terotentikasi -->
        <div class="auth-buttons-group" id="guestAuthGroup">
          <button type="button" class="btn-auth-login" id="btnOpenLogin">Masuk</button>
          <button type="button" class="btn-auth-register" id="btnOpenRegister">Daftar</button>
        </div>

        <div class="auth-user-group hidden" id="userAuthGroup">
          <div class="user-profile-badge" id="userProfileBadge">
            <span class="user-avatar-initial" id="userAvatarInitial">W</span>
            <div class="user-info-text">
              <span class="user-name" id="userDisplayName">Nama Pengguna</span>
              <span class="user-role-tag" id="userDisplayRole">Warga</span>
            </div>
          </div>
          <button type="button" class="btn-auth-logout" id="btnLogout" title="Keluar dari akun">Keluar</button>
        </div>

      </div>
    </div>
  </header>

  <!-- ── BACKDROP & SIDEBAR NAVIGASI SAMPING MASYARAKAT (Sesuai Screenshot 3) ── -->
  <div class="citizen-drawer-backdrop" id="citizenDrawerBackdrop"></div>

  <aside class="citizen-side-drawer" id="citizenMobileDrawer" aria-label="Navigasi Samping SIMPEL">
    <div class="citizen-drawer-header">
      <div class="citizen-drawer-brand">
        <div class="brand-emblem" aria-hidden="true" style="width:34px;height:34px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-main" style="font-size:1.1rem;">SIMPEL</span>
          <span class="brand-sub" style="font-size:0.62rem;">Pengaduan Lingkungan</span>
        </div>
      </div>
      <button type="button" class="btn-close-drawer" id="btnCitizenDrawerClose" aria-label="Tutup Menu">&times;</button>
    </div>

    <!-- Navigasi Menu Vertikal dengan Icon & Red Pill Aktif Sesuai Screenshot 3 -->
    <nav class="citizen-side-nav">
      <span class="drawer-section-title">MENU UTAMA</span>

      <button type="button" class="citizen-side-btn active" data-tab="tabBeranda">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Beranda</span>
      </button>

      <button type="button" class="citizen-side-btn" id="drawerLinkLaporanTerkini" data-tab="tabLaporanTerkini">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>Laporan Masuk Terkini</span>
      </button>

      <button type="button" class="citizen-side-btn" data-tab="tabPeta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
        <span>Peta Sebaran</span>
      </button>


      <button type="button" class="citizen-side-btn" data-tab="tabStatistik">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <span>Statistik</span>
      </button>

      <button type="button" class="citizen-side-btn" data-tab="tabTentang">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Tentang SIMPEL</span>
      </button>

      <span class="drawer-section-title" id="drawerPetugasTitle">PORTAL RESMI</span>
      <a href="/admin" class="citizen-side-btn" id="drawerLinkAdmin" style="color:#c1121f; font-weight:700;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Portal Petugas Kota &rarr;</span>
      </a>
    </nav>

    <!-- Profil & Autentikasi Pengguna di Bawah Sidebar (Sudah Login / Belum Login) -->
    <div class="citizen-drawer-footer">
      <!-- Mode Belum Login (Guest) -->
      <div class="drawer-guest-auth" id="drawerGuestGroup">
        <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.6rem;">Akses akun warga untuk lapor dan lacak otomatis:</p>
        <button type="button" class="btn-drawer-login" id="btnDrawerLogin">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          Masuk ke Akun
        </button>
        <button type="button" class="btn-drawer-register" id="btnDrawerRegister">Daftar Akun Baru</button>
      </div>

      <!-- Mode Sudah Login -->
      <div class="drawer-user-auth hidden" id="drawerUserGroup">
        <div class="drawer-user-card">
          <div class="drawer-avatar-circle" id="drawerAvatarInitial">W</div>
          <div class="drawer-user-meta">
            <span class="drawer-user-name" id="drawerDisplayName">Nama Pengguna</span>
            <span class="drawer-user-role" id="drawerDisplayRole">Warga</span>
          </div>
        </div>
        <button type="button" class="btn-drawer-logout" id="btnDrawerLogout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar dari Akun
        </button>
      </div>
    </div>
  </aside>

  <!-- Konten Aplikasi Utama -->
  <main id="mainContent">

    <!-- ============================================================== -->
    <!-- TAB 1: BERANDA (HERO LAPOR! + FORMULIR LAPORAN + ALUR PROSES)  -->
    <!-- ============================================================== -->
    <div id="tabBeranda" class="tab-page active">

      <!-- Hero Merah Khas LAPOR! -->
      <section class="lapor-hero">
        <div class="hero-overlay-waves"></div>
        <div class="hero-content">
          <h1 class="hero-title">Layanan Aspirasi dan Pengaduan Online Lingkungan Kota</h1>
          <p class="hero-lead">Sampaikan laporan Anda langsung kepada instansi dinas lingkungan hidup dan dinas
            kebersihan kota yang berwenang.</p>
        </div>

        <!-- Kartu Formulir Floating Khas LAPOR! -->
        <div class="floating-form-container">
          <div class="floating-form-card">
            <h2 class="form-card-title">Sampaikan Laporan Anda</h2>

            <!-- Tab Klasifikasi Aduan (Pengaduan / Aspirasi / Permintaan Informasi) -->
            <div class="type-selector-tabs" role="tablist" aria-label="Klasifikasi Laporan">
              <button type="button" class="type-tab-btn active" data-type="PENGADUAN" role="tab" aria-selected="true">
                <span class="type-dot"></span> PENGADUAN
              </button>
              <button type="button" class="type-tab-btn" data-type="ASPIRASI" role="tab" aria-selected="false">
                <span class="type-dot"></span> ASPIRASI
              </button>
              <button type="button" class="type-tab-btn" data-type="PERMINTAAN INFORMASI" role="tab"
                aria-selected="false">
                <span class="type-dot"></span> PERMINTAAN INFORMASI
              </button>
            </div>

            <!-- Banner Panduan LAPOR! -->
            <div class="guide-banner">
              <span>Perhatikan Tata Cara Menyampaikan Pengaduan Yang Baik dan Benar.</span>
              <button type="button" class="guide-link-btn" id="btnOpenGuide">Lihat Panduan</button>
            </div>

            <!-- Formulir Input -->
            <form id="formLapor" class="lapor-form" novalidate>
              <div class="form-field">
                <label for="inputJudul" class="field-label">Judul Laporan <span class="req">*</span></label>
                <input type="text" id="inputJudul" class="field-input" placeholder="Ketik Judul Laporan Anda"
                  maxlength="120" required>
              </div>

              <div class="form-field">
                <label for="inputIsi" class="field-label">Isi Laporan <span class="req">*</span></label>
                <textarea id="inputIsi" class="field-textarea" rows="4"
                  placeholder="Ketik Isi Laporan Anda (detail masalah, dampak bau/limbah, atau lokasi spesifik)"
                  required></textarea>
              </div>

              <div class="form-field-row">
                <div class="form-field">
                  <label for="inputTanggal" class="field-label">Tanggal Kejadian <span class="req">*</span></label>
                  <input type="date" id="inputTanggal" class="field-input" required>
                </div>
                <div class="form-field">
                  <label for="selectKategori" class="field-label">Kategori Laporan <span class="req">*</span></label>
                  <select id="selectKategori" class="field-select" required>
                    <option value="" disabled selected>Pilih Kategori Laporan</option>
                    <option value="Sampah">Tumpukan Sampah Liar & Kebersihan</option>
                    <option value="Polusi Air">Pencemaran Air & Limbah Cair</option>
                    <option value="Polusi Udara">Polusi Udara & Pembakaran Liar</option>
                    <option value="Ruang Terbuka">Kerusakan Fasilitas Umum & RTH</option>
                    <option value="Drainase">Saluran Air & Drainase Tersumbat</option>
                    <option value="Lainnya">Pengaduan Lingkungan Lainnya</option>
                  </select>
                </div>
              </div>

              <div class="form-field-row">
                <div class="form-field">
                <label for="selectWilayah" class="field-label">Wilayah / Kecamatan Kejadian <span class="req">*</span></label>
                <input type="text" id="selectWilayah" class="field-input" list="daftarKecamatan"
                  placeholder="Ketik wilayah / kecamatan lokasi kejadian (bebas di mana saja)..." required>
                <datalist id="daftarKecamatan">
                  <option value="Bandung">
                  <option value="Sumedang">
                  <option value="Surabaya">
                  <option value="Jakarta">
                  <option value="Sukajadi">
                  <option value="Cibiru">
                  <option value="Wonokromo">
                  <option value="Gubeng">
                  <option value="Menteng">
                  <option value="Gambir">
                  <option value="Semarang">
                  <option value="Yogyakarta">
                  <option value="Malang">
                  <option value="Bogor">
                  <option value="Bekasi">
                  <option value="Tangerang">
                  <option value="Depok">
                </datalist>
              </div>
                <div class="form-field">
                  <label for="selectInstansi" class="field-label">Instansi Tujuan <span class="req">*</span></label>
                  <select id="selectInstansi" class="field-select" required>
                    <option value="Dinas Lingkungan Hidup Kota" selected>Dinas Lingkungan Hidup Kota</option>
                    <option value="Dinas Kebersihan & Ruang Terbuka Hijau">Dinas Kebersihan & RTH</option>
                    <option value="Dinas Sumber Daya Air & Bina Marga">Dinas SDA & Bina Marga</option>
                    <option value="Satuan Polisi Pamong Praja">Satuan Polisi Pamong Praja</option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <div class="label-with-action">
                  <label for="inputAlamat" class="field-label">Lokasi Kejadian Presisi <span
                      class="req">*</span></label>
                  <button type="button" class="action-btn-text" id="btnToggleMiniMap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                      <line x1="8" y1="2" x2="8" y2="18"></line>
                      <line x1="16" y1="6" x2="16" y2="22"></line>
                    </svg>
                    Tentukan Titik di Peta (GPS)
                  </button>
                </div>
                <input type="text" id="inputAlamat" class="field-input"
                  placeholder="Masukkan alamat jalan atau patokan lokasi presisi" required>

                <!-- Mini Leaflet Map Picker (Foldable) -->
                <div id="miniMapPickerBox" class="mini-map-box hidden">
                  <div class="mini-map-search-row">
                    <input type="text" id="miniMapSearchInput" placeholder="Ketik nama kota / lokasi (misal: Bandung, Sumedang, Sukajadi)..." class="field-input field-input-sm">
                    <button type="button" id="btnSearchMiniMap" class="btn-outline-red btn-sm">Cari</button>
                    <button type="button" id="btnGpsMiniMap" class="btn-outline-red btn-sm" title="Deteksi GPS Saya">GPS Saya</button>
                  </div>
                  <div id="formMiniMap" class="mini-leaflet-map" aria-label="Pilih koordinat pada peta"></div>
                  <div class="coords-info-bar">
                    <span>Koordinat: <strong id="miniMapCoordsText">-7.2575, 112.7521</strong></span>
                    <span class="mini-map-note" id="miniMapLocationHint">(Geser pin atau klik peta di kota Anda)</span>
                  </div>
                </div>
              </div>

              <!-- Upload Lampiran Foto -->
              <div class="form-field">
                <label class="field-label">Upload Lampiran Bukti Foto</label>
                <div class="attachment-area" id="boxAttachment">
                  <input type="file" id="fileAttachment" accept="image/*" class="hidden-file-input"
                    aria-label="Pilih foto lampiran">
                  <div class="attachment-prompt" id="promptAttachment">
                    <button type="button" class="btn-upload-fake" id="btnTriggerUpload">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Upload Lampiran
                    </button>
                    <span class="attachment-note">Gambar bukti lapangan (Maks. 5MB)</span>
                  </div>
                  <div class="attachment-preview hidden" id="previewAttachment">
                    <img id="imgPreview" src="" alt="Pratinjau lampiran aduan" class="img-thumb">
                    <button type="button" class="btn-delete-attach" id="btnDeleteAttach">Hapus</button>
                  </div>
                </div>
              </div>

              <!-- Identitas Pengirim & Opsi Anonim -->
              <div class="sender-identity-box" id="senderIdentityBox">
                <div class="sender-identity-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Identitas Pengirim: <strong id="senderAccountNameDisplay">Warga (Tamu)</strong></span>
                </div>
                <p class="sender-identity-note" id="senderIdentitySub">Nama akun Anda akan tertera secara transparan pada <strong>Laporan Masuk Terkini</strong> agar publik dan petugas dapat mengetahui pelapornya.</p>
              </div>

              <!-- Opsi Privasi LAPOR! (Anonim & Rahasia) -->
              <div class="privacy-options-row">
                <label class="checkbox-container">
                  <input type="checkbox" id="checkAnonim">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">Kirim sebagai <strong>Anonim</strong> (Nama akun disembunyikan dari publik di Laporan Masuk Terkini)</span>
                </label>
                <label class="checkbox-container">
                  <input type="checkbox" id="checkRahasia">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">Rahasia (Isi laporan hanya dibaca petugas berwenang)</span>
                </label>
              </div>

              <div id="formFeedbackError" class="alert-box error hidden" role="alert"></div>

              <!-- Tombol Utama LAPOR! -->
              <div class="form-submit-row">
                <button type="submit" class="btn-lapor-submit" id="btnSubmitLapor">
                  LAPOR!
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- 5 Langkah Alur Proses Pengaduan (Persis Desain Screenshot 1) -->
      <section class="process-flow-section">
        <div class="flow-container">
          <div class="flow-step-item">
            <div class="flow-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3 class="flow-step-title">Tulis Laporan</h3>
            <p class="flow-step-desc">Laporkan keluhan atau aspirasi Anda dengan jelas dan lengkap.</p>
          </div>

          <div class="flow-arrow" aria-hidden="true">&rarr;</div>

          <div class="flow-step-item">
            <div class="flow-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 class="flow-step-title">Proses Verifikasi</h3>
            <p class="flow-step-desc">Dalam 3 hari, laporan Anda akan diverifikasi dan diteruskan kepada instansi
              berwenang.</p>
          </div>

          <div class="flow-arrow" aria-hidden="true">&rarr;</div>

          <div class="flow-step-item">
            <div class="flow-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 class="flow-step-title">Proses Tindak Lanjut</h3>
            <p class="flow-step-desc">Dalam 5 hari kerja, instansi akan menindaklanjuti dan membalas laporan Anda.</p>
          </div>

          <div class="flow-arrow" aria-hidden="true">&rarr;</div>

          <div class="flow-step-item">
            <div class="flow-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 class="flow-step-title">Beri Tanggapan</h3>
            <p class="flow-step-desc">Anda dapat menanggapi kembali balasan yang diberikan oleh instansi dalam waktu 10
              hari.</p>
          </div>

          <div class="flow-arrow" aria-hidden="true">&rarr;</div>

          <div class="flow-step-item">
            <div class="flow-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 class="flow-step-title">Selesai</h3>
            <p class="flow-step-desc">Laporan Anda akan terus ditindaklanjuti hingga terselesaikan tuntas.</p>
          </div>
        </div>

        <div class="flow-action-center">
          <button type="button" class="btn-outline-red" id="btnLearnFlow">Pelajari Lebih Lanjut</button>
        </div>
      </section>

      <!-- Banner Jumlah Laporan Sekarang (Merah LAPOR! dengan Counter Dinamis) -->
      <section class="counter-red-banner">
        <h3 class="counter-heading">JUMLAH LAPORAN SEKARANG</h3>
        <div class="counter-huge-number" id="hugeCounter">2712304</div>
        <p class="counter-sub">Data laporan masyarakat terintegrasi secara langsung.</p>
      </section>

      <!-- Instansi Terhubung & Ringkasan Wilayah -->
      <section class="connected-instansi-section">
        <h3 class="instansi-heading">INSTANSI TERHUBUNG DI KOTA</h3>
        <div class="instansi-stats-row">
          <div class="instansi-stat-box">
            <span class="instansi-num">6</span>
            <span class="instansi-lbl">Kecamatan Kota</span>
          </div>
          <div class="instansi-stat-box">
            <span class="instansi-num">1</span>
            <span class="instansi-lbl">Dinas Lingkungan Hidup</span>
          </div>
          <div class="instansi-stat-box">
            <span class="instansi-num">12</span>
            <span class="instansi-lbl">Satgas Kebersihan</span>
          </div>
          <div class="instansi-stat-box">
            <span class="instansi-num">100%</span>
            <span class="instansi-lbl">Pemerintah Kota</span>
          </div>
        </div>
      </section>

      <!-- Umpan Aduan Publik Terkini -->
      <section class="public-feed-section" id="publicFeedSection">
        <div class="section-title-wrap">
          <h3 class="section-title">Laporan Masuk Terkini</h3>
          <p class="section-desc">Transparansi publik tindak lanjut laporan lingkungan masyarakat.</p>
        </div>

        <div id="homeRecentReports" class="feed-grid">
          <!-- Diisi secara dinamis -->
        </div>
      </section>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 2: LAPORAN MASUK TERKINI (DEDIKASI PENUH PUBLIK)           -->
    <!-- ============================================================== -->
    <div id="tabLaporanTerkini" class="tab-page hidden">
      <section class="page-container">
        <div class="page-header-strip">
          <div>
            <h2 class="page-main-title">Laporan Masuk Terkini</h2>
            <p class="page-main-desc">Seluruh laporan, aspirasi, dan aduan lingkungan masyarakat yang dihimpun secara real-time dan transparan.</p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <select id="filterFeedCategoryTab" class="field-select select-sm" aria-label="Saring kategori laporan">
              <option value="ALL">Semua Kategori</option>
              <option value="Sampah">Sampah</option>
              <option value="Polusi Air">Limbah Air</option>
              <option value="Polusi Udara">Polusi Udara</option>
              <option value="Ruang Terbuka">Ruang Terbuka</option>
              <option value="Drainase">Drainase</option>
            </select>
          </div>
        </div>

        <div id="feedRecentReportsTab" class="feed-grid">
          <!-- Diisi secara dinamis oleh JavaScript -->
        </div>
      </section>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 3: PETA SEBARAN (GEOSPATIAL LEAFLET SESUAI SLIDE 4 & 6 PDF) -->
    <!-- ============================================================== -->
    <div id="tabPeta" class="tab-page hidden">
      <section class="page-container">
        <div class="page-header-strip">
          <div>
            <h2 class="page-main-title">Peta Persebaran Aduan Lingkungan Kota</h2>
            <p class="page-main-desc">Pemantauan visual sebaran lokasi sampah, pencemaran air, dan kerusakan fasilitas
              umum berbasis Leaflet & OpenStreetMap.</p>
          </div>
          <div class="map-controls-row">
            <select id="filterMapStatus" class="field-select select-sm" aria-label="Saring status peta">
              <option value="ALL">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Diproses">Sedang Diproses</option>
              <option value="Selesai">Selesai Ditangani</option>
            </select>
            <select id="filterMapCategory" class="field-select select-sm" aria-label="Saring kategori peta">
              <option value="ALL">Semua Kategori</option>
              <option value="Sampah">Sampah</option>
              <option value="Polusi Air">Limbah Air</option>
              <option value="Polusi Udara">Polusi Udara</option>
              <option value="Ruang Terbuka">Ruang Terbuka</option>
              <option value="Drainase">Drainase</option>
            </select>
          </div>
        </div>

        <!-- Wadah Peta Full -->
        <div id="fullMapLeaflet" class="full-map-container" role="region" aria-label="Peta interaktif persebaran aduan">
        </div>

        <!-- Legenda Status Peta -->
        <div class="map-legend-bar">
          <div class="legend-chip"><span class="badge-dot dot-pending"></span> Menunggu Verifikasi</div>
          <div class="legend-chip"><span class="badge-dot dot-process"></span> Sedang Diproses</div>
          <div class="legend-chip"><span class="badge-dot dot-completed"></span> Selesai Ditangani</div>
          <div class="legend-chip"><span class="badge-dot dot-rejected"></span> Ditolak / Tidak Valid</div>
        </div>
      </section>
    </div>



    <!-- ============================================================== -->
    <!-- TAB 4: STATISTIK (GRAFIK PERSIS SCREENSHOT 3 LAPOR!)           -->
    <!-- ============================================================== -->
    <div id="tabStatistik" class="tab-page hidden">
      <section class="page-container">
        <div class="page-header-strip">
          <div>
            <h2 class="page-main-title">Statistik & Rekapitulasi Laporan Lingkungan</h2>
            <p class="page-main-desc">Data analitik keterbukaan informasi publik pelaporan lingkungan perkotaan secara
              real-time.</p>
          </div>
          <div class="stat-kpi-badges">
            <span class="kpi-badge">Total Aduan: <strong id="kpiStatTotal">4</strong></span>
            <span class="kpi-badge">Tuntas: <strong id="kpiStatTuntas">1</strong></span>
          </div>
        </div>

        <!-- Baris Diagram Klasifikasi (Mirip Pie/Donut Chart Screenshot 3) -->
        <div class="analytics-row-two">
          <div class="chart-card">
            <h3 class="chart-card-title">Klasifikasi Laporan Masuk</h3>
            <p class="chart-card-sub">Distribusi pengaduan, aspirasi, dan permohonan informasi</p>
            <div id="chartKlasifikasi" class="pie-donut-wrapper">
              <!-- Visual Chart SVG/CSS -->
            </div>
          </div>

          <div class="chart-card">
            <h3 class="chart-card-title">Status Penanganan Laporan</h3>
            <p class="chart-card-sub">Persentase laporan menunggu, diproses, dan tuntas</p>
            <div id="chartStatusPie" class="pie-donut-wrapper">
              <!-- Visual Chart SVG/CSS -->
            </div>
          </div>
        </div>

        <!-- Baris Diagram Horizontal Stacked (Persis Screenshot 3) -->
        <div class="chart-card full-width-chart">
          <h3 class="chart-card-title">Rekapitulasi Berdasarkan Kategori Permasalahan</h3>
          <p class="chart-card-sub">Volume aduan pada kategori sampah, pencemaran air, udara, fasilitas umum, dan
            drainase</p>
          <div id="chartCategoryBars" class="stacked-bar-container">
            <!-- Rendered by JS -->
          </div>
        </div>

        <div class="chart-card full-width-chart">
          <h3 class="chart-card-title">Sebaran Laporan per Wilayah / Kecamatan</h3>
          <p class="chart-card-sub">Distribusi beban kerja penanganan aduan di setiap kecamatan kota</p>
          <div id="chartDistrictBars" class="stacked-bar-container">
            <!-- Rendered by JS -->
          </div>
        </div>
      </section>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 5: TENTANG SIMPEL -->
    <!-- ============================================================== -->
    <div id="tabTentang" class="tab-page hidden">
      <section class="page-container narrow-container">
        <div class="tentang-hero-card">
          <div class="tentang-header-badge">
            <span class="gov-text-badge">PORTAL RESMI PELAPORAN LINGKUNGAN HIDUP KOTA</span>
          </div>
          <h2 class="tentang-title">Tentang SIMPEL</h2>
          <p class="tentang-lead">
            <strong>SIMPEL (Sistem Informasi Pelaporan Lingkungan Kota)</strong> adalah platform layanan publik digital
            terpadu yang dirancang untuk menjembatani partisipasi aktif masyarakat dengan instansi kedinasan pemerintah kota
            dalam menjaga, memulihkan, dan mengawasi kelestarian lingkungan hidup perkotaan.
          </p>

          <div class="tentang-divider"></div>

          <!-- Bagian 1: Latar Belakang & Visi Misi -->
          <h3 class="tentang-subtitle">Latar Belakang & Urgensi Sistem</h3>
          <p class="tentang-body-text">
            Pertumbuhan kota yang pesat menghadirkan berbagai tantangan lingkungan hidup yang mendesak, mulai dari penumpukan sampah liar,
            pencemaran limbah cair industri ke aliran sungai, polusi udara akibat pembakaran terbuka, hingga berkurangnya ruang terbuka hijau (RTH).
            Sistem pengaduan konvensional seringkali lambat, sulit dilacak, dan memakan birokrasi panjang.
            <strong>SIMPEL hadir sebagai solusi digital satu pintu (one-stop digital channel)</strong> yang transparan, akuntabel, dan dapat diakses oleh seluruh warga kota kapan saja dan di mana saja.
          </p>

          <div class="tentang-vision-mission-grid">
            <div class="vm-card">
              <h4>Visi SIMPEL</h4>
              <p>Mewujudkan tata kelola lingkungan perkotaan yang bersih, sehat, berkelanjutan, dan tanggap krisis berbasis partisipasi inklusif seluruh lapisan masyarakat.</p>
            </div>
            <div class="vm-card">
              <h4>Misi SIMPEL</h4>
              <p>Menyediakan sarana aduan yang cepat dan akurat, mempercepat respon tim lapangan lintas instansi, serta menyajikan data analitik lingkungan yang transparan untuk kebijakan publik.</p>
            </div>
          </div>

          <!-- Bagian 2: 5 Pilar Keunggulan SIMPEL -->
          <h3 class="tentang-subtitle">5 Pilar Layanan Unggulan SIMPEL</h3>
          <div class="features-pill-grid">
            <div class="feat-card">
              <h4>01. Login Aman Passwordless (OTP Email)</h4>
              <p>Warga tidak perlu mengingat kata sandi rumit. Cukup masukkan email aktif, kode OTP 6 digit dikirimkan langsung untuk otentikasi instan dan pembuatan akun otomatis.</p>
            </div>
            <div class="feat-card">
              <h4>02. Geotagging & Pemetaan Spasial Presisi</h4>
              <p>Didukung peta interaktif Leaflet GIS. Pelapor dapat menyematkan koordinat lokasi kejadian secara akurat sehingga regu penanganan di lapangan dapat langsung menuju titik insiden.</p>
            </div>
            <div class="feat-card">
              <h4>03. Transparansi & Pelacakan Tiket Terbuka</h4>
              <p>Setiap aduan diberikan nomor registrasi unik (format LAP-XXXX-XXXX). Warga dapat memantau perkembangan penanganan, membaca catatan tindak lanjut petugas, dan memvalidasi hasil kerja dinas.</p>
            </div>
            <div class="feat-card">
              <h4>04. Perlindungan Privasi (Anonim & Rahasia)</h4>
              <p>Warga memiliki kebebasan untuk menyamarkan identitas pelapor (opsi Anonim) atau membatasi publikasi isi laporan (opsi Rahasia) demi keselamatan pelapor saat mengadukan pelanggaran serius.</p>
            </div>
            <div class="feat-card">
              <h4>05. Manajemen Meja Kerja & Retensi Otomatis</h4>
              <p>Meja kerja petugas dilengkapi validasi bukti foto, pembaruan status pengerjaan, ekspor rekapitulasi resmi format PDF, serta pembersihan otomatis aduan yang telah tuntas dalam 24 jam.</p>
            </div>
          </div>

          <!-- Bagian 3: Ruang Lingkup Masalah Lingkungan -->
          <h3 class="tentang-subtitle">Kategori Masalah Lingkungan yang Ditangani</h3>
          <div class="scope-grid">
            <div class="scope-item">
              <span class="scope-badge">Sampah & Kebersihan</span>
              <h5>Tumpukan Sampah Liar & TPS Ilegal</h5>
              <p>Aduan penumpukan limbah padat di bahu jalan, lahan kosong, bantaran rel, atau area pemukiman yang tidak terangkut.</p>
            </div>
            <div class="scope-item">
              <span class="scope-badge">Kualitas Air</span>
              <h5>Pencemaran Sungai & Saluran Air</h5>
              <p>Pembuangan limbah cair keruh atau berbau, endapan zat berbahaya, serta penyumbatan drainase utama perkotaan.</p>
            </div>
            <div class="scope-item">
              <span class="scope-badge">Kualitas Udara</span>
              <h5>Polusi Udara & Pembakaran Terbuka</h5>
              <p>Aktivitas pembakaran sampah ilegal, asap pekat bengkel/industri tanpa cerobong filtrasi, dan bau menyengat berkepanjangan.</p>
            </div>
            <div class="scope-item">
              <span class="scope-badge">Tata Ruang & Hijau</span>
              <h5>Kerusakan Taman & Pohon Rawan Tumbang</h5>
              <p>Fasilitas bangku/alat bermain taman publik yang rusak, penebangan pohon liar, atau dahan lapuk yang membahayakan pengguna jalan.</p>
            </div>
          </div>

          <!-- Bagian 4: Alur Kerja & Standar Waktu Penanganan (SLA) -->
          <h3 class="tentang-subtitle">Alur Penanganan Laporan Warga</h3>
          <div class="workflow-steps-horizontal">
            <div class="wf-step">
              <div class="wf-circle">1</div>
              <h4>Warga Mengirim Aduan</h4>
              <p>Mengisi form aduan, menyertakan bukti foto, memilih kecamatan, dan menyematkan pin peta digital.</p>
            </div>
            <div class="wf-step">
              <div class="wf-circle">2</div>
              <h4>Verifikasi Petugas</h4>
              <p>Petugas memvalidasi keaslian laporan dan kelayakan bukti dalam waktu maksimal 1x24 jam.</p>
            </div>
            <div class="wf-step">
              <div class="wf-circle">3</div>
              <h4>Aksi Regu Lapangan</h4>
              <p>Dinas Lingkungan Hidup atau Satpol PP menerjunkan tim teknis untuk menindaklanjuti lokasi.</p>
            </div>
            <div class="wf-step">
              <div class="wf-circle">4</div>
              <h4>Selesai & Retensi Data</h4>
              <p>Laporan dinyatakan selesai dengan catatan resmi petugas. Data laporan selesai otomatis diarsipkan setelah 24 jam.</p>
            </div>
          </div>

          <!-- Bagian 5: Komitmen Pemerintah Kota -->
          <div class="tentang-cta-box">
            <h4>Bersama Menjaga Lingkungan Kota Kita</h4>
            <p>
              Setiap laporan yang Anda sampaikan merupakan langkah nyata dalam menjaga kualitas hidup dan masa depan kota yang berkelanjutan.
              Gunakan layanan SIMPEL secara bijak, bertanggung jawab, dan sertakan informasi yang objektif demi kelancaran proses validasi petugas.
            </p>
          </div>

        </div>
      </section>
    </div>

    </main>

  <!-- MODAL SUKSES PENGIRIMAN LAPORAN -->
  <div id="modalSuccessReport" class="lapor-modal-backdrop hidden" role="dialog" aria-modal="true"
    aria-labelledby="modalSuccessTitle">
    <div class="lapor-modal-dialog modal-dialog-sm">
      <div class="modal-top">
        <h3 id="modalSuccessTitle" class="modal-title-text">Laporan Berhasil Terkirim</h3>
        <button type="button" class="modal-close-icon" id="btnCloseSuccessModal"
          onclick="window.closeSuccessModal()" aria-label="Tutup dialog">&times;</button>
      </div>
      <div class="modal-content-area text-center">
        <div class="success-check-badge" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <p class="success-lead">Laporan Anda telah berhasil masuk ke sistem SIMPEL dengan nomor registrasi:</p>
        <div class="ticket-big-box" id="successTicketCode">LAP-2026-0000</div>
        <p class="success-caption" id="successSenderCaption">Laporan Anda kini tampil pada <strong>Laporan Masuk Terkini</strong> dan segera diverifikasi petugas dinas.</p>
        <div class="success-modal-buttons">
          <button type="button" class="btn-lapor-submit full-width" id="btnViewRecentReports" onclick="window.goToPublicFeed()">Lihat di Laporan Masuk Terkini &rarr;</button>
          <button type="button" class="btn-outline-red full-width" id="btnDoneSubmitModal" onclick="window.closeSuccessModal()">Tutup</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL DETAIL LAPORAN MASUK TERKINI & PETA -->
  <div id="modalReportDetail" class="lapor-modal-backdrop hidden" role="dialog" aria-modal="true"
    aria-labelledby="modalDetailTitle" onclick="if(event.target===this)window.closeReportDetailModal()">
    <div class="lapor-modal-dialog modal-dialog-md">
      <div class="modal-top">
        <h3 id="modalDetailTitle" class="modal-title-text">Detail Laporan Lingkungan</h3>
        <button type="button" class="modal-close-icon" id="btnCloseReportDetail" onclick="window.closeReportDetailModal()" aria-label="Tutup dialog">&times;</button>
      </div>
      <div class="modal-content-area" id="modalReportDetailBody">
        <!-- Konten detail diisi dinamis oleh JavaScript -->
      </div>
    </div>
  </div>

  <!-- MODAL LOGIN — CARD FLIP (Masyarakat OTP / Admin Password) -->
  <div id="modalLogin" class="lapor-modal-backdrop hidden" role="dialog" aria-modal="true"
    aria-labelledby="modalLoginTitle">
    <div class="login-flip-scene">

      <!-- ══ KARTU FLIP ══ -->
      <div class="login-flip-card" id="loginFlipCard">

        <!-- ════════════════════════════════════════
             SISI DEPAN — Login Masyarakat (OTP)
             ════════════════════════════════════════ -->
        <div class="login-flip-face login-flip-front">
          <!-- Header kartu -->
          <div class="flip-card-header">
            <div class="flip-card-icon flip-icon-citizen" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h3 id="modalLoginTitle" class="flip-card-title">Masuk / Daftar Akun</h3>
              <p class="flip-card-subtitle">Masuk atau daftar otomatis via kode OTP email (tanpa kata sandi)</p>
            </div>
            <button type="button" class="modal-close-icon flip-close-btn" id="btnCloseLogin"
              aria-label="Tutup dialog">&times;</button>
          </div>

          <!-- LANGKAH 1: Input Email -->
          <div id="otpStep1" class="otp-step">
            <form id="formSendOtp" class="lapor-form" novalidate>
              <div class="form-field">
                <label for="otpEmail" class="field-label">Alamat Email <span class="req">*</span></label>
                <input type="email" id="otpEmail" class="field-input"
                  placeholder="contoh: warga@gmail.com" autocomplete="email" required>
              </div>
              <div id="sendOtpMsg" class="alert-box hidden" role="alert"></div>
              <div class="form-submit-row">
                <button type="submit" class="btn-lapor-submit full-width" id="btnSendOtp">
                  <span id="btnSendOtpText">Kirim Kode OTP ke Email</span>
                  <span id="btnSendOtpSpinner" class="btn-spinner hidden" aria-hidden="true"></span>
                </button>
              </div>
              <p class="auth-helper-note" style="margin-top:12px;font-size:12px;color:#64748b;text-align:center;">
                Akun baru otomatis terdaftar setelah verifikasi kode OTP berhasil.
              </p>
            </form>
          </div>

          <!-- LANGKAH 2: Input Kode OTP -->
          <div id="otpStep2" class="otp-step hidden">
            <form id="formVerifyOtp" class="lapor-form" novalidate>
              <div class="otp-sent-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Kode OTP dikirim ke <strong id="otpEmailDisplay"></strong></span>
              </div>
              <div class="form-field">
                <label for="otpCodeInput" class="field-label">Kode OTP 6 Digit <span class="req">*</span></label>
                <input type="text" id="otpCodeInput" class="field-input otp-code-input"
                  placeholder="_ _ _ _ _ _" maxlength="6" inputmode="numeric"
                  pattern="[0-9]{6}" autocomplete="one-time-code" required>
              </div>
              <div id="verifyOtpMsg" class="alert-box hidden" role="alert"></div>
              <div class="form-submit-row">
                <button type="submit" class="btn-lapor-submit full-width" id="btnVerifyOtp">
                  <span id="btnVerifyOtpText">Verifikasi &amp; Masuk</span>
                  <span id="btnVerifyOtpSpinner" class="btn-spinner hidden" aria-hidden="true"></span>
                </button>
              </div>
              <p class="auth-switch-text" style="margin-top:10px;">
                Belum dapat kode?
                <button type="button" class="auth-switch-btn" id="btnResendOtp">Kirim Ulang OTP</button>
              </p>
            </form>
          </div>

          <!-- Tombol flip ke Admin -->
          <div class="flip-toggle-row">
            <button type="button" class="btn-flip-toggle" id="btnFlipToAdmin">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Login sebagai Admin / Petugas
            </button>
          </div>
        </div>

        <!-- ════════════════════════════════════════
             SISI BELAKANG — Login Admin (Password)
             ════════════════════════════════════════ -->
        <div class="login-flip-face login-flip-back">
          <!-- Header kartu -->
          <div class="flip-card-header">
            <div class="flip-card-icon flip-icon-admin" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h3 class="flip-card-title">Login Admin / Petugas</h3>
              <p class="flip-card-subtitle">Akses khusus petugas dengan kredensial resmi</p>
            </div>
            <button type="button" class="modal-close-icon flip-close-btn" id="btnCloseLoginBack"
              aria-label="Tutup dialog">&times;</button>
          </div>

          <form id="formAdminLogin" class="lapor-form" novalidate>
            <div class="form-field">
              <label for="adminLoginEmail" class="field-label">Email Admin <span class="req">*</span></label>
              <input type="email" id="adminLoginEmail" class="field-input"
                placeholder="contoh: admin@simpel.go.id" autocomplete="username" required>
            </div>
            <div class="form-field">
              <label for="adminLoginPassword" class="field-label">Kata Sandi <span class="req">*</span></label>
              <input type="password" id="adminLoginPassword" class="field-input"
                placeholder="Masukkan kata sandi" autocomplete="current-password" required>
            </div>
            <div id="adminLoginMsg" class="alert-box hidden" role="alert"></div>
            <div class="form-submit-row">
              <button type="submit" class="btn-admin-submit full-width" id="btnSubmitAdminLogin">
                <span id="btnAdminLoginText">Masuk sebagai Admin</span>
                <span id="btnAdminLoginSpinner" class="btn-spinner hidden" aria-hidden="true"></span>
              </button>
            </div>
          </form>

          <!-- Tombol flip kembali ke Masyarakat -->
          <div class="flip-toggle-row">
            <button type="button" class="btn-flip-toggle btn-flip-back" id="btnFlipToMasyarakat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Login sebagai Masyarakat
            </button>
          </div>
        </div>

      </div><!-- /.login-flip-card -->
    </div><!-- /.login-flip-scene -->
  </div><!-- /#modalLogin -->

  <!-- MODAL PANDUAN PENGADUAN LAPOR! -->
  <div id="modalPanduan" class="lapor-modal-backdrop hidden" role="dialog" aria-modal="true"
    aria-labelledby="modalPanduanTitle">
    <div class="lapor-modal-dialog modal-dialog-md">
      <div class="modal-top">
        <h3 id="modalPanduanTitle" class="modal-title-text">Panduan Menyampaikan Pengaduan yang Baik</h3>
        <button type="button" class="modal-close-icon" id="btnClosePanduan" aria-label="Tutup panduan">&times;</button>
      </div>
      <div class="modal-content-area guide-content">
        <h4>Tata Cara Penyampaian Aduan Lingkungan:</h4>
        <ol>
          <li><strong>Uraikan Fakta Kejadian:</strong> Jelaskan apa yang terjadi (misal: tumpukan sampah liar, limbah
            cair industri, atau pohon tumbang).</li>
          <li><strong>Sertakan Alamat & Titik Presisi:</strong> Cantumkan nama jalan, patokan terdekat, serta gunakan
            fitur peta Leaflet untuk menyematkan koordinat lokasi.</li>
          <li><strong>Lampirkan Bukti Foto:</strong> Sertakan foto jelas yang memperlihatkan kondisi terkini di
            lapangan.</li>
          <li><strong>Gunakan Bahasa yang Sopan dan Jelas:</strong> Hindari ujaran kebencian atau informasi palsu demi
            kelancaran proses validasi petugas.</li>
          <li><strong>Simpan Kode Tiket:</strong> Anda dapat memeriksa tindak lanjut petugas di tab Lacak Tiket kapan
            saja.</li>
        </ol>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="laporToastContainer" class="toast-stack" aria-live="polite"></div>

  <!-- Footer Khas LAPOR! (Screenshot 1 & 2) -->
  <footer class="lapor-footer">
    <div class="footer-container">
      <div class="footer-brand-row">
        <div class="footer-logos">
          <span class="gov-text-badge">DINAS LINGKUNGAN HIDUP KOTA</span>
          <span class="gov-text-badge">SATGAS KEBERSIHAN & RTH</span>
          <span class="gov-text-badge">MPPL AGIL-SCRUM</span>
        </div>
      </div>
      <nav class="footer-links-row" aria-label="Tautan Bawah">
        <button type="button" class="footer-link-btn" onclick="window.switchTab('tabBeranda')">BERANDA</button>
        <button type="button" class="footer-link-btn" onclick="window.goToPublicFeed()">LAPORAN TERKINI</button>
        <button type="button" class="footer-link-btn" onclick="window.switchTab('tabPeta')">PETA SEBARAN</button>
        <button type="button" class="footer-link-btn" onclick="window.switchTab('tabTentang')">TENTANG KAMI</button>
        <button type="button" class="footer-link-btn" onclick="window.switchTab('tabStatistik')">STATISTIK</button>
        <button type="button" class="footer-link-btn" onclick="window.openPanduanModal()">PANDUAN LAPORAN</button>
      </nav>
      <div class="footer-copy">
        <p>Hak Cipta &copy; 2026 Sistem Informasi Pelaporan Lingkungan Kota (SIMPEL) - Manajemen Proyek Perangkat
          Lunak
          (MPPL).</p>
      </div>
    </div>
  </footer>

  <!-- Leaflet Library -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- jsPDF & AutoTable for PDF Export -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

  <!-- EmailJS SDK -->
  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

  <!-- Main Script -->
  <script src="app.js"></script>
</body>

</html>