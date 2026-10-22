// ==========================================================================
// SIMPEL - SCRIPT PORTAL RESMI PETUGAS (ADMIN DASHBOARD)
// Khusus meja kerja validasi, pemantauan GIS, statistik, dan ekspor PDF resmi.
// ==========================================================================

const SEED_DATA = [
  {
    id: "LAP-2026-0128",
    type: "PENGADUAN",
    title: "Tumpukan Sampah Liar di Pinggir Jalan",
    description: "Tumpukan sampah plastik dan limbah rumah tangga menumpuk dan menimbulkan bau tidak sedap serta lalat.",
    date: "2026-10-10",
    category: "Sampah",
    district: "Sukajadi",
    agency: "Dinas Lingkungan Hidup Kota",
    address: "Jl. Merdeka No. 10, RT 04 / RW 02",
    lat: -7.2575,
    lng: 112.7521,
    status: "Menunggu Verifikasi",
    reporterName: "Budi Santoso",
    isAnonymous: false,
    isSecret: false,
    officerNote: "Menunggu penugasan regu pengangkut sampah dinas wilayah Sukajadi.",
    photoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23334155'/><text x='200' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23f1f5f9' text-anchor='middle'>Bukti Aduan Sampah</text><text x='200' y='150' font-family='sans-serif' font-size='12' fill='%2394a3b8' text-anchor='middle'>Lokasi: Jl. Merdeka No. 10</text></svg>"
  },
  {
    id: "LAP-2026-0129",
    type: "PENGADUAN",
    title: "Pembuangan Limbah Cair Keruh ke Aliran Sungai",
    description: "Aliran air sungai berubah warna keruh kehitaman dan mengeluarkan aroma menyengat, diduga limbah industri kecil.",
    date: "2026-10-09",
    category: "Polusi Air",
    district: "Menteng",
    agency: "Dinas Lingkungan Hidup Kota",
    address: "Bantaran Sungai Ciliwung, Jembatan Timur",
    lat: -7.2625,
    lng: 112.7480,
    status: "Diproses",
    reporterName: "Siti Rahmawati",
    isAnonymous: false,
    isSecret: false,
    officerNote: "Tim laboratorium lingkungan dinas telah mengambil sampel air untuk uji baku mutu laboratorium.",
    photoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%230f172a'/><text x='200' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'>Bukti Pencemaran Air</text><text x='200' y='150' font-family='sans-serif' font-size='12' fill='%2394a3b8' text-anchor='middle'>Lokasi: Sungai Ciliwung</text></svg>"
  },
  {
    id: "LAP-2026-0130",
    type: "ASPIRASI",
    title: "Perbaikan Pagar dan Bangku Fasilitas Taman Kota",
    description: "Pagar pembatas area bermain anak patah dan bangku taman rusak akibat tertimpa dahan pohon lapuk.",
    date: "2026-10-08",
    category: "Ruang Terbuka",
    district: "Wonokromo",
    agency: "Dinas Kebersihan & Ruang Terbuka Hijau",
    address: "Taman Bungkul Sisi Barat",
    lat: -7.2915,
    lng: 112.7390,
    status: "Selesai",
    reporterName: "Anonim",
    isAnonymous: true,
    isSecret: false,
    completedAt: new Date().toISOString(),
    officerNote: "Pagar telah diperbaiki dan bangku baru telah dipasang oleh petugas dinas pertamanan.",
    photoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23064e3b'/><text x='200' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23a7f3d0' text-anchor='middle'>Perbaikan Fasilitas RTH</text><text x='200' y='150' font-family='sans-serif' font-size='12' fill='%23ecfdf5' text-anchor='middle'>Status: Selesai Ditangani</text></svg>"
  },
  {
    id: "LAP-2026-0131",
    type: "PENGADUAN",
    title: "Asap Tebal Pembakaran Sampah Ilegal di Lahan Kosong",
    description: "Aktivitas pembakaran sampah kabel dan limbah di lahan terbuka menyebabkan polusi udara pekat.",
    date: "2026-10-10",
    category: "Polusi Udara",
    district: "Cibiru",
    agency: "Satuan Polisi Pamong Praja",
    address: "Kawasan Industri Pergudangan Blok C",
    lat: -7.2450,
    lng: 112.7650,
    status: "Diproses",
    reporterName: "Anonim",
    isAnonymous: true,
    isSecret: true,
    officerNote: "Satpol PP dan petugas dinas mendatangi lokasi dan memberikan sanksi peringatan.",
    photoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%233f3f46'/><text x='200' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'>Bukti Polusi Asap</text><text x='200' y='150' font-family='sans-serif' font-size='12' fill='%23f4f4f5' text-anchor='middle'>Lokasi: Blok C Pergudangan</text></svg>"
  }
];

class AdminState {
  constructor() {
    this.storageKey = "sipelik_lapor_data";
    this.authKey = "sipelik_current_user";
    this.reports = this.loadReports();
    this.currentUser = this.loadCurrentUser();
    this.adminMap = null;
    this.adminMapMarkers = [];
    this.activeFilter = "ALL";
    this.searchQuery = "";
  }

  loadCurrentUser() {
    try {
      const data = localStorage.getItem(this.authKey);
      if (data) {
        const u = JSON.parse(data);
        if (u && (u.role === "admin" || u.role === "officer")) return u;
      }
    } catch (e) {
      console.warn("Auth parse error:", e);
    }
    const defaultAdmin = {
      id: 1,
      name: "Administrator SIMPEL",
      email: "admin@simpel.go.id",
      role: "admin"
    };
    localStorage.setItem(this.authKey, JSON.stringify(defaultAdmin));
    return defaultAdmin;
  }

  filterExpiredCompleted(reportsList) {
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    return (reportsList || []).filter(item => {
      if (item.status === "Selesai") {
        const finishTime = item.completedAt ? new Date(item.completedAt).getTime() : new Date(item.date).getTime();
        if (now - finishTime >= TWENTY_FOUR_HOURS_MS) {
          return false;
        }
      }
      return true;
    });
  }

  purgeExpiredReports() {
    const prevCount = this.reports.length;
    this.reports = this.filterExpiredCompleted(this.reports);
    if (this.reports.length !== prevCount) {
      this.saveReports();
      console.log(`[SIMPEL Admin] Retensi Otomatis: ${prevCount - this.reports.length} aduan selesai (>24 jam) dibersihkan.`);
    }
  }

  migrateReports(reports) {
    if (!Array.isArray(reports)) return [...SEED_DATA];
    return reports.map((r, i) => {
      if (!r.reporterName) {
        if (r.isAnonymous) {
          r.reporterName = "Anonim";
        } else if (r.id === "LAP-2026-0128") {
          r.reporterName = "Budi Santoso";
        } else if (r.id === "LAP-2026-0129") {
          r.reporterName = "Siti Rahmawati";
        } else {
          r.reporterName = "Warga SIMPEL";
        }
      }

      const locText = `${r.district || ''} ${r.address || ''} ${r.title || ''}`.toLowerCase();
      const isDefaultSurabaya = Math.abs(r.lat - (-7.2575)) < 0.05 && Math.abs(r.lng - 112.7521) < 0.05;

      if (isDefaultSurabaya) {
        if (locText.includes("bandung")) {
          r.lat = Number((-6.9175 + (Math.sin(i + 1) * 0.012)).toFixed(5));
          r.lng = Number((107.6191 + (Math.cos(i + 1) * 0.012)).toFixed(5));
        } else if (locText.includes("sumedang")) {
          r.lat = Number((-6.8584 + (Math.sin(i + 1) * 0.012)).toFixed(5));
          r.lng = Number((107.9266 + (Math.cos(i + 1) * 0.012)).toFixed(5));
        } else if (locText.includes("jakarta")) {
          r.lat = Number((-6.2088 + (Math.sin(i + 1) * 0.012)).toFixed(5));
          r.lng = Number((106.8456 + (Math.cos(i + 1) * 0.012)).toFixed(5));
        }
      }
      return r;
    });
  }

  loadReports() {
    let reports = [];
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) reports = JSON.parse(data);
      else reports = [...SEED_DATA];
    } catch (e) {
      console.warn("Storage read error:", e);
      reports = [...SEED_DATA];
    }
    reports = this.migrateReports(reports);
    reports = this.filterExpiredCompleted(reports);
    localStorage.setItem(this.storageKey, JSON.stringify(reports));
    return reports;
  }

  saveReports() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.reports));
    } catch (e) {
      console.error("Save reports error:", e);
    }
  }

  updateReport(id, status, note) {
    const item = this.reports.find(r => r.id === id);
    if (item) {
      item.status = status;
      if (status === "Selesai") {
        item.completedAt = new Date().toISOString();
      } else {
        delete item.completedAt;
      }
      if (note !== undefined) item.officerNote = note;
      this.saveReports();
      return true;
    }
    return false;
  }
}

const adminState = new AdminState();

// ==========================================================================
// INISIALISASI HALAMAN PORTAL ADMIN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initAdminNavigation();
  initAdminTable();
  initAdminMap();
  initAdminStatistics();
  initAdminModals();
  initAdminLogout();

  // Jalankan retensi otomatis setiap 60 detik
  setInterval(() => {
    adminState.purgeExpiredReports();
    renderAdminTable();
    updateKpiCards();
  }, 60000);
});

// 1. Navigasi Tab Internal Admin & Sidebar
function initAdminNavigation() {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("adminSidebarBackdrop");
  const toggleBtn = document.getElementById("btnAdminSidebarToggle");
  const closeBtn = document.getElementById("btnAdminSidebarClose");

  const openSidebar = () => {
    sidebar?.classList.add("open");
    backdrop?.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    sidebar?.classList.remove("open");
    backdrop?.classList.remove("active");
    document.body.style.overflow = "";
  };

  toggleBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  backdrop?.addEventListener("click", closeSidebar);

  // Tab buttons (sidebar items)
  const tabButtons = document.querySelectorAll(".admin-side-btn[data-tab], .admin-nav-tab");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");

      const targetId = btn.getAttribute("data-tab");
      document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");

      // Tutup drawer di mobile jika terbuka
      closeSidebar();

      // Invalidate peta jika beralih ke tab peta
      if (targetId === "tabAdminPeta") {
        setTimeout(() => {
          if (!adminState.adminMap) {
            initAdminMap();
          } else {
            adminState.adminMap.invalidateSize(true);
            renderAdminMapMarkers();
          }
        }, 150);
        setTimeout(() => {
          adminState.adminMap?.invalidateSize(true);
        }, 400);
      }
      if (targetId === "tabAdminStatistik") {
        renderAdminStatistics();
      }
    });
  });

  // Tampilkan nama admin
  const nameEl = document.getElementById("adminDisplayName");
  if (nameEl && adminState.currentUser) {
    nameEl.textContent = adminState.currentUser.name || "Administrator SIMPEL";
  }
}

// 2. Meja Kerja & Tabel Aduan
function initAdminTable() {
  // Filter pills
  const pills = document.querySelectorAll(".tab-filter-pills .tab-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      adminState.activeFilter = pill.getAttribute("data-status");
      renderAdminTable();
    });
  });

  // Search input
  const searchInput = document.getElementById("adminSearchInput");
  searchInput?.addEventListener("input", (e) => {
    adminState.searchQuery = e.target.value.toLowerCase().trim();
    renderAdminTable();
  });

  // Tombol Segarkan Data
  document.getElementById("btnRefreshAdmin")?.addEventListener("click", () => {
    adminState.reports = adminState.loadReports();
    renderAdminTable();
    updateKpiCards();
    showToast("Data aduan berhasil disegarkan.");
  });

  // Tombol Unduh Rekap PDF
  document.getElementById("btnExportAdminPDF")?.addEventListener("click", exportReportsPDF);

  renderAdminTable();
  updateKpiCards();
}

function updateKpiCards() {
  const total = adminState.reports.length;
  const pending = adminState.reports.filter(r => r.status === "Menunggu Verifikasi").length;
  const process = adminState.reports.filter(r => r.status === "Diproses").length;
  const done = adminState.reports.filter(r => r.status === "Selesai").length;

  const totalEl = document.getElementById("petugasKpiTotal");
  const pendingEl = document.getElementById("petugasKpiPending");
  const processEl = document.getElementById("petugasKpiProcess");
  const doneEl = document.getElementById("petugasKpiDone");
  const sidePendingEl = document.getElementById("sideBadgePending");

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (processEl) processEl.textContent = process;
  if (doneEl) doneEl.textContent = done;
  if (sidePendingEl) sidePendingEl.textContent = pending;
}

function renderAdminTable() {
  const tbody = document.getElementById("adminReportsTableBody");
  if (!tbody) return;

  const filtered = adminState.reports.filter(r => {
    const matchFilter = adminState.activeFilter === "ALL" || r.status === adminState.activeFilter;
    const matchSearch = r.id.toLowerCase().includes(adminState.searchQuery) ||
                        r.title.toLowerCase().includes(adminState.searchQuery) ||
                        (r.district || "").toLowerCase().includes(adminState.searchQuery) ||
                        (r.category || "").toLowerCase().includes(adminState.searchQuery);
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">
          Tidak ditemukan laporan aduan yang sesuai dengan kriteria filter saat ini.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.id)}</strong></td>
      <td>${item.date}</td>
      <td>
        <strong>${escapeHtml(item.category)}</strong><br>
        <small style="color:var(--text-muted);">${escapeHtml(item.district || "-")}</small>
      </td>
      <td><strong>${escapeHtml(item.title)}</strong></td>
      <td><img src="${item.photoUrl}" alt="Bukti" class="table-photo-thumb" style="width:48px;height:36px;object-fit:cover;border-radius:4px;border:1px solid #cbd5e1;"></td>
      <td><span class="status-tag ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span></td>
      <td>
        <button type="button" class="btn-outline-red btn-sm" onclick="openActionModal('${item.id}')">
          Tindak Lanjut
        </button>
      </td>
    </tr>
  `).join("");
}

// 3. Modal Tindak Lanjut Petugas
window.openActionModal = function(id) {
  const report = adminState.reports.find(r => r.id === id);
  if (!report) return;

  const modal = document.getElementById("modalActionPetugas");
  const body = document.getElementById("modalActionBody");

  body.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <div style="background:var(--surface-subtle); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-medium);">
        <span style="font-size:11px; font-weight:800; color:#c1121f;">${escapeHtml(report.id)}</span>
        <h4 style="font-size:14px; font-weight:800; margin:3px 0;">${escapeHtml(report.title)}</h4>
        <p style="font-size:12px; color:var(--text-body);">${escapeHtml(report.description)}</p>
        <p style="font-size:11px; color:var(--text-muted); margin-top:4px;">
          Lokasi: ${escapeHtml(report.address || "-")} (${escapeHtml(report.district || "-")})
        </p>
      </div>

      <div class="form-field">
        <label class="field-label">Perbarui Status Penanganan:</label>
        <select id="modalNewStatus" class="field-select">
          <option value="Menunggu Verifikasi" ${report.status === "Menunggu Verifikasi" ? "selected" : ""}>Menunggu Verifikasi (Pending)</option>
          <option value="Diproses" ${report.status === "Diproses" ? "selected" : ""}>Verifikasi &amp; Mulai Diproses</option>
          <option value="Selesai" ${report.status === "Selesai" ? "selected" : ""}>Tandai Selesai Ditangani (Auto-Purge 24 Jam)</option>
          <option value="Ditolak" ${report.status === "Ditolak" ? "selected" : ""}>Tolak Aduan</option>
        </select>
      </div>

      <div class="form-field">
        <label class="field-label">Catatan Resmi Petugas / Tindakan Lapangan:</label>
        <textarea id="modalOfficerNote" class="field-textarea" rows="3" placeholder="Tuliskan tindakan yang telah dilakukan petugas lapangan...">${escapeHtml(report.officerNote || "")}</textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
        <button type="button" class="btn-outline-red btn-sm" onclick="closeActionModal()">Batal</button>
        <button type="button" class="btn-lapor-submit btn-sm" onclick="saveActionModal('${report.id}')">Simpan Tindak Lanjut</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
};

window.closeActionModal = function() {
  document.getElementById("modalActionPetugas")?.classList.add("hidden");
};

window.saveActionModal = function(id) {
  const status = document.getElementById("modalNewStatus").value;
  const note = document.getElementById("modalOfficerNote").value.trim();

  adminState.updateReport(id, status, note);
  window.closeActionModal();

  renderAdminTable();
  updateKpiCards();
  renderAdminMapMarkers();

  showToast(`Status laporan ${id} berhasil diperbarui.`);
};

function initAdminModals() {
  document.getElementById("btnCloseModalAction")?.addEventListener("click", window.closeActionModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".lapor-modal-backdrop").forEach(m => m.classList.add("hidden"));
    }
  });

  document.querySelectorAll(".lapor-modal-backdrop").forEach(b => {
    b.addEventListener("click", (e) => {
      if (e.target === b) b.classList.add("hidden");
    });
  });
}

// 4. Peta Pantau Wilayah (GIS Monitoring Petugas)
function initAdminMap() {
  const mapEl = document.getElementById("adminLeafletMap");
  if (!mapEl || typeof L === "undefined") return;

  if (adminState.adminMap) {
    adminState.adminMap.invalidateSize(true);
    renderAdminMapMarkers();
    return;
  }

  adminState.adminMap = L.map("adminLeafletMap", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([-7.2575, 112.7521], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(adminState.adminMap);

  document.getElementById("filterAdminMapStatus")?.addEventListener("change", renderAdminMapMarkers);
  document.getElementById("btnAdminMapResetBounds")?.addEventListener("click", () => {
    fitAdminMapBounds();
    showToast("Peta berhasil dipusatkan pada seluruh titik laporan.");
  });

  renderAdminMapMarkers();

  setTimeout(() => {
    adminState.adminMap?.invalidateSize(true);
    fitAdminMapBounds();
  }, 300);
}

function fitAdminMapBounds() {
  if (!adminState.adminMap) return;
  const validLatLngs = [];
  adminState.reports.forEach(r => {
    if (r.lat && r.lng) validLatLngs.push([Number(r.lat), Number(r.lng)]);
  });
  if (validLatLngs.length > 0) {
    const bounds = L.latLngBounds(validLatLngs);
    adminState.adminMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

function renderAdminMapMarkers() {
  if (!adminState.adminMap) return;

  adminState.adminMapMarkers.forEach(m => adminState.adminMap.removeLayer(m));
  adminState.adminMapMarkers = [];

  const filterStatus = document.getElementById("filterAdminMapStatus")?.value || "ALL";

  const list = adminState.reports.filter(r => {
    if (!r.lat || !r.lng) return false;
    return filterStatus === "ALL" || r.status === filterStatus;
  });

  const usedCoords = {};
  const latLngs = [];

  list.forEach(r => {
    let lat = Number(r.lat);
    let lng = Number(r.lng);

    // Jitter if points overlap
    const coordKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    if (usedCoords[coordKey]) {
      const step = usedCoords[coordKey];
      const angle = step * (Math.PI / 3);
      const radius = 0.003 * Math.ceil(step / 6);
      lat += Math.sin(angle) * radius;
      lng += Math.cos(angle) * radius;
      usedCoords[coordKey]++;
    } else {
      usedCoords[coordKey] = 1;
    }

    latLngs.push([lat, lng]);

    let markerColor = "#f59e0b"; // Menunggu
    if (r.status === "Diproses") markerColor = "#0284c7";
    if (r.status === "Selesai") markerColor = "#059669";
    if (r.status === "Ditolak") markerColor = "#dc2626";

    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `<div style="background:${markerColor}; width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.45);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    const isAnon = r.isAnonymous || r.reporterName === "Anonim";
    const authorName = escapeHtml(r.reporterName || (isAnon ? "Anonim" : "Warga SIMPEL"));

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(adminState.adminMap);
    marker.bindPopup(`
      <div style="font-family:'Inter',sans-serif; max-width:240px; padding:4px;">
        <span style="font-size:10px; font-weight:800; color:#c1121f;">${escapeHtml(r.id)}</span>
        <h4 style="font-size:13px; font-weight:800; margin:2px 0;">${escapeHtml(r.title)}</h4>
        <p style="font-size:11px; color:#1e293b; margin:2px 0;">Pelapor: <strong>${authorName}</strong> ${isAnon ? '<span style="font-size:9px; background:#f1f5f9; padding:1px 4px; border-radius:3px;">Anonim</span>' : ''}</p>
        <p style="font-size:11px; color:#475569; margin:2px 0;">Wilayah: ${escapeHtml(r.district || "-")} (${escapeHtml(r.address || "")})</p>
        <div style="margin:4px 0;"><span class="status-tag ${getStatusClass(r.status)}" style="font-size:10px; padding:2px 6px;">${escapeHtml(r.status)}</span></div>
        <button type="button" class="btn-outline-red btn-sm" style="width:100%; margin-top:4px;" onclick="openActionModal('${r.id}')">
          Tindak Lanjut &rarr;
        </button>
      </div>
    `);

    adminState.adminMapMarkers.push(marker);
  });

  if (latLngs.length > 0) {
    const bounds = L.latLngBounds(latLngs);
    adminState.adminMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

// 5. Statistik & Analitik Kinerja Admin
function initAdminStatistics() {
  renderAdminStatistics();
}

function renderAdminStatistics() {
  const total = adminState.reports.length;
  if (total === 0) return;

  // Donut Klasifikasi
  const typeCounts = { PENGADUAN: 0, ASPIRASI: 0, "PERMINTAAN INFORMASI": 0 };
  adminState.reports.forEach(r => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  const chartKlas = document.getElementById("chartKlasifikasi");
  if (chartKlas) {
    chartKlas.innerHTML = `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <svg width="120" height="120" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="5"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#c1121f" stroke-width="5" stroke-dasharray="${(typeCounts.PENGADUAN/total)*100}, 100"/>
        </svg>
        <div style="font-size:12px; display:flex; flex-direction:column; gap:4px;">
          <div><strong style="color:#c1121f;">Pengaduan:</strong> ${typeCounts.PENGADUAN} laporan</div>
          <div><strong style="color:#0284c7;">Aspirasi:</strong> ${typeCounts.ASPIRASI} laporan</div>
          <div><strong style="color:#059669;">Permintaan Info:</strong> ${typeCounts["PERMINTAAN INFORMASI"]} laporan</div>
        </div>
      </div>
    `;
  }

  // Status Pie
  const chartStatPie = document.getElementById("chartStatusPie");
  if (chartStatPie) {
    const pendingCount = adminState.reports.filter(r => r.status === "Menunggu Verifikasi").length;
    const processCount = adminState.reports.filter(r => r.status === "Diproses").length;
    const completed = adminState.reports.filter(r => r.status === "Selesai").length;

    chartStatPie.innerHTML = `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <svg width="120" height="120" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="5"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="${(completed/total)*100}, 100"/>
        </svg>
        <div style="font-size:12px; display:flex; flex-direction:column; gap:4px;">
          <div><strong style="color:#f59e0b;">Menunggu:</strong> ${pendingCount} aduan</div>
          <div><strong style="color:#0284c7;">Diproses:</strong> ${processCount} aduan</div>
          <div><strong style="color:#059669;">Selesai:</strong> ${completed} aduan</div>
        </div>
      </div>
    `;
  }

  // Baris Bar Kategori
  const catBars = document.getElementById("chartCategoryBars");
  if (catBars) {
    const catCounts = {};
    adminState.reports.forEach(r => catCounts[r.category] = (catCounts[r.category] || 0) + 1);

    catBars.innerHTML = Object.entries(catCounts).map(([cat, c]) => {
      const pct = Math.round((c / total) * 100);
      return `
        <div class="stacked-bar-item">
          <div class="bar-labels-row">
            <span>${escapeHtml(cat)}</span>
            <span>${c} aduan (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-progress-red" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Baris Bar Wilayah
  const distBars = document.getElementById("chartDistrictBars");
  if (distBars) {
    const distCounts = {};
    adminState.reports.forEach(r => distCounts[r.district || "Lainnya"] = (distCounts[r.district || "Lainnya"] || 0) + 1);

    distBars.innerHTML = Object.entries(distCounts).map(([dist, c]) => {
      const pct = Math.round((c / total) * 100);
      return `
        <div class="stacked-bar-item">
          <div class="bar-labels-row">
            <span>${escapeHtml(dist)}</span>
            <span>${c} aduan (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-progress-red" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

// 6. Ekspor Rekapitulasi PDF Resmi Petugas
function exportReportsPDF() {
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    showToast("Memuat komponen PDF, silakan coba sesaat lagi...");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner Merah Khas SIMPEL
  doc.setFillColor(193, 18, 31);
  doc.rect(0, 0, 297, 8, 'F');

  // Kop Resmi Dinas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59);
  doc.text("PEMERINTAH KOTA — DINAS LINGKUNGAN HIDUP & KEBERSIHAN", 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(193, 18, 31);
  doc.text("REKAPITULASI RESMI PENGADUAN & ASPIRASI MASYARAKAT (SIMPEL)", 14, 24);

  // Metadata Cetak
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const nowFormatted = new Date().toLocaleString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  doc.text(`Dicetak pada: ${nowFormatted} | Total Aduan: ${adminState.reports.length} Laporan | Petugas: ${adminState.currentUser ? adminState.currentUser.name : 'Administrator SIMPEL'}`, 14, 30);

  // Garis Pemisah Tipis
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 33, 283, 33);

  // Data Tabel
  const tableData = adminState.reports.map(r => [
    r.id,
    r.date,
    r.type,
    r.category,
    r.district || '-',
    r.title,
    r.address || '-',
    r.status,
    r.officerNote || '-'
  ]);

  doc.autoTable({
    startY: 36,
    head: [["No. Tiket", "Tanggal", "Tipe", "Kategori", "Wilayah", "Judul Aduan", "Alamat Lokasi", "Status", "Catatan Petugas"]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [193, 18, 31],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 20 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 24 },
      4: { cellWidth: 25 },
      5: { cellWidth: 48 },
      6: { cellWidth: 45 },
      7: { cellWidth: 28, fontStyle: 'bold', halign: 'center' },
      8: { cellWidth: 'auto' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 7) {
        const val = data.cell.raw;
        if (val === "Selesai") {
          data.cell.styles.textColor = [5, 150, 105];
        } else if (val === "Diproses") {
          data.cell.styles.textColor = [2, 132, 199];
        } else if (val === "Ditolak") {
          data.cell.styles.textColor = [220, 38, 38];
        } else {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
    foot: [["", "", "", "", "", "", "", "", `Halaman ${doc.internal.getNumberOfPages()}`]],
    footStyles: {
      fillColor: [248, 250, 252],
      textColor: [148, 163, 184],
      fontSize: 7,
      halign: 'right'
    }
  });

  const timestamp = Date.now();
  doc.save(`Rekap_Aduan_SIMPEL_${timestamp}.pdf`);
  showToast("File Rekapitulasi PDF resmi berhasil diunduh.");
}

// 7. Logout Petugas
function initAdminLogout() {
  document.getElementById("btnAdminLogout")?.addEventListener("click", () => {
    localStorage.removeItem("sipelik_current_user");
    showToast("Anda telah keluar dari Portal Petugas.");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  });
}

// 8. Utilities
function getStatusClass(status) {
  if (status === "Diproses") return "process";
  if (status === "Selesai") return "completed";
  if (status === "Ditolak") return "rejected";
  return "pending";
}

function showToast(msg) {
  const container = document.getElementById("laporToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    toast.style.transition = "all 0.2s ease";
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
