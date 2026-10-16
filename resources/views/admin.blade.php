<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Petugas — SIMPEL (Sistem Informasi Pelaporan Lingkungan Kota)</title>

  <!-- Google Fonts: Inter & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
    rel="stylesheet">

  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">

  <!-- Main Style -->
  <link rel="stylesheet" href="styles.css">

  <style>
    /* Styling Khusus Header & Layout Portal Petugas */
    .admin-portal-header {
      background: #0f172a;
      border-bottom: 2px solid #1e293b;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .admin-portal-header .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1320px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      gap: 1.5rem;
    }

    .admin-brand-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
    }

    .admin-brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #c1121f 0%, #7f0d16 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 4px 12px rgba(193, 18, 31, 0.4);
    }

    .admin-brand-text {
      display: flex;
      flex-direction: column;
    }

    .admin-brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.25rem;
      font-weight: 900;
      color: #f8fafc;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .admin-brand-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: #38bdf8;
      text-transform: uppercase;
    }

    .admin-nav-tabs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .admin-nav-tab {
      background: transparent;
      border: 1px solid transparent;
      color: #94a3b8;
      padding: 0.5rem 1rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .admin-nav-tab:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.06);
    }

    .admin-nav-tab.active {
      background: #c1121f;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(193, 18, 31, 0.35);
    }

    .admin-user-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .admin-profile-pill {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: #1e293b;
      padding: 0.4rem 0.85rem 0.4rem 0.4rem;
      border-radius: 9999px;
      border: 1px solid #334155;
    }

    .admin-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #c1121f;
      color: #fff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .admin-meta {
      display: flex;
      flex-direction: column;
    }

    .admin-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.2;
    }

    .admin-role {
      font-size: 0.68rem;
      color: #38bdf8;
      font-weight: 700;
    }

    .btn-public-link {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }

    .btn-public-link:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .btn-admin-logout {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }

    .btn-admin-logout:hover {
      background: #ef4444;
      color: #fff;
    }

    /* Container halaman admin */
    .admin-page-body {
      background: #f8fafc;
      min-height: calc(100vh - 75px);
      padding: 2rem 0;
    }

    .admin-tab-content {
      display: none;
    }

    .admin-tab-content.active {
      display: block;
    }

    /* Map container khusus admin */
    .admin-full-map {
      height: 600px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
  </style>
</head>

<body>

  <!-- ============================================================== -->
  <!-- HEADER KHUSUS PORTAL PETUGAS (TERISOLASI DARI WARGA)          -->
  <!-- ============================================================== -->
  <header class="admin-portal-header">
    <div class="header-container">

      <!-- Logo & Identitas Portal Petugas -->
      <a href="/admin" class="admin-brand-group">
        <div class="admin-brand-logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="admin-brand-text">
          <span class="admin-brand-title">SIMPEL</span>
          <span class="admin-brand-badge">Pusat Kendali Petugas Kota</span>
        </div>
      </a>

      <!-- Menu Khusus Petugas (TIDAK ADA Menu Warga: Beranda/Tentang) -->
      <nav class="admin-nav-tabs" aria-label="Navigasi Petugas">
        <button type="button" class="admin-nav-tab active" data-tab="tabAdminMeja">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          Meja Kerja Aduan
        </button>
        <button type="button" class="admin-nav-tab" data-tab="tabAdminPeta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
          Peta Pantau Wilayah
        </button>
        <button type="button" class="admin-nav-tab" data-tab="tabAdminStatistik">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          Statistik Kinerja
        </button>
      </nav>

      <!-- Profil Petugas & Aksi Logout -->
      <div class="admin-user-controls">
        <div class="admin-profile-pill">
          <div class="admin-avatar">A</div>
          <div class="admin-meta">
            <span class="admin-name" id="adminDisplayName">Administrator SIMPEL</span>
            <span class="admin-role">Petugas Dinas Lingkungan</span>
          </div>
        </div>

        <a href="/" class="btn-public-link" title="Buka website warga publik" target="_blank">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Lihat Web Warga
        </a>

        <button type="button" class="btn-admin-logout" id="btnAdminLogout" title="Keluar dari portal petugas">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar
        </button>
      </div>

    </div>
  </header>

  <!-- ============================================================== -->
  <!-- KONTEN UTAMA PORTAL PETUGAS                                    -->
  <!-- ============================================================== -->
  <main class="admin-page-body">

    <!-- ── TAB 1: MEJA KERJA ADUAN & VALIDASI ───────────────────────── -->
    <div id="tabAdminMeja" class="admin-tab-content active">
      <div class="page-container">

        <!-- Top Header Card Meja Kerja -->
        <div class="admin-top-card">
          <div>
            <span class="admin-badge">PORTAL RESMI PETUGAS KOTA</span>
            <h2 class="admin-title">Meja Kerja Validasi &amp; Tindak Lanjut Aduan</h2>
            <p class="admin-sub">
              Periksa keabsahan bukti foto dan lokasi laporan warga, perbarui status pengerjaan, dan berikan catatan resmi petugas.
            </p>
            <p class="auto-purge-hint" style="font-size:12px;color:#059669;margin-top:5px;font-weight:600;display:flex;align-items:center;gap:6px;">
              <span>⏱️ Sistem Retensi Otomatis:</span> Laporan yang berstatus <strong>Selesai</strong> akan otomatis dihapus dalam waktu 24 jam.
            </p>
          </div>

          <div class="admin-quick-actions">
            <button type="button" class="btn-outline-red btn-sm" id="btnExportAdminPDF">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:text-bottom;">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Unduh Rekap PDF
            </button>
            <button type="button" class="btn-lapor-submit btn-sm" id="btnRefreshAdmin">Segarkan Data</button>
          </div>
        </div>

        <!-- Metric KPI Cards Khusus Petugas -->
        <div class="petugas-kpi-grid">
          <div class="petugas-kpi-card kpi-total">
            <div class="petugas-kpi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div class="petugas-kpi-data">
              <span class="petugas-kpi-value" id="petugasKpiTotal">0</span>
              <span class="petugas-kpi-label">Total Aduan Masuk</span>
            </div>
          </div>

          <div class="petugas-kpi-card kpi-pending">
            <div class="petugas-kpi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="petugas-kpi-data">
              <span class="petugas-kpi-value" id="petugasKpiPending">0</span>
              <span class="petugas-kpi-label">Menunggu Verifikasi</span>
            </div>
          </div>

          <div class="petugas-kpi-card kpi-process">
            <div class="petugas-kpi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
            </div>
            <div class="petugas-kpi-data">
              <span class="petugas-kpi-value" id="petugasKpiProcess">0</span>
              <span class="petugas-kpi-label">Sedang Diproses</span>
            </div>
          </div>

          <div class="petugas-kpi-card kpi-done">
            <div class="petugas-kpi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="petugas-kpi-data">
              <span class="petugas-kpi-value" id="petugasKpiDone">0</span>
              <span class="petugas-kpi-label">Selesai Ditangani</span>
            </div>
          </div>
        </div>

        <!-- Tabel Data Aduan -->
        <div class="admin-table-wrapper">
          <div class="table-header-controls">
            <div class="tab-filter-pills">
              <button type="button" class="tab-pill active" data-status="ALL">Semua Aduan</button>
              <button type="button" class="tab-pill" data-status="Menunggu Verifikasi">Perlu Verifikasi</button>
              <button type="button" class="tab-pill" data-status="Diproses">Sedang Diproses</button>
              <button type="button" class="tab-pill" data-status="Selesai">Selesai</button>
            </div>
            <input type="search" id="adminSearchInput" class="field-input input-sm"
              placeholder="Cari No. Tiket, Judul, atau Wilayah..." aria-label="Cari aduan pada meja petugas">
          </div>

          <div class="table-responsive">
            <table class="lapor-data-table">
              <thead>
                <tr>
                  <th>No. Tiket</th>
                  <th>Waktu</th>
                  <th>Kategori &amp; Lokasi</th>
                  <th>Judul Aduan</th>
                  <th>Lampiran</th>
                  <th>Status</th>
                  <th>Aksi Petugas</th>
                </tr>
              </thead>
              <tbody id="adminReportsTableBody">
                <!-- Diisi secara dinamis -->
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ── TAB 2: PETA PANTAU WILAYAH (GIS MONITORING PETUGAS) ──────── -->
    <div id="tabAdminPeta" class="admin-tab-content">
      <div class="page-container">
        <div class="admin-top-card" style="margin-bottom:1rem;">
          <div>
            <span class="admin-badge">GIS MONITORING</span>
            <h2 class="admin-title">Peta Sebaran Insiden Lingkungan Kota</h2>
            <p class="admin-sub">Pantau sebaran titik insiden aktif di seluruh kecamatan kota untuk koordinasi penugasan regu lapangan.</p>
          </div>
        </div>
        <div id="adminLeafletMap" class="admin-full-map"></div>
      </div>
    </div>

    <!-- ── TAB 3: STATISTIK & ANALITIK KINERJA ──────────────────────── -->
    <div id="tabAdminStatistik" class="admin-tab-content">
      <div class="page-container">
        <div class="admin-top-card" style="margin-bottom:1.5rem;">
          <div>
            <span class="admin-badge">DASHBOARD ANALITIK</span>
            <h2 class="admin-title">Statistik Penanganan &amp; Distribusi Isu Kota</h2>
            <p class="admin-sub">Laporan analitik agregat untuk evaluasi kinerja dinas dan pembuatan kebijakan lingkungan.</p>
          </div>
        </div>

        <div class="stats-charts-grid">
          <!-- Donut Klasifikasi -->
          <div class="chart-card">
            <h3 class="chart-card-title">Proporsi Klasifikasi Aduan</h3>
            <p class="chart-card-sub">Perbandingan laporan pengaduan, aspirasi, dan informasi</p>
            <div id="chartKlasifikasi" class="chart-container-flex"></div>
          </div>

          <!-- Status Penyelesaian -->
          <div class="chart-card">
            <h3 class="chart-card-title">Tingkat Penyelesaian Masalah</h3>
            <p class="chart-card-sub">Rasio aduan yang telah tuntas vs sedang diproses</p>
            <div id="chartStatusPie" class="chart-container-flex"></div>
          </div>

          <!-- Baris Bar Kategori -->
          <div class="chart-card">
            <h3 class="chart-card-title">Kategori Permasalahan Lingkungan</h3>
            <p class="chart-card-sub">Jumlah aduan terbanyak berdasarkan jenis isu lingkungan</p>
            <div id="chartCategoryBars" class="stacked-bar-list"></div>
          </div>

          <!-- Baris Bar Wilayah -->
          <div class="chart-card">
            <h3 class="chart-card-title">Sebaran per Wilayah / Kecamatan</h3>
            <p class="chart-card-sub">Beban laporan lingkungan di berbagai wilayah kota</p>
            <div id="chartDistrictBars" class="stacked-bar-list"></div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!-- MODAL TINDAK LANJUT PETUGAS -->
  <div id="modalActionPetugas" class="lapor-modal-backdrop hidden" role="dialog" aria-modal="true"
    aria-labelledby="modalActionTitle">
    <div class="lapor-modal-dialog">
      <div class="modal-top">
        <h3 id="modalActionTitle" class="modal-title-text">Tindak Lanjut Laporan Petugas</h3>
        <button type="button" class="modal-close-icon" id="btnCloseModalAction"
          aria-label="Tutup dialog">&times;</button>
      </div>
      <div class="modal-content-area" id="modalActionBody">
        <!-- Konten diisi dinamis -->
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="laporToastContainer" class="toast-stack" aria-live="polite"></div>

  <!-- Leaflet Library -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <!-- jsPDF & AutoTable for PDF Export -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

  <!-- Dedicated Admin Script -->
  <script src="admin.js"></script>
</body>

</html>
