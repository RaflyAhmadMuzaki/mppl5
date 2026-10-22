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
    /* ==============================================================
       TATA LETAK SIDEBAR PORTAL PETUGAS (DESKTOP & MOBILE RESPONSIVE)
       ============================================================== */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      overflow-x: hidden;
    }

    .admin-app-layout {
      display: flex;
      min-height: 100vh;
      position: relative;
    }

    /* ── MOBILE TOPBAR (Hanya muncul di layar hp/tablet < 992px) ── */
    .admin-mobile-topbar {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      z-index: 990;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .btn-mobile-toggle {
      background: transparent;
      border: 1px solid #334155;
      color: #f8fafc;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .mobile-brand-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .mobile-brand-icon {
      width: 32px;
      height: 32px;
      background: #c1121f;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .mobile-brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.1rem;
      font-weight: 900;
      color: #fff;
      line-height: 1.1;
    }

    .mobile-brand-sub {
      font-size: 0.62rem;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── SIDEBAR DI SAMPING (Desktop: Fixed Kiri, Mobile: Offcanvas Drawer) ── */
    .admin-sidebar {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
    }

    .admin-sidebar-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(2px);
      z-index: 995;
    }

    .admin-sidebar-header {
      padding: 1.25rem 1.25rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .admin-brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }

    .admin-brand-logo {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #c1121f 0%, #7f0d16 100%);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 4px 10px rgba(193, 18, 31, 0.3);
    }

    .admin-brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.18rem;
      font-weight: 900;
      color: #c1121f;
      line-height: 1.1;
      letter-spacing: -0.3px;
    }

    .admin-brand-badge {
      display: block;
      font-size: 0.63rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #64748b;
      text-transform: uppercase;
    }

    .btn-close-sidebar {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #64748b;
      cursor: pointer;
      line-height: 1;
      padding: 0.25rem;
    }

    /* Navigasi Vertikal Sidebar (Sesuai Screenshot 3) */
    .admin-sidebar-nav {
      padding: 1.25rem 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
      overflow-y: auto;
    }

    .sidebar-category-title {
      font-size: 0.68rem;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 0.5rem 0.65rem 0.25rem;
      margin-top: 0.5rem;
    }

    .admin-side-btn {
      width: 100%;
      background: transparent;
      border: none;
      padding: 0.65rem 0.85rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      transition: all 0.15s ease;
      text-align: left;
    }

    .admin-side-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    /* Active Pill Merah Khas Screenshot 3 */
    .admin-side-btn.active {
      background: #c1121f;
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(193, 18, 31, 0.3);
    }

    .admin-side-btn.active svg {
      stroke: #ffffff;
    }

    .admin-side-btn svg {
      flex-shrink: 0;
      stroke: #64748b;
      transition: stroke 0.15s ease;
    }

    .admin-side-btn:hover svg {
      stroke: #0f172a;
    }

    .admin-side-badge {
      margin-left: auto;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      border-radius: 9999px;
      background: #fee2e2;
      color: #dc2626;
    }

    .admin-side-btn.active .admin-side-badge {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }

    /* Profil Petugas & Tombol Logout di Bawah Sidebar */
    .admin-sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .admin-user-info {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .admin-avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #c1121f;
      color: #fff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .admin-user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .admin-user-name {
      font-size: 0.82rem;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .admin-user-role {
      font-size: 0.68rem;
      font-weight: 600;
      color: #059669;
    }

    .btn-admin-logout-side {
      width: 100%;
      background: #ffffff;
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 0.45rem;
      font-size: 0.78rem;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all 0.15s ease;
    }

    .btn-admin-logout-side:hover {
      background: #ef4444;
      color: #fff;
    }

    /* ── KONTEN UTAMA DI SEBELAH KANAN SIDEBAR ── */
    .admin-main-viewport {
      flex: 1;
      margin-left: 260px;
      padding: 1.75rem 2rem 3rem;
      min-width: 0;
      width: calc(100% - 260px);
    }

    .admin-tab-content {
      display: none;
    }

    .admin-tab-content.active {
      display: block;
    }

    /* Perbaikan Auto-Purge Hint Box */
    .auto-purge-hint {
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.4rem !important;
      background: #ecfdf5 !important;
      border: 1px solid #86efac !important;
      color: #166534 !important;
      padding: 0.45rem 0.85rem !important;
      border-radius: 8px !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      margin-top: 0.75rem !important;
      line-height: 1.4 !important;
      white-space: normal !important;
      width: fit-content !important;
      max-width: 100% !important;
    }

    /* KPI Cards Responsif */
    .petugas-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin: 1.25rem 0 1.5rem;
    }

    /* Quick Actions */
    .admin-quick-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    /* Leaflet Admin Map */
    .admin-full-map {
      height: 580px;
      width: 100%;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    /* ── RESPONSIVE MEDIA QUERIES (MOBILE & TABLET) ── */
    @media (max-width: 992px) {
      .admin-mobile-topbar {
        display: flex;
      }

      .admin-sidebar {
        transform: translateX(-100%);
      }

      .admin-sidebar.open {
        transform: translateX(0);
      }

      .admin-sidebar-backdrop.active {
        display: block;
      }

      .btn-close-sidebar {
        display: block;
      }

      .admin-main-viewport {
        margin-left: 0;
        width: 100%;
        padding: 5rem 1rem 3rem;
      }

      .petugas-kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .admin-top-card {
        flex-direction: column;
        align-items: stretch;
      }

      .admin-quick-actions {
        width: 100%;
      }

      .admin-quick-actions button {
        flex: 1;
        justify-content: center;
        text-align: center;
      }

      .petugas-kpi-grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }

      .petugas-kpi-card {
        padding: 0.85rem;
      }

      .petugas-kpi-value {
        font-size: 1.35rem;
      }

      .petugas-kpi-label {
        font-size: 0.68rem;
      }

      .table-header-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .tab-filter-pills {
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .input-sm {
        max-width: 100%;
      }
    }
  </style>
</head>

<body>

  <!-- ============================================================== -->
  <!-- TATA LETAK RESMI ADMIN (SIDEBAR DI SAMPING + KONTEN RESPONSIF) -->
  <!-- ============================================================== -->
  <div class="admin-app-layout">

    <!-- ── 1. MOBILE TOPBAR (Tampil di Layar HP) ── -->
    <header class="admin-mobile-topbar">
      <button type="button" class="btn-mobile-toggle" id="btnAdminSidebarToggle" aria-label="Buka Menu Sidebar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div class="mobile-brand-group">
        <div class="mobile-brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div class="mobile-brand-title">SIMPEL</div>
          <div class="mobile-brand-sub">Pusat Kendali Petugas</div>
        </div>
      </div>

      <a href="/" title="Kunjungi Web Warga" style="color:#94a3b8; display:flex; align-items:center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </header>

    <!-- ── 2. BACKDROP OVERLAY MOBILE ── -->
    <div class="admin-sidebar-backdrop" id="adminSidebarBackdrop"></div>

    <!-- ── 3. SIDEBAR DI SAMPING (Persis Sesuai Screenshot 3) ── -->
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="admin-sidebar-header">
        <a href="/admin" class="admin-brand-link">
          <div class="admin-brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <span class="admin-brand-title">SIMPEL</span>
            <span class="admin-brand-badge">Pusat Kendali Petugas</span>
          </div>
        </a>
        <button type="button" class="btn-close-sidebar" id="btnAdminSidebarClose" aria-label="Tutup Menu">&times;</button>
      </div>

      <!-- Navigasi Menu Vertikal -->
      <nav class="admin-sidebar-nav">
        <span class="sidebar-category-title">OPERASIONAL KOTA</span>

        <!-- Menu 1: Meja Kerja Aduan (Active Red Pill) -->
        <button type="button" class="admin-side-btn active" data-tab="tabAdminMeja">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>Meja Kerja Aduan</span>
          <span class="admin-side-badge" id="sideBadgePending">0</span>
        </button>

        <!-- Menu 2: Peta Pantau Wilayah -->
        <button type="button" class="admin-side-btn" data-tab="tabAdminPeta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
          <span>Peta Pantau Wilayah</span>
        </button>

        <!-- Menu 3: Statistik Kinerja -->
        <button type="button" class="admin-side-btn" data-tab="tabAdminStatistik">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span>Statistik Kinerja</span>
        </button>

        <span class="sidebar-category-title">PORTAL WARGA</span>

        <!-- Menu 4: Kunjungi Web Warga -->
        <a href="/" class="admin-side-btn" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span>Lihat Web Warga</span>
        </a>
      </nav>

      <!-- Profil & Logout di Bagian Bawah Sidebar -->
      <div class="admin-sidebar-footer">
        <div class="admin-user-info">
          <div class="admin-avatar-circle">A</div>
          <div class="admin-user-details">
            <span class="admin-user-name" id="adminDisplayName">Administrator SIMPEL</span>
            <span class="admin-user-role">Petugas Kota Resmi</span>
          </div>
        </div>
        <button type="button" class="btn-admin-logout-side" id="btnAdminLogout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar dari Akun
        </button>
      </div>
    </aside>

    <!-- ── 4. KONTEN MEJA KERJA DI KANAN (RESPONSIF PENUH) ── -->
    <main class="admin-main-viewport">

      <!-- ── TAB 1: MEJA KERJA ADUAN ── -->
      <div id="tabAdminMeja" class="admin-tab-content active">
        <!-- Header Banner Meja Kerja -->
        <div class="admin-top-card">
          <div>
            <span class="admin-badge">PORTAL RESMI PETUGAS KOTA</span>
            <h2 class="admin-title">Meja Kerja Validasi &amp; Tindak Lanjut Aduan</h2>
            <p class="admin-sub">
              Periksa keabsahan bukti foto dan lokasi laporan warga, perbarui status pengerjaan, dan berikan catatan resmi petugas.
            </p>
            <div class="auto-purge-hint">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><strong>Sistem Retensi Otomatis:</strong> Laporan berstatus <strong>Selesai</strong> otomatis dihapus dalam waktu 24 jam.</span>
            </div>
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

      <!-- ── TAB 2: PETA PANTAU WILAYAH ── -->
      <div id="tabAdminPeta" class="admin-tab-content">
        <div class="admin-top-card" style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
          <div>
            <span class="admin-badge">GIS MONITORING</span>
            <h2 class="admin-title">Peta Sebaran Insiden Lingkungan Kota</h2>
            <p class="admin-sub">Pantau sebaran titik insiden aktif di seluruh wilayah dan kota (Bandung, Surabaya, Jakarta, dll.) untuk penugasan regu lapangan.</p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <select id="filterAdminMapStatus" class="field-select" style="padding:0.45rem 0.75rem; font-size:0.82rem; border-radius:6px; border:1px solid #cbd5e1; background:white;">
              <option value="ALL">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Diproses">Sedang Diproses</option>
              <option value="Selesai">Selesai Ditangani</option>
              <option value="Ditolak">Ditolak</option>
            </select>
            <button type="button" id="btnAdminMapResetBounds" class="btn-refresh" title="Pusatkan Seluruh Titik Peta" style="padding:0.45rem 0.85rem; font-size:0.82rem; display:inline-flex; align-items:center; gap:0.35rem; background:white; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              Pusatkan Peta
            </button>
          </div>
        </div>

        <div id="adminLeafletMap" class="admin-full-map" style="height:580px; min-height:520px; width:100%; border-radius:8px; border:1px solid #cbd5e1; position:relative; background:#e2e8f0; z-index:1;"></div>

        <div class="map-legend-bar" style="display:flex; gap:1.25rem; flex-wrap:wrap; margin-top:0.875rem; font-size:0.8125rem; color:#475569;">
          <div class="legend-chip" style="display:inline-flex; align-items:center; gap:0.375rem;"><span style="width:10px; height:10px; border-radius:50%; background:#f59e0b; display:inline-block;"></span> Menunggu Verifikasi</div>
          <div class="legend-chip" style="display:inline-flex; align-items:center; gap:0.375rem;"><span style="width:10px; height:10px; border-radius:50%; background:#0284c7; display:inline-block;"></span> Sedang Diproses</div>
          <div class="legend-chip" style="display:inline-flex; align-items:center; gap:0.375rem;"><span style="width:10px; height:10px; border-radius:50%; background:#059669; display:inline-block;"></span> Selesai Ditangani</div>
          <div class="legend-chip" style="display:inline-flex; align-items:center; gap:0.375rem;"><span style="width:10px; height:10px; border-radius:50%; background:#dc2626; display:inline-block;"></span> Ditolak</div>
        </div>
      </div>

      <!-- ── TAB 3: STATISTIK KINERJA ── -->
      <div id="tabAdminStatistik" class="admin-tab-content">
        <div class="admin-top-card" style="margin-bottom:1.5rem;">
          <div>
            <span class="admin-badge">DASHBOARD ANALITIK</span>
            <h2 class="admin-title">Statistik Penanganan &amp; Distribusi Isu Kota</h2>
            <p class="admin-sub">Laporan analitik agregat untuk evaluasi kinerja dinas dan pembuatan kebijakan lingkungan.</p>
          </div>
        </div>

        <div class="stats-charts-grid">
          <div class="chart-card">
            <h3 class="chart-card-title">Proporsi Klasifikasi Aduan</h3>
            <p class="chart-card-sub">Perbandingan laporan pengaduan, aspirasi, dan informasi</p>
            <div id="chartKlasifikasi" class="chart-container-flex"></div>
          </div>

          <div class="chart-card">
            <h3 class="chart-card-title">Tingkat Penyelesaian Masalah</h3>
            <p class="chart-card-sub">Rasio aduan yang telah tuntas vs sedang diproses</p>
            <div id="chartStatusPie" class="chart-container-flex"></div>
          </div>

          <div class="chart-card">
            <h3 class="chart-card-title">Kategori Permasalahan Lingkungan</h3>
            <p class="chart-card-sub">Jumlah aduan terbanyak berdasarkan jenis isu lingkungan</p>
            <div id="chartCategoryBars" class="stacked-bar-list"></div>
          </div>

          <div class="chart-card">
            <h3 class="chart-card-title">Sebaran per Wilayah / Kecamatan</h3>
            <p class="chart-card-sub">Beban laporan lingkungan di berbagai wilayah kota</p>
            <div id="chartDistrictBars" class="stacked-bar-list"></div>
          </div>
        </div>
      </div>

    </main>
  </div>

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
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""></script>

  <!-- jsPDF & AutoTable for PDF Export -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

  <!-- Dedicated Admin Script -->
  <script src="admin.js"></script>
</body>

</html>
