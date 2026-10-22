// ==========================================================================
// SIMPEL AUTH HELPER & EMAILJS INTEGRATION
// Kombinasi backend Laravel (OTP generator & database) + EmailJS untuk kirim email real.
// ==========================================================================

const EMAILJS_CONFIG = {
  publicKey: '6h5g2PK9bo1oKvatZ',
  serviceId: 'service_vo0exbc',
  templateId: 'template_5pg81ct',
};

// Inisialisasi EmailJS SDK jika library tersedia
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
}

/**
 * Base URL untuk semua endpoint Laravel API.
 * Sesuaikan jika APP_URL berubah atau saat deploy ke production.
 * @type {string}
 */
const SIMPEL_API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? (window.location.origin + '/api')
  : ((window.SIMPEL_API_BASE || 'https://simpelkota.page.gd') + '/api');
/**
 * Header default untuk semua request JSON ke Laravel.
 * Menyertakan X-Requested-With agar Laravel mengenali request AJAX.
 * @type {HeadersInit}
 */
const SIMPEL_JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

// --------------------------------------------------------------------------
// requestOtp(email)
// --------------------------------------------------------------------------
/**
 * Meminta kode OTP dikirim ke alamat email yang diberikan.
 * 1. Minta kode OTP acak dari backend Laravel (/api/send-otp) -> disimpan di database
 * 2. Kirim kode OTP tersebut langsung ke Gmail via EmailJS SDK
 *
 * @param  {string} email  - Alamat email tujuan pengiriman OTP
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function requestOtp(email) {
  try {
    const response = await fetch(`${SIMPEL_API_BASE}/send-otp`, {
      method: 'POST',
      headers: SIMPEL_JSON_HEADERS,
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message
        || (data.errors && Object.values(data.errors).flat().join(' '))
        || 'Gagal mengirim OTP. Coba lagi.';
      return { success: false, message: errorMsg };
    }

    // Kirim email via EmailJS browser SDK ke inbox pengguna
    if (typeof emailjs !== 'undefined' && data.otp_code) {
      try {
        const templateParams = {
          to_email: email,
          email: email,
          to_name: email.split('@')[0],
          name: email.split('@')[0],
          otp_code: data.otp_code,
          otp: data.otp_code,
          code: data.otp_code,
          passcode: data.otp_code,
          message: `Kode verifikasi OTP Anda untuk masuk ke sistem SIMPEL adalah: ${data.otp_code}. Kode ini berlaku selama 5 menit.`,
        };

        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey);
        console.log('[EmailJS] Berhasil mengirim email OTP ke:', email);
      } catch (emailErr) {
        console.warn('[EmailJS] Pengiriman email gagal via SDK:', emailErr);
      }
    }

    return {
      success: true,
      message: `Kode OTP telah dikirim ke email ${email}. Silakan periksa kotak masuk atau spam.`,
      otp_code: data.otp_code,
    };

  } catch (networkError) {
    console.error('[SimpelAuth] requestOtp network error:', networkError);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    };
  }
}

// --------------------------------------------------------------------------
// submitOtp(email, code)
// --------------------------------------------------------------------------
/**
 * Mengirim kode OTP untuk diverifikasi oleh server.
 * Jika valid, server akan mengembalikan data user (baru atau yang sudah ada).
 *
 * @param  {string} email  - Alamat email yang sama dengan saat requestOtp
 * @param  {string} code   - Kode OTP 6 digit yang diinput pengguna
 * @returns {Promise<{success: boolean, message: string, user?: object}>}
 *
 * @example
 *   const result = await SimpelAuth.submitOtp('user@gmail.com', '482910');
 *   if (result.success) {
 *     console.log('Login sebagai:', result.user.name);
 *   }
 */
async function submitOtp(email, code) {
  try {
    const response = await fetch(`${SIMPEL_API_BASE}/verify-otp`, {
      method: 'POST',
      headers: SIMPEL_JSON_HEADERS,
      body: JSON.stringify({ email, otp_code: code }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message
        || (data.errors && Object.values(data.errors).flat().join(' '))
        || 'Verifikasi OTP gagal. Coba lagi.';
      return { success: false, message: errorMsg };
    }

    return data; // { success: true, message: '...', user: { id, name, email, role } }

  } catch (networkError) {
    console.error('[SimpelAuth] submitOtp network error:', networkError);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    };
  }
}

// --------------------------------------------------------------------------
// adminLogin(email, password)
// --------------------------------------------------------------------------
/**
 * Melakukan login admin menggunakan email + password standar.
 * Endpoint ini TIDAK menggunakan OTP; khusus role 'admin'.
 *
 * @param  {string} email     - Email admin (contoh: admin@simpel.go.id)
 * @param  {string} password  - Password admin
 * @returns {Promise<{success: boolean, message: string, user?: object}>}
 *
 * @example
 *   const result = await SimpelAuth.adminLogin('admin@simpel.go.id', 'rahasia123');
 *   if (result.success) {
 *     console.log('Admin login:', result.user.name);
 *   }
 */
async function adminLogin(email, password) {
  try {
    const response = await fetch(`${SIMPEL_API_BASE}/admin/login`, {
      method: 'POST',
      headers: SIMPEL_JSON_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message
        || (data.errors && Object.values(data.errors).flat().join(' '))
        || 'Login admin gagal.';
      return { success: false, message: errorMsg };
    }

    return data; // { success: true, message: '...', user: { id, name, email, role } }

  } catch (networkError) {
    console.error('[SimpelAuth] adminLogin network error:', networkError);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    };
  }
}

/**
 * Namespace publik SimpelAuth — ekspor semua fungsi autentikasi.
 * Dapat diakses dari mana saja di halaman via: SimpelAuth.requestOtp(...)
 */
window.SimpelAuth = { requestOtp, submitOtp, adminLogin };

// ==========================================================================
// SIPELIK - Layanan Pengaduan Online Lingkungan Kota (Gaya LAPOR!)
// State Management, Leaflet Maps, Statistics Charts, and RBAC
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

const INDONESIA_CITY_COORDS = {
  "bandung": [-6.9175, 107.6191],
  "sumedang": [-6.8584, 107.9266],
  "surabaya": [-7.2575, 112.7521],
  "jakarta": [-6.2088, 106.8456],
  "sukajadi": [-6.8858, 107.5932],
  "cibiru": [-6.9248, 107.7167],
  "wonokromo": [-7.3012, 112.7378],
  "gubeng": [-7.2736, 112.7547],
  "menteng": [-6.1969, 106.8361],
  "gambir": [-6.1754, 106.8272],
  "semarang": [-6.9667, 110.4167],
  "yogyakarta": [-7.7956, 110.3695],
  "jogja": [-7.7956, 110.3695],
  "malang": [-7.9666, 112.6326],
  "bogor": [-6.5971, 106.8060],
  "bekasi": [-6.2383, 106.9756],
  "tangerang": [-6.1783, 106.6319],
  "depok": [-6.4025, 106.7942],
  "solo": [-7.5755, 110.8243],
  "cirebon": [-6.7320, 108.5523],
  "cimahi": [-6.8722, 107.5420],
  "tasikmalaya": [-7.3274, 108.2207],
  "garut": [-7.2278, 107.9087],
  "medan": [3.5952, 98.6722],
  "makassar": [-5.1477, 119.4327],
  "denpasar": [-8.6705, 115.2126],
  "bali": [-8.4095, 115.1889]
};

const DEFAULT_USERS = [
  {
    id: "USR-001",
    name: "Budi Santoso",
    email: "warga@sipelik.go.id",
    password: "warga123",
    role: "citizen", // Warga
    phone: "081234567890",
    identifier: "3578012345670001",
    agency: ""
  },
  {
    id: "USR-002",
    name: "Ir. Hendro Wibowo, S.T.",
    email: "petugas@sipelik.go.id",
    password: "petugas123",
    role: "officer", // Petugas Kota
    phone: "081398765432",
    identifier: "198504122010011005",
    agency: "Dinas Lingkungan Hidup Kota"
  },
  {
    id: "USR-ADM",
    name: "Administrator SIPELIK",
    email: "admin@sipelik.go.id",
    password: "admin123",
    role: "admin", // Administrator Sistem
    phone: "081200000000",
    identifier: "ADMIN-001",
    agency: "Pusat Kendali SIPELIK"
  }
];

class LaporState {
  constructor() {
    this.storageKey = "sipelik_lapor_data";
    this.counterKey = "sipelik_huge_counter";
    this.usersKey = "sipelik_users_data";
    this.authKey = "sipelik_current_user";
    this.reports = this.loadReports();
    this.baseCounter = this.loadCounter();
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    this.activeType = "PENGADUAN";
    this.activeCoords = { lat: -7.2575, lng: 112.7521 };
    this.activePhotoBase64 = "";
    this.fullMap = null;
    this.miniMap = null;
    this.fullMapMarkers = [];
    this.miniMapMarker = null;
  }

  loadUsers() {
    try {
      const data = localStorage.getItem(this.usersKey);
      if (data) {
        const users = JSON.parse(data);
        // Pastikan akun petugas selalu ada meski data lama tidak memilikinya
        const hasOfficer = users.some(u => u.role === "officer");
        if (!hasOfficer) {
          const officerUser = DEFAULT_USERS.find(u => u.role === "officer");
          if (officerUser) {
            users.push(officerUser);
            localStorage.setItem(this.usersKey, JSON.stringify(users));
          }
        }
        return users;
      }
    } catch (e) {
      console.warn("User storage read error:", e);
    }
    localStorage.setItem(this.usersKey, JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }

  saveUsers() {
    try {
      localStorage.setItem(this.usersKey, JSON.stringify(this.users));
    } catch (e) {
      console.error("User storage save error:", e);
    }
  }

  loadCurrentUser() {
    try {
      const data = localStorage.getItem(this.authKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Auth storage read error:", e);
    }
    return null; // Tamu / belum login secara default
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(this.authKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.authKey);
    }
  }

  migrateReports(reports) {
    if (!Array.isArray(reports)) return [...SEED_DATA];
    return reports.map((r, i) => {
      // 1. Pastikan nama pelapor terisi
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

      // 2. Koreksi otomatis koordinat jika pengguna memilih Bandung/Sumedang/Jakarta tapi sebelumnya tersimpan koordinat default Surabaya (-7.2575)
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
    let list = [];
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) list = JSON.parse(data);
      else list = [...SEED_DATA];
    } catch (e) {
      console.warn("Storage read error:", e);
      list = [...SEED_DATA];
    }
    const migrated = this.migrateReports(list);
    localStorage.setItem(this.storageKey, JSON.stringify(migrated));
    return migrated;
  }

  saveReports() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.reports));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  }

  loadCounter() {
    const saved = localStorage.getItem(this.counterKey);
    return saved ? parseInt(saved, 10) : 2712304;
  }

  incrementCounter() {
    this.baseCounter += 1;
    localStorage.setItem(this.counterKey, String(this.baseCounter));
    return this.baseCounter;
  }

  addReport(rep) {
    this.reports.unshift(rep);
    this.saveReports();
    this.incrementCounter();
  }

  updateReport(id, status, note) {
    const item = this.reports.find(r => r.id === id);
    if (item) {
      item.status = status;
      if (note !== undefined) item.officerNote = note;
      this.saveReports();
      return true;
    }
    return false;
  }
}

const state = new LaporState();

document.addEventListener("DOMContentLoaded", () => {
  initTabsNavigation();
  initClassificationTabs();
  initFormAndUpload();
  initMiniMapPicker();
  initFullLeafletMap();
  initTicketSearch();
  initAdminDesk();
  initModals();
  updateCounterDisplay();
  renderPublicFeed();
  renderStatistics();
});



// 2. Tab Navigation & Mobile Side Drawer
function initTabsNavigation() {
  const drawer = document.getElementById("citizenMobileDrawer");
  const backdrop = document.getElementById("citizenDrawerBackdrop");
  const openBtn = document.getElementById("btnCitizenDrawerOpen");
  const closeBtn = document.getElementById("btnCitizenDrawerClose");

  const openDrawer = () => {
    drawer?.classList.add("open");
    backdrop?.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer?.classList.remove("open");
    backdrop?.classList.remove("active");
    document.body.style.overflow = "";
  };

  openBtn?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  // Desktop horizontal nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetTab = link.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Mobile side drawer nav buttons (Screenshot 3 style)
  const sideBtns = document.querySelectorAll(".citizen-side-btn[data-tab]");
  sideBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      switchTab(targetTab);
      closeDrawer();
    });
  });

  initAuthSystem();

  document.getElementById("btnLearnFlow")?.addEventListener("click", () => {
    switchTab("tabTentang");
  });
}

// Sistem Autentikasi Pengguna — Card Flip OTP (Masyarakat) + Password (Admin)
function initAuthSystem() {
  const btnOpenLogin = document.getElementById("btnOpenLogin");
  const btnOpenRegister = document.getElementById("btnOpenRegister");
  const btnDrawerLogin = document.getElementById("btnDrawerLogin");
  const btnDrawerRegister = document.getElementById("btnDrawerRegister");
  const btnLogout = document.getElementById("btnLogout");
  const btnDrawerLogout = document.getElementById("btnDrawerLogout");
  const modalLogin = document.getElementById("modalLogin");

  // Buka modal login saat klik "Masuk" atau "Daftar" (Desktop & Drawer Samping)
  const openAuthModal = () => {
    document.getElementById("citizenMobileDrawer")?.classList.remove("open");
    document.getElementById("citizenDrawerBackdrop")?.classList.remove("active");
    document.body.style.overflow = "";
    resetLoginModal();
    modalLogin?.classList.remove("hidden");
  };

  btnOpenLogin?.addEventListener("click", openAuthModal);
  btnOpenRegister?.addEventListener("click", openAuthModal);
  btnDrawerLogin?.addEventListener("click", openAuthModal);
  btnDrawerRegister?.addEventListener("click", openAuthModal);

  // Tombol tutup sisi depan & belakang
  document.getElementById("btnCloseLogin")?.addEventListener("click", closeLoginModal);
  document.getElementById("btnCloseLoginBack")?.addEventListener("click", closeLoginModal);

  // Klik backdrop untuk menutup
  modalLogin?.addEventListener("click", (e) => { if (e.target === modalLogin) closeLoginModal(); });

  // ── FLIP: Masyarakat <-> Admin ──────────────────────────────────────────
  const flipCard = document.getElementById("loginFlipCard");
  document.getElementById("btnFlipToAdmin")?.addEventListener("click", () => {
    flipCard?.classList.add("is-flipped");
    document.getElementById("adminLoginMsg")?.classList.add("hidden");
  });
  document.getElementById("btnFlipToMasyarakat")?.addEventListener("click", () => {
    flipCard?.classList.remove("is-flipped");
  });

  // ── MASYARAKAT — Langkah 1: Kirim OTP ───────────────────────────────────
  document.getElementById("formSendOtp")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("otpEmail").value.trim();
    const msgEl = document.getElementById("sendOtpMsg");
    const btnText = document.getElementById("btnSendOtpText");
    const spinner = document.getElementById("btnSendOtpSpinner");
    const btn = document.getElementById("btnSendOtp");

    showMsg(msgEl, "", "");
    setLoading(btn, btnText, spinner, true);
    const result = await SimpelAuth.requestOtp(email);
    setLoading(btn, btnText, spinner, false);

    if (!result.success) { showMsg(msgEl, result.message, "error-state"); return; }

    document.getElementById("otpEmailDisplay").textContent = email;
    document.getElementById("otpStep1").classList.add("hidden");
    document.getElementById("otpStep2").classList.remove("hidden");
    document.getElementById("otpCodeInput").focus();
  });

  // ── MASYARAKAT — Langkah 2: Verifikasi OTP ──────────────────────────────
  document.getElementById("formVerifyOtp")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("otpEmail").value.trim();
    const code = document.getElementById("otpCodeInput").value.trim();
    const msgEl = document.getElementById("verifyOtpMsg");
    const btnText = document.getElementById("btnVerifyOtpText");
    const spinner = document.getElementById("btnVerifyOtpSpinner");
    const btn = document.getElementById("btnVerifyOtp");

    showMsg(msgEl, "", "");
    setLoading(btn, btnText, spinner, true);
    const result = await SimpelAuth.submitOtp(email, code);
    setLoading(btn, btnText, spinner, false);

    if (!result.success) { showMsg(msgEl, result.message, "error-state"); return; }

    const apiUser = result.user;
    const localUser = {
      id: apiUser.id, name: apiUser.name, email: apiUser.email,
      role: "citizen", password: null, phone: "", agency: ""
    };
    const existing = state.users.find(u => u.email.toLowerCase() === apiUser.email.toLowerCase());
    if (!existing) state.users.push(localUser);
    state.setCurrentUser(existing || localUser);
    updateAuthUI();
    closeLoginModal();
    showToast("Selamat datang, " + apiUser.name + "! Login berhasil.");
  });

  // ── MASYARAKAT — Kirim Ulang OTP ─────────────────────────────────────────
  document.getElementById("btnResendOtp")?.addEventListener("click", async () => {
    const email = document.getElementById("otpEmail").value.trim();
    const msgEl = document.getElementById("verifyOtpMsg");
    showMsg(msgEl, "Mengirim ulang kode OTP...", "");
    const result = await SimpelAuth.requestOtp(email);
    if (result.success) {
      document.getElementById("otpCodeInput").value = "";
      showMsg(msgEl, "Kode OTP baru telah dikirim ke email Anda.", "success-state");
    } else {
      showMsg(msgEl, result.message, "error-state");
    }
  });

  // ── ADMIN — Login Email + Password ──────────────────────────────────────
  document.getElementById("formAdminLogin")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminLoginEmail").value.trim();
    const password = document.getElementById("adminLoginPassword").value;
    const msgEl = document.getElementById("adminLoginMsg");
    const btnText = document.getElementById("btnAdminLoginText");
    const spinner = document.getElementById("btnAdminLoginSpinner");
    const btn = document.getElementById("btnSubmitAdminLogin");

    showMsg(msgEl, "", "");
    setLoading(btn, btnText, spinner, true);
    const result = await SimpelAuth.adminLogin(email, password);
    setLoading(btn, btnText, spinner, false);

    if (!result.success) { showMsg(msgEl, result.message, "error-state"); return; }

    const apiUser = result.user;
    const adminUser = {
      id: apiUser.id, name: apiUser.name, email: apiUser.email,
      role: "admin", password: password, phone: "", agency: "Admin SIMPEL"
    };
    const existing = state.users.find(u => u.email.toLowerCase() === apiUser.email.toLowerCase());
    if (!existing) state.users.push(adminUser);
    state.setCurrentUser(existing || adminUser);
    updateAuthUI();
    closeLoginModal();
    showToast("Login admin berhasil! Mengalihkan ke Portal Petugas...");
    setTimeout(() => {
      window.location.href = "/admin";
    }, 450);
  });

  // ── LOGOUT ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    document.getElementById("citizenMobileDrawer")?.classList.remove("open");
    document.getElementById("citizenDrawerBackdrop")?.classList.remove("active");
    document.body.style.overflow = "";
    state.setCurrentUser(null);
    updateAuthUI();
    switchTab("tabBeranda");
    showToast("Anda telah keluar dari akun.");
  };

  btnLogout?.addEventListener("click", handleLogout);
  btnDrawerLogout?.addEventListener("click", handleLogout);

  // Terapkan status awal UI
  updateAuthUI();
}

// ── Helper Functions Autentikasi ──────────────────────────────────────────

function resetLoginModal() {
  document.getElementById("loginFlipCard")?.classList.remove("is-flipped");
  document.getElementById("otpStep1")?.classList.remove("hidden");
  document.getElementById("otpStep2")?.classList.add("hidden");
  document.getElementById("formSendOtp")?.reset();
  document.getElementById("formVerifyOtp")?.reset();
  document.getElementById("formAdminLogin")?.reset();
  ["sendOtpMsg", "verifyOtpMsg", "adminLoginMsg"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ""; el.className = "alert-box hidden"; }
  });
}

/** Tutup modal login dan reset state-nya */
function closeLoginModal() {
  document.getElementById("modalLogin")?.classList.add("hidden");
  resetLoginModal();
}

/** Tampilkan pesan pada elemen alert dengan kelas CSS tertentu */
function showMsg(el, text, cssClass) {
  if (!el) return;
  el.textContent = text;
  el.className = "alert-box" + (text ? " " + cssClass : " hidden");
}

/** Toggle loading state: disable tombol, tampilkan/sembunyikan spinner */
function setLoading(btn, textEl, spinnerEl, isLoading) {
  if (!btn) return;
  btn.disabled = isLoading;
  textEl?.classList.toggle("hidden", isLoading);
  spinnerEl?.classList.toggle("hidden", !isLoading);
}

function updateAuthUI() {
  const guestGroup = document.getElementById("guestAuthGroup");
  const userGroup = document.getElementById("userAuthGroup");
  const navLinkAdmin = document.getElementById("navLinkAdmin");
  const userInitial = document.getElementById("userAvatarInitial");
  const userName = document.getElementById("userDisplayName");
  const userRole = document.getElementById("userDisplayRole");

  // Drawer mobile elements (Screenshot 3 style)
  const drawerGuest = document.getElementById("drawerGuestGroup");
  const drawerUser = document.getElementById("drawerUserGroup");
  const drawerInitial = document.getElementById("drawerAvatarInitial");
  const drawerName = document.getElementById("drawerDisplayName");
  const drawerRole = document.getElementById("drawerDisplayRole");
  const drawerLinkAdmin = document.getElementById("drawerLinkAdmin");
  const drawerPetugasTitle = document.getElementById("drawerPetugasTitle");

  if (state.currentUser) {
    guestGroup?.classList.add("hidden");
    userGroup?.classList.remove("hidden");
    drawerGuest?.classList.add("hidden");
    drawerUser?.classList.remove("hidden");

    const initial = (state.currentUser.name || "W").charAt(0).toUpperCase();
    if (userInitial) userInitial.textContent = initial;
    if (drawerInitial) drawerInitial.textContent = initial;

    if (userName) userName.textContent = state.currentUser.name || "Warga SIMPEL";
    if (drawerName) drawerName.textContent = state.currentUser.name || "Warga SIMPEL";

    const isOfficer = state.currentUser.role === "officer" || state.currentUser.role === "admin";
    const roleText = isOfficer ? "Petugas Kota" : "Warga";
    if (userRole) {
      userRole.textContent = roleText;
      userRole.style.color = isOfficer ? "var(--lapor-red-main)" : "#059669";
    }
    if (drawerRole) {
      drawerRole.textContent = roleText;
      drawerRole.style.color = isOfficer ? "var(--lapor-red-main)" : "#059669";
    }

    // Tampilkan nav link Panel Petugas hanya untuk akun Petugas
    if (isOfficer) {
      navLinkAdmin?.classList.remove("hidden");
      drawerLinkAdmin?.classList.remove("hidden");
      drawerPetugasTitle?.classList.remove("hidden");
    } else {
      navLinkAdmin?.classList.add("hidden");
      drawerLinkAdmin?.classList.add("hidden");
      drawerPetugasTitle?.classList.add("hidden");
    }
  } else {
    guestGroup?.classList.remove("hidden");
    userGroup?.classList.add("hidden");
    drawerGuest?.classList.remove("hidden");
    drawerUser?.classList.add("hidden");
    navLinkAdmin?.classList.add("hidden");
    drawerLinkAdmin?.classList.add("hidden");
    drawerPetugasTitle?.classList.add("hidden");
  }
}

window.switchTab = function (tabId) {
  if (tabId === "tabAdmin" && (!state.currentUser || (state.currentUser.role !== "officer" && state.currentUser.role !== "admin"))) {
    showToast("Akses Panel Petugas khusus untuk akun Petugas Kota. Silakan masuk sebagai petugas.");
    document.getElementById("modalLogin")?.classList.remove("hidden");
    return;
  }

  document.querySelectorAll(".tab-page").forEach(page => page.classList.add("hidden"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  document.querySelectorAll(".citizen-side-btn[data-tab]").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
  });

  const targetPage = document.getElementById(tabId);
  if (targetPage) targetPage.classList.remove("hidden");

  const activeLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (activeLink) activeLink.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (tabId === "tabPeta" && state.fullMap) {
    setTimeout(() => state.fullMap.invalidateSize(), 200);
  }
  if (tabId === "tabStatistik") {
    renderStatistics();
  }
  if (tabId === "tabAdmin") {
    renderAdminTable();
  }
};

// 3. Tab Klasifikasi LAPOR!
function initClassificationTabs() {
  const typeBtns = document.querySelectorAll(".type-tab-btn");
  typeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      typeBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      state.activeType = btn.getAttribute("data-type");
      showToast(`Klasifikasi dipilih: ${state.activeType}`);
    });
  });
}

// 4. Form & Foto Lampiran
function initFormAndUpload() {
  const form = document.getElementById("formLapor");
  const fileInput = document.getElementById("fileAttachment");
  const btnTrigger = document.getElementById("btnTriggerUpload");
  const promptBox = document.getElementById("promptAttachment");
  const previewBox = document.getElementById("previewAttachment");
  const previewImg = document.getElementById("imgPreview");
  const btnDelete = document.getElementById("btnDeleteAttach");
  const alertBox = document.getElementById("formFeedbackError");

  btnTrigger.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        showToast("Hanya file gambar (JPG, PNG) yang diperbolehkan.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.activePhotoBase64 = ev.target.result;
        previewImg.src = state.activePhotoBase64;
        promptBox.classList.add("hidden");
        previewBox.classList.remove("hidden");
        showToast("Lampiran foto berhasil diunggah.");
      };
      reader.readAsDataURL(file);
    }
  });

  btnDelete.addEventListener("click", () => {
    state.activePhotoBase64 = "";
    fileInput.value = "";
    previewBox.classList.add("hidden");
    promptBox.classList.remove("hidden");
  });

  const wilayahInput = document.getElementById("selectWilayah");
  const alamatInput = document.getElementById("inputAlamat");
  const anonCheck = document.getElementById("checkAnonim");

  const syncIdentityPreview = () => {
    const isAnon = anonCheck ? anonCheck.checked : false;
    const senderDisplay = document.getElementById("senderAccountNameDisplay");
    const senderSub = document.getElementById("senderIdentitySub");
    if (senderDisplay) {
      if (isAnon) {
        senderDisplay.textContent = "Anonim (Disamarkan dari publik)";
        senderDisplay.style.color = "#64748b";
      } else if (state.currentUser) {
        senderDisplay.textContent = `${state.currentUser.name} (Akun Anda)`;
        senderDisplay.style.color = "#059669";
      } else {
        senderDisplay.textContent = "Warga (Tamu)";
        senderDisplay.style.color = "#1e293b";
      }
    }
    if (senderSub) {
      if (isAnon) {
        senderSub.textContent = "Nama akun Anda tidak akan dipublikasikan. Laporan akan terdaftar atas nama 'Anonim' di Laporan Masuk Terkini.";
      } else if (state.currentUser) {
        senderSub.innerHTML = `Nama akun <strong>${escapeHtml(state.currentUser.name)}</strong> akan tertera secara transparan pada <strong>Laporan Masuk Terkini</strong>.`;
      } else {
        senderSub.textContent = "Masuk ke akun Anda agar nama akun Anda tertera otomatis, atau centang Anonim untuk menyembunyikan identitas.";
      }
    }
  };

  anonCheck?.addEventListener("change", syncIdentityPreview);
  syncIdentityPreview();

  const handleLocationInputChange = () => {
    const query = `${wilayahInput?.value || ""} ${alamatInput?.value || ""}`.trim();
    if (query.length >= 3) {
      resolveCityLocation(query);
    }
  };

  wilayahInput?.addEventListener("input", handleLocationInputChange);
  wilayahInput?.addEventListener("change", handleLocationInputChange);
  alamatInput?.addEventListener("change", handleLocationInputChange);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alertBox.classList.add("hidden");

    const judul = document.getElementById("inputJudul").value.trim();
    const isi = document.getElementById("inputIsi").value.trim();
    const tanggal = document.getElementById("inputTanggal").value;
    const kategori = document.getElementById("selectKategori").value;
    const wilayah = document.getElementById("selectWilayah").value.trim();
    const instansi = document.getElementById("selectInstansi").value;
    const alamat = document.getElementById("inputAlamat").value.trim();
    const isAnon = document.getElementById("checkAnonim").checked;
    const isSecret = document.getElementById("checkRahasia").checked;

    if (!judul || !isi || !tanggal || !kategori || !wilayah || !instansi || !alamat) {
      alertBox.textContent = "Mohon lengkapi seluruh kolom bertanda bintang (*) sebelum mengirim laporan.";
      alertBox.classList.remove("hidden");
      return;
    }

    // Pastikan koordinat sesuai dengan kota/wilayah yang dipilih
    resolveCityLocation(`${wilayah} ${alamat}`);

    if (!state.activePhotoBase64) {
      state.activePhotoBase64 = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%239b0d18'/><text x='200' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff' text-anchor='middle'>Bukti Aduan: ${escapeHtml(kategori)}</text><text x='200' y='150' font-family='sans-serif' font-size='12' fill='%23fecdd3' text-anchor='middle'>${escapeHtml(alamat)}</text></svg>`;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `LAP-2026-${randomNum}`;

    const newReport = {
      id: newId,
      type: state.activeType,
      title: judul,
      description: isi,
      date: tanggal,
      category: kategori,
      district: wilayah,
      agency: instansi,
      address: alamat,
      lat: state.activeCoords.lat,
      lng: state.activeCoords.lng,
      status: "Menunggu Verifikasi",
      reporterName: isAnon ? "Anonim" : (state.currentUser ? state.currentUser.name : "Warga SIMPEL"),
      reporterPhone: isAnon ? "" : (state.currentUser ? state.currentUser.phone : ""),
      isAnonymous: isAnon,
      isSecret: isSecret,
      officerNote: "Laporan baru diterima sistem. Menunggu pemeriksaan verifikator dinas terkait.",
      photoUrl: state.activePhotoBase64
    };

    state.addReport(newReport);
    updateCounterDisplay();
    renderPublicFeed();
    renderFullMapMarkers();
    renderStatistics();

    form.reset();
    state.activePhotoBase64 = "";
    previewBox.classList.add("hidden");
    promptBox.classList.remove("hidden");
    syncIdentityPreview();

    openSuccessModal(newId);
  });
}

function resolveCityLocation(query) {
  if (!query) return false;
  const q = query.toLowerCase();
  for (const [cityName, coords] of Object.entries(INDONESIA_CITY_COORDS)) {
    if (q.includes(cityName)) {
      const jitterLat = Number((coords[0] + (Math.random() - 0.5) * 0.008).toFixed(5));
      const jitterLng = Number((coords[1] + (Math.random() - 0.5) * 0.008).toFixed(5));
      updateFormCoords(jitterLat, jitterLng);
      const hint = document.getElementById("miniMapLocationHint");
      if (hint) hint.textContent = `(Lokasi terdeteksi di area ${cityName.toUpperCase()})`;

      if (state.miniMap) {
        state.miniMap.setView([jitterLat, jitterLng], 13);
        if (state.miniMapMarker) state.miniMapMarker.setLatLng([jitterLat, jitterLng]);
      }
      return true;
    }
  }
  return false;
}

// 5. Mini Leaflet Map Picker
function initMiniMapPicker() {
  const btnToggle = document.getElementById("btnToggleMiniMap");
  const box = document.getElementById("miniMapPickerBox");
  const searchInput = document.getElementById("miniMapSearchInput");
  const btnSearch = document.getElementById("btnSearchMiniMap");
  const btnGps = document.getElementById("btnGpsMiniMap");

  if (!btnToggle || !box) return;

  btnToggle.addEventListener("click", () => {
    box.classList.toggle("hidden");
    if (!box.classList.contains("hidden")) {
      if (!state.miniMap && typeof L !== "undefined") {
        state.miniMap = L.map("formMiniMap").setView([state.activeCoords.lat, state.activeCoords.lng], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap"
        }).addTo(state.miniMap);

        state.miniMapMarker = L.marker([state.activeCoords.lat, state.activeCoords.lng], { draggable: true }).addTo(state.miniMap);

        state.miniMapMarker.on("dragend", (ev) => {
          const pos = ev.target.getLatLng();
          updateFormCoords(pos.lat, pos.lng);
        });

        state.miniMap.on("click", (ev) => {
          state.miniMapMarker.setLatLng(ev.latlng);
          updateFormCoords(ev.latlng.lat, ev.latlng.lng);
        });
      } else if (state.miniMap) {
        state.miniMap.setView([state.activeCoords.lat, state.activeCoords.lng], 13);
        state.miniMapMarker?.setLatLng([state.activeCoords.lat, state.activeCoords.lng]);
      }
      setTimeout(() => state.miniMap?.invalidateSize(), 200);
    }
  });

  const doMiniSearch = () => {
    const val = searchInput?.value.trim();
    if (!val) return;
    if (!resolveCityLocation(val)) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=id&limit=1&q=${encodeURIComponent(val)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = Number(parseFloat(data[0].lat).toFixed(5));
            const lon = Number(parseFloat(data[0].lon).toFixed(5));
            updateFormCoords(lat, lon);
            if (state.miniMap) {
              state.miniMap.setView([lat, lon], 14);
              state.miniMapMarker?.setLatLng([lat, lon]);
            }
            showToast(`Lokasi ditemukan: ${data[0].display_name.split(",")[0]}`);
          } else {
            showToast("Lokasi tidak ditemukan. Coba nama kota/daerah lain.");
          }
        })
        .catch(() => showToast("Gagal mencari lokasi. Silakan geser pin pada peta."));
    } else {
      showToast(`Peta diarahkan ke wilayah ${val}`);
    }
  };

  btnSearch?.addEventListener("click", doMiniSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doMiniSearch();
    }
  });

  btnGps?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showToast("Browser tidak mendukung GPS.");
      return;
    }
    showToast("Mendeteksi koordinat GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        updateFormCoords(lat, lng);
        if (state.miniMap) {
          state.miniMap.setView([lat, lng], 15);
          state.miniMapMarker?.setLatLng([lat, lng]);
        }
        showToast("GPS berhasil disinkronkan!");
      },
      () => showToast("Izin GPS tidak aktif atau lemah.")
    );
  });
}

function updateFormCoords(lat, lng) {
  state.activeCoords = { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
  const label = document.getElementById("miniMapCoordsText");
  if (label) label.textContent = `${state.activeCoords.lat}, ${state.activeCoords.lng}`;
}

// 6. Full Leaflet Map
function initFullLeafletMap() {
  const mapEl = document.getElementById("fullMapLeaflet");
  if (!mapEl || typeof L === "undefined") return;

  state.fullMap = L.map("fullMapLeaflet").setView([state.activeCoords.lat, state.activeCoords.lng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap"
  }).addTo(state.fullMap);

  document.getElementById("filterMapStatus")?.addEventListener("change", renderFullMapMarkers);
  document.getElementById("filterMapCategory")?.addEventListener("change", renderFullMapMarkers);

  renderFullMapMarkers();
}

function renderFullMapMarkers() {
  if (!state.fullMap) return;

  state.fullMapMarkers.forEach(m => state.fullMap.removeLayer(m));
  state.fullMapMarkers = [];

  const filterStatus = document.getElementById("filterMapStatus")?.value || "ALL";
  const filterCat = document.getElementById("filterMapCategory")?.value || "ALL";

  const list = state.reports.filter(r => {
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchCat = filterCat === "ALL" || r.category === filterCat;
    return matchStatus && matchCat;
  });

  const usedCoords = {};
  const latLngs = [];

  list.forEach(item => {
    let lat = Number(item.lat);
    let lng = Number(item.lng);
    if (!lat || !lng) return;

    // Jitter/spiral offset if multiple pins have the exact same coordinates
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

    let pinColor = "#f59e0b";
    if (item.status === "Diproses") pinColor = "#0284c7";
    if (item.status === "Selesai") pinColor = "#059669";
    if (item.status === "Ditolak") pinColor = "#e11d48";

    const customIcon = L.divIcon({
      className: "lapor-pin",
      html: `<div style="background-color:${pinColor}; width:20px; height:20px; border-radius:50%; border:2.5px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.45);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const isAnon = item.isAnonymous || item.reporterName === "Anonim";
    const authorName = escapeHtml(item.reporterName || (isAnon ? "Anonim" : "Warga SIMPEL"));

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(state.fullMap);
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:220px; padding:3px;">
        <span style="font-size:10px; font-weight:800; color:#c1121f;">${escapeHtml(item.type)} - ${escapeHtml(item.id)}</span>
        <h4 style="font-size:13px; font-weight:800; margin:3px 0 4px;">${escapeHtml(item.title)}</h4>
        <p style="font-size:11px; color:#475569; margin-bottom:4px;">Pelapor: <strong>${authorName}</strong></p>
        <p style="font-size:11px; color:#64748b; margin-bottom:6px;">Lokasi: ${escapeHtml(item.address)} (${escapeHtml(item.district)})</p>
        <div style="font-size:11px; margin-bottom:8px;">Status: <span class="status-tag ${getStatusClass(item.status)}" style="padding:2px 6px; font-size:10px;">${escapeHtml(item.status)}</span></div>
        <button type="button" style="background:#c1121f; color:white; border:none; padding:6px 10px; font-size:11px; font-weight:700; border-radius:4px; cursor:pointer; width:100%;" onclick="window.openReportDetailModal('${item.id}')">
          Lihat Detail Aduan &rarr;
        </button>
      </div>
    `);

    state.fullMapMarkers.push(marker);
  });

  // Otomatis pusatkan seluruh titik di layar agar Bandung, Surabaya, dll. langsung terlihat
  if (latLngs.length > 0) {
    const bounds = L.latLngBounds(latLngs);
    state.fullMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

window.trackTicketDirect = function (ticketId) {
  window.openReportDetailModal(ticketId);
};

// 7. Modal Detail Laporan Masyarakat
window.openReportDetailModal = function (id) {
  const report = state.reports.find(r => r.id === id);
  if (!report) return;

  const modal = document.getElementById("modalReportDetail");
  const body = document.getElementById("modalReportDetailBody");
  if (!modal || !body) return;

  const isAnon = report.isAnonymous || report.reporterName === "Anonim";
  const authorName = escapeHtml(report.reporterName || (isAnon ? "Anonim" : "Warga SIMPEL"));

  body.innerHTML = `
    <div class="detail-modal-grid">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <span style="font-size:12px; font-weight:800; color:#c1121f;">${escapeHtml(report.type)} - ${escapeHtml(report.id)}</span>
        <span class="status-tag ${getStatusClass(report.status)}">${escapeHtml(report.status)}</span>
      </div>

      <h3 style="font-size:1.15rem; font-weight:800; margin:0; color:#0f172a;">${escapeHtml(report.title)}</h3>

      <div class="detail-info-card">
        <div class="detail-info-row">
          <span class="detail-info-label">Nama Pengirim</span>
          <span class="detail-info-val" style="display:inline-flex; align-items:center; gap:0.35rem;">
            ${authorName}
            ${isAnon ? '<span class="badge-anonim">Anonim</span>' : '<span class="badge-verified-citizen">Terverifikasi</span>'}
          </span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Wilayah / Kota</span>
          <span class="detail-info-val">${escapeHtml(report.district)}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Alamat / Lokasi</span>
          <span class="detail-info-val">${escapeHtml(report.address)}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Tanggal Kejadian</span>
          <span class="detail-info-val">${report.date}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Kategori</span>
          <span class="detail-info-val">${escapeHtml(report.category)}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Instansi Berwenang</span>
          <span class="detail-info-val">${escapeHtml(report.agency)}</span>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.875rem; font-weight:800; margin-bottom:0.35rem; color:#0f172a;">Deskripsi Aduan / Aspirasi:</h4>
        <p style="font-size:0.85rem; color:#334155; line-height:1.5; background:#f8fafc; padding:0.75rem; border-radius:6px; border:1px solid #e2e8f0;">${escapeHtml(report.description)}</p>
      </div>

      <div class="detail-officer-box">
        <div class="detail-officer-title">Respon &amp; Tindak Lanjut Petugas:</div>
        <p class="detail-officer-text">${escapeHtml(report.officerNote || 'Laporan telah diterima dalam sistem dan sedang dalam antrean verifikasi petugas dinas terkait.')}</p>
      </div>

      <div>
        <h4 style="font-size:0.875rem; font-weight:800; margin-bottom:0.35rem; color:#0f172a;">Bukti Foto Lapangan:</h4>
        <img src="${report.photoUrl}" alt="Bukti aduan" style="max-height:220px; width:100%; object-fit:contain; background:#0f172a; border-radius:6px; border:1px solid #cbd5e1;">
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
};

// 8. Statistik & Rekapitulasi (Screenshot 3)
function renderStatistics() {
  const total = state.reports.length;
  const completed = state.reports.filter(r => r.status === "Selesai").length;

  document.getElementById("kpiStatTotal").textContent = total;
  document.getElementById("kpiStatTuntas").textContent = completed;

  // Donut/Pie Klasifikasi
  const typeCounts = { PENGADUAN: 0, ASPIRASI: 0, "PERMINTAAN INFORMASI": 0 };
  state.reports.forEach(r => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  const chartKlas = document.getElementById("chartKlasifikasi");
  if (chartKlas) {
    chartKlas.innerHTML = `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <svg width="120" height="120" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="5"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#c1121f" stroke-width="5" stroke-dasharray="${(typeCounts.PENGADUAN / total) * 100}, 100"/>
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
    const pendingCount = state.reports.filter(r => r.status === "Menunggu Verifikasi").length;
    const processCount = state.reports.filter(r => r.status === "Diproses").length;

    chartStatPie.innerHTML = `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <svg width="120" height="120" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="5"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="${(completed / total) * 100}, 100"/>
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
    state.reports.forEach(r => catCounts[r.category] = (catCounts[r.category] || 0) + 1);

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
    state.reports.forEach(r => distCounts[r.district] = (distCounts[r.district] || 0) + 1);

    distBars.innerHTML = Object.entries(distCounts).map(([dist, c]) => {
      const pct = Math.round((c / total) * 100);
      return `
        <div class="stacked-bar-item">
          <div class="bar-labels-row">
            <span>${escapeHtml(dist)}</span>
            <span>${c} aduan (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-progress-red" style="width: ${pct}%; background:#0284c7;"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

// 9. Umpan Laporan Publik di Beranda
function renderPublicFeed() {
  const container = document.getElementById("homeRecentReports");
  if (!container) return;

  const topRecent = state.reports.slice(0, 9);
  container.innerHTML = topRecent.map(item => {
    const isAnon = item.isAnonymous || item.reporterName === "Anonim";
    const authorName = escapeHtml(item.reporterName || (isAnon ? "Anonim" : "Warga SIMPEL"));

    return `
    <article class="lapor-card-feed" tabindex="0" onclick="window.openReportDetailModal('${item.id}')" title="Klik untuk melihat transparansi proses aduan ini">
      <img src="${item.photoUrl}" alt="Bukti aduan" class="feed-thumb">
      <div class="feed-content">
        <div class="feed-meta-row">
          <span class="cat-pill">${escapeHtml(item.category)}</span>
          <span class="status-tag ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <h4 class="feed-title">${escapeHtml(item.title)}</h4>
        <p class="feed-text">${escapeHtml(item.description)}</p>

        <div class="feed-author-row">
          <div class="feed-author-user">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Pelapor: <strong>${authorName}</strong></span>
          </div>
          ${isAnon ? '<span class="badge-anonim">Anonim</span>' : '<span class="badge-verified-citizen">Terverifikasi</span>'}
        </div>

        <div class="feed-footer">
          <span>${escapeHtml(item.district)}</span>
          <span>${item.date}</span>
        </div>
      </div>
    </article>
    `;
  }).join("");
}

// 10. Meja Kerja Admin & Petugas Kota
function initAdminDesk() {
  const search = document.getElementById("adminSearchInput");
  const pills = document.querySelectorAll(".tab-pill");
  const refreshBtn = document.getElementById("btnRefreshAdmin");
  const exportBtn = document.getElementById("btnExportAdminPDF") || document.getElementById("btnExportAdminCSV");

  search?.addEventListener("input", renderAdminTable);

  pills.forEach(p => {
    p.addEventListener("click", () => {
      pills.forEach(b => b.classList.remove("active"));
      p.classList.add("active");
      renderAdminTable();
    });
  });

  refreshBtn?.addEventListener("click", () => {
    renderAdminTable();
    showToast("Data meja kerja petugas berhasil disegarkan.");
  });

  exportBtn?.addEventListener("click", exportReportsPDF);
}

function renderAdminTable() {
  // Perbarui Kartu Ringkasan KPI Petugas
  const kpiTotal = document.getElementById("petugasKpiTotal");
  const kpiPending = document.getElementById("petugasKpiPending");
  const kpiProcess = document.getElementById("petugasKpiProcess");
  const kpiDone = document.getElementById("petugasKpiDone");

  if (kpiTotal) kpiTotal.textContent = state.reports.length;
  if (kpiPending) kpiPending.textContent = state.reports.filter(r => r.status === "Menunggu Verifikasi").length;
  if (kpiProcess) kpiProcess.textContent = state.reports.filter(r => r.status === "Diproses").length;
  if (kpiDone) kpiDone.textContent = state.reports.filter(r => r.status === "Selesai").length;

  const tbody = document.getElementById("adminReportsTableBody");
  if (!tbody) return;

  const activePill = document.querySelector(".tab-pill.active")?.getAttribute("data-status") || "ALL";
  const query = (document.getElementById("adminSearchInput")?.value || "").toLowerCase();

  const filtered = state.reports.filter(r => {
    const matchStatus = activePill === "ALL" || r.status === activePill;
    const matchSearch = r.id.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.district.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.id)}</strong></td>
      <td>${item.date}</td>
      <td>${escapeHtml(item.category)}<br><small style="color:var(--text-muted);">${escapeHtml(item.district)}</small></td>
      <td><strong>${escapeHtml(item.title)}</strong></td>
      <td><img src="${item.photoUrl}" alt="Thumb" class="table-photo-thumb"></td>
      <td><span class="status-tag ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span></td>
      <td>
        <button type="button" class="btn-outline-red btn-sm" onclick="window.openActionModal('${item.id}')">
          Tindak Lanjut
        </button>
      </td>
    </tr>
  `).join("");
}

window.openActionModal = function (id) {
  const report = state.reports.find(r => r.id === id);
  if (!report) return;

  const modal = document.getElementById("modalActionPetugas");
  const body = document.getElementById("modalActionBody");

  body.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <div style="background:var(--surface-subtle); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-medium);">
        <span style="font-size:11px; font-weight:800; color:#c1121f;">${escapeHtml(report.id)}</span>
        <h4 style="font-size:14px; font-weight:800; margin:3px 0;">${escapeHtml(report.title)}</h4>
        <p style="font-size:12px; color:var(--text-body);">${escapeHtml(report.description)}</p>
        <p style="font-size:11px; color:var(--text-muted); margin-top:4px;">Lokasi: ${escapeHtml(report.address)} (${escapeHtml(report.district)})</p>
      </div>

      <div class="form-field">
        <label class="field-label">Perbarui Status Penanganan:</label>
        <select id="modalNewStatus" class="field-select">
          <option value="Menunggu Verifikasi" ${report.status === "Menunggu Verifikasi" ? "selected" : ""}>Menunggu Verifikasi (Pending)</option>
          <option value="Diproses" ${report.status === "Diproses" ? "selected" : ""}>Verifikasi & Mulai Diproses</option>
          <option value="Selesai" ${report.status === "Selesai" ? "selected" : ""}>Tandai Selesai Ditangani</option>
          <option value="Ditolak" ${report.status === "Ditolak" ? "selected" : ""}>Tolak Aduan</option>
        </select>
      </div>

      <div class="form-field">
        <label class="field-label">Catatan Resmi Petugas / Tindakan Lapangan:</label>
        <textarea id="modalOfficerNote" class="field-textarea" rows="3">${escapeHtml(report.officerNote || "")}</textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
        <button type="button" class="btn-outline-red btn-sm" onclick="window.closeActionModal()">Batal</button>
        <button type="button" class="btn-lapor-submit btn-sm" onclick="window.saveActionModal('${report.id}')">Simpan Tindak Lanjut</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
};

window.closeActionModal = function () {
  document.getElementById("modalActionPetugas")?.classList.add("hidden");
};

window.saveActionModal = function (id) {
  const status = document.getElementById("modalNewStatus").value;
  const note = document.getElementById("modalOfficerNote").value.trim();

  state.updateReport(id, status, note);
  window.closeActionModal();

  renderAdminTable();
  renderFullMapMarkers();
  renderPublicFeed();
  renderStatistics();

  showToast(`Status laporan ${id} berhasil diperbarui.`);
};

// 11. Modal Panduan & Sukses
function initModals() {
  document.getElementById("btnOpenGuide")?.addEventListener("click", openPanduanModal);
  document.getElementById("btnClosePanduan")?.addEventListener("click", closePanduanModal);
  document.getElementById("btnCloseModalAction")?.addEventListener("click", window.closeActionModal);
  document.getElementById("btnCloseSuccessModal")?.addEventListener("click", closeSuccessModal);
  document.getElementById("btnDoneSubmitModal")?.addEventListener("click", closeSuccessModal);
  document.getElementById("btnCloseReportDetail")?.addEventListener("click", () => {
    document.getElementById("modalReportDetail")?.classList.add("hidden");
  });

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

window.openPanduanModal = function () {
  document.getElementById("modalPanduan")?.classList.remove("hidden");
};

function closePanduanModal() {
  document.getElementById("modalPanduan")?.classList.add("hidden");
}

function openSuccessModal(ticketCode) {
  const modal = document.getElementById("modalSuccessReport");
  const codeEl = document.getElementById("successTicketCode");
  if (!modal || !codeEl) return;

  codeEl.textContent = ticketCode;
  modal.classList.remove("hidden");

  const btnView = document.getElementById("btnViewRecentReports") || document.getElementById("btnTrackSubmittedTicket");
  if (btnView) {
    btnView.onclick = () => {
      modal.classList.add("hidden");
      switchTab("tabBeranda");
      setTimeout(() => {
        document.getElementById("homeRecentReportsSection")?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    };
  }
}

function closeSuccessModal() {
  document.getElementById("modalSuccessReport")?.classList.add("hidden");
}

// 12. Helper Counter Display
function updateCounterDisplay() {
  const countEl = document.getElementById("hugeCounter");
  if (countEl) {
    countEl.textContent = state.baseCounter.toLocaleString("id-ID");
  }
}

// 13. CSV Export
function exportReportsCSV() {
  const headers = ["No. Tiket", "Tipe", "Tanggal", "Kategori", "Instansi", "Judul", "Alamat", "Wilayah", "Status", "Catatan Petugas"];
  const rows = state.reports.map(r => [
    `"${r.id}"`,
    `"${r.type}"`,
    `"${r.date}"`,
    `"${r.category}"`,
    `"${r.agency}"`,
    `"${r.title.replace(/"/g, '""')}"`,
    `"${r.address.replace(/"/g, '""')}"`,
    `"${r.district}"`,
    `"${r.status}"`,
    `"${(r.officerNote || '').replace(/"/g, '""')}"`
  ]);

  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encoded = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", `Rekap_SIPELIK_LAPOR_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("File CSV rekapitulasi berhasil diunduh.");
}

// 14. Utilities
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
