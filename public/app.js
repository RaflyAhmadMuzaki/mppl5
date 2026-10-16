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
const SIMPEL_API_BASE = (window.SIMPEL_API_BASE || 'http://localhost:8000') + '/api';

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
    isAnonymous: true,
    isSecret: true,
    officerNote: "Satpol PP dan petugas dinas mendatangi lokasi dan memberikan sanksi peringatan.",
    photoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%233f3f46'/><text x='200' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'>Bukti Polusi Asap</text><text x='200' y='150' font-family='sans-serif' font-size='12' fill='%23f4f4f5' text-anchor='middle'>Lokasi: Blok C Pergudangan</text></svg>"
  }
];

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

  loadReports() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(SEED_DATA));
    return [...SEED_DATA];
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



// 2. Tab Navigation
function initTabsNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetTab = link.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  initAuthSystem();

  document.getElementById("btnLearnFlow")?.addEventListener("click", () => {
    switchTab("tabTentang");
  });
}

// Sistem Autentikasi Pengguna — Card Flip OTP (Masyarakat) + Password (Admin)
function initAuthSystem() {
  const btnOpenLogin    = document.getElementById("btnOpenLogin");
  const btnOpenRegister = document.getElementById("btnOpenRegister");
  const btnLogout       = document.getElementById("btnLogout");
  const modalLogin      = document.getElementById("modalLogin");

  // Buka modal login (Masyarakat OTP) saat klik "Masuk" atau "Daftar" (Opsi B)
  const openAuthModal = () => {
    resetLoginModal();
    modalLogin?.classList.remove("hidden");
  };

  btnOpenLogin?.addEventListener("click", openAuthModal);
  btnOpenRegister?.addEventListener("click", openAuthModal);

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
    const email   = document.getElementById("otpEmail").value.trim();
    const msgEl   = document.getElementById("sendOtpMsg");
    const btnText = document.getElementById("btnSendOtpText");
    const spinner = document.getElementById("btnSendOtpSpinner");
    const btn     = document.getElementById("btnSendOtp");

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
    const email   = document.getElementById("otpEmail").value.trim();
    const code    = document.getElementById("otpCodeInput").value.trim();
    const msgEl   = document.getElementById("verifyOtpMsg");
    const btnText = document.getElementById("btnVerifyOtpText");
    const spinner = document.getElementById("btnVerifyOtpSpinner");
    const btn     = document.getElementById("btnVerifyOtp");

    showMsg(msgEl, "", "");
    setLoading(btn, btnText, spinner, true);
    const result = await SimpelAuth.submitOtp(email, code);
    setLoading(btn, btnText, spinner, false);

    if (!result.success) { showMsg(msgEl, result.message, "error-state"); return; }

    const apiUser   = result.user;
    const localUser = { id: apiUser.id, name: apiUser.name, email: apiUser.email,
                        role: "citizen", password: null, phone: "", agency: "" };
    const existing  = state.users.find(u => u.email.toLowerCase() === apiUser.email.toLowerCase());
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
    const email    = document.getElementById("adminLoginEmail").value.trim();
    const password = document.getElementById("adminLoginPassword").value;
    const msgEl    = document.getElementById("adminLoginMsg");
    const btnText  = document.getElementById("btnAdminLoginText");
    const spinner  = document.getElementById("btnAdminLoginSpinner");
    const btn      = document.getElementById("btnSubmitAdminLogin");

    showMsg(msgEl, "", "");
    setLoading(btn, btnText, spinner, true);
    const result = await SimpelAuth.adminLogin(email, password);
    setLoading(btn, btnText, spinner, false);

    if (!result.success) { showMsg(msgEl, result.message, "error-state"); return; }

    const apiUser   = result.user;
    const adminUser = { id: apiUser.id, name: apiUser.name, email: apiUser.email,
                        role: "admin", password: password, phone: "", agency: "Admin SIMPEL" };
    const existing  = state.users.find(u => u.email.toLowerCase() === apiUser.email.toLowerCase());
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
  btnLogout?.addEventListener("click", () => {
    state.setCurrentUser(null);
    updateAuthUI();
    switchTab("tabBeranda");
    showToast("Anda telah keluar dari akun.");
  });

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
  ["sendOtpMsg","verifyOtpMsg","adminLoginMsg"].forEach(id => {
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
  el.className   = "alert-box" + (text ? " " + cssClass : " hidden");
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

  if (state.currentUser) {
    guestGroup?.classList.add("hidden");
    userGroup?.classList.remove("hidden");

    if (userInitial) userInitial.textContent = state.currentUser.name.charAt(0).toUpperCase();
    if (userName) userName.textContent = state.currentUser.name;
    if (userRole) {
      const isOfficer = state.currentUser.role === "officer" || state.currentUser.role === "admin";
      userRole.textContent = isOfficer ? "Petugas Kota" : "Warga";
      userRole.style.color = isOfficer ? "var(--lapor-red-main)" : "#059669";
    }

    // Tampilkan nav link Panel Petugas hanya untuk akun Petugas
    if (state.currentUser.role === "officer" || state.currentUser.role === "admin") {
      navLinkAdmin?.classList.remove("hidden");
    } else {
      navLinkAdmin?.classList.add("hidden");
    }
  } else {
    guestGroup?.classList.remove("hidden");
    userGroup?.classList.add("hidden");
    navLinkAdmin?.classList.add("hidden");
  }
}

window.switchTab = function(tabId) {
  if (tabId === "tabAdmin" && (!state.currentUser || (state.currentUser.role !== "officer" && state.currentUser.role !== "admin"))) {
    showToast("Akses Panel Petugas khusus untuk akun Petugas Kota. Silakan masuk sebagai petugas.");
    document.getElementById("modalLogin")?.classList.remove("hidden");
    return;
  }

  document.querySelectorAll(".tab-page").forEach(page => page.classList.add("hidden"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alertBox.classList.add("hidden");

    const judul = document.getElementById("inputJudul").value.trim();
    const isi = document.getElementById("inputIsi").value.trim();
    const tanggal = document.getElementById("inputTanggal").value;
    const kategori = document.getElementById("selectKategori").value;
    const wilayah = document.getElementById("selectWilayah").value;
    const instansi = document.getElementById("selectInstansi").value;
    const alamat = document.getElementById("inputAlamat").value.trim();
    const isAnon = document.getElementById("checkAnonim").checked;
    const isSecret = document.getElementById("checkRahasia").checked;

    if (!judul || !isi || !tanggal || !kategori || !wilayah || !instansi || !alamat) {
      alertBox.textContent = "Mohon lengkapi seluruh kolom bertanda bintang (*) sebelum mengirim laporan.";
      alertBox.classList.remove("hidden");
      return;
    }

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
      reporterName: isAnon ? "Anonim" : (state.currentUser ? state.currentUser.name : "Warga Kota"),
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

    openSuccessModal(newId);
  });
}

// 5. Mini Leaflet Map Picker
function initMiniMapPicker() {
  const btnToggle = document.getElementById("btnToggleMiniMap");
  const box = document.getElementById("miniMapPickerBox");
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
      }
      setTimeout(() => state.miniMap?.invalidateSize(), 200);
    }
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

  state.fullMap = L.map("fullMapLeaflet").setView([state.activeCoords.lat, state.activeCoords.lng], 13);

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

  list.forEach(item => {
    let pinColor = "#f59e0b";
    if (item.status === "Diproses") pinColor = "#0284c7";
    if (item.status === "Selesai") pinColor = "#059669";
    if (item.status === "Ditolak") pinColor = "#e11d48";

    const customIcon = L.divIcon({
      className: "lapor-pin",
      html: `<div style="background-color:${pinColor}; width:18px; height:18px; border-radius:50%; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(state.fullMap);
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:200px;">
        <span style="font-size:10px; font-weight:800; color:#c1121f;">${escapeHtml(item.type)} - ${escapeHtml(item.id)}</span>
        <h4 style="font-size:13px; font-weight:800; margin:3px 0;">${escapeHtml(item.title)}</h4>
        <p style="font-size:11px; color:#64748b; margin-bottom:6px;">${escapeHtml(item.address)} (${escapeHtml(item.district)})</p>
        <div style="font-size:11px; margin-bottom:8px;">Status: <strong>${escapeHtml(item.status)}</strong></div>
        <button type="button" style="background:#c1121f; color:white; border:none; padding:4px 8px; font-size:11px; font-weight:700; border-radius:3px; cursor:pointer;" onclick="window.trackTicketDirect('${item.id}')">
          Lacak Tiket Ini
        </button>
      </div>
    `);

    state.fullMapMarkers.push(marker);
  });
}

window.trackTicketDirect = function(ticketId) {
  switchTab("tabLacak");
  const input = document.getElementById("inputKodeTiket");
  if (input) {
    input.value = ticketId;
    doSearchTicket(ticketId);
  }
};

// 7. Pelacakan Tiket
function initTicketSearch() {
  const btn = document.getElementById("btnCariTiket");
  const input = document.getElementById("inputKodeTiket");

  btn.addEventListener("click", () => doSearchTicket(input.value.trim()));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearchTicket(input.value.trim());
  });
}

function doSearchTicket(code) {
  const emptyBox = document.getElementById("trackEmptyNotice");
  const detailBox = document.getElementById("trackDetailContainer");

  if (!code) {
    emptyBox.classList.remove("hidden");
    detailBox.classList.add("hidden");
    showToast("Masukkan nomor tiket aduan.");
    return;
  }

  const report = state.reports.find(r => r.id.toLowerCase() === code.toLowerCase());

  if (!report) {
    emptyBox.classList.remove("hidden");
    emptyBox.innerHTML = `
      <h4 class="empty-title">Tiket "${escapeHtml(code)}" Tidak Ditemukan</h4>
      <p class="empty-desc">Pastikan nomor tiket sudah sesuai dengan format LAP-2026-XXXX.</p>
    `;
    detailBox.classList.add("hidden");
    return;
  }

  emptyBox.classList.add("hidden");
  detailBox.classList.remove("hidden");

  let step2Active = report.status === "Diproses" || report.status === "Selesai";
  let step3Active = report.status === "Diproses" || report.status === "Selesai";
  let step4Active = report.status === "Selesai";

  detailBox.innerHTML = `
    <div class="ticket-head-bar">
      <div>
        <span class="ticket-reg-code">${escapeHtml(report.id)}</span>
        <h3 style="font-size:1.125rem; font-weight:800; margin-top:2px;">${escapeHtml(report.title)}</h3>
        <p style="font-size:0.8125rem; color:var(--text-muted);">${escapeHtml(report.address)} (${escapeHtml(report.district)})</p>
      </div>
      <div>
        <span class="status-tag ${getStatusClass(report.status)}">${escapeHtml(report.status)}</span>
      </div>
    </div>

    <!-- 4 Stepper Alur -->
    <div class="stepper-flow">
      <div class="stepper-step active">
        <span class="step-num-badge">Langkah 1</span>
        <span class="step-label">Tulis Laporan</span>
        <span class="step-time">${report.date}</span>
      </div>
      <div class="stepper-step ${step2Active ? 'active' : ''}">
        <span class="step-num-badge">Langkah 2</span>
        <span class="step-label">Proses Verifikasi</span>
        <span class="step-time">${step2Active ? 'Selesai diverifikasi' : 'Menunggu antrean'}</span>
      </div>
      <div class="stepper-step ${step3Active ? 'active' : ''}">
        <span class="step-num-badge">Langkah 3</span>
        <span class="step-label">Tindak Lanjut</span>
        <span class="step-time">${step3Active ? 'Regu lapangan bertindak' : 'Proses penjadwalan'}</span>
      </div>
      <div class="stepper-step ${step4Active ? 'active' : ''}">
        <span class="step-num-badge">Langkah 4</span>
        <span class="step-label">Selesai Ditangani</span>
        <span class="step-time">${step4Active ? 'Tuntas' : 'Dalam pengerjaan'}</span>
      </div>
    </div>

    <!-- Catatan Resmi Petugas -->
    <div class="officer-note-card">
      <div class="officer-note-header">Tindak Lanjut Resmi Instansi: ${escapeHtml(report.agency)}</div>
      <p style="font-size:0.875rem; color:var(--text-title);">${escapeHtml(report.officerNote || 'Menunggu tanggapan dari petugas.')}</p>
    </div>

    <!-- Bukti Foto -->
    <div>
      <h4 style="font-size:0.875rem; font-weight:800; margin-bottom:0.375rem;">Lampiran Bukti Lapangan:</h4>
      <img src="${report.photoUrl}" alt="Bukti aduan" style="max-height:220px; border-radius:var(--radius-sm); border:1px solid var(--border-medium);">
    </div>
  `;
}

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
    const pendingCount = state.reports.filter(r => r.status === "Menunggu Verifikasi").length;
    const processCount = state.reports.filter(r => r.status === "Diproses").length;

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

  const topRecent = state.reports.slice(0, 6);
  container.innerHTML = topRecent.map(item => `
    <article class="lapor-card-feed" tabindex="0">
      <img src="${item.photoUrl}" alt="Bukti aduan" class="feed-thumb">
      <div class="feed-content">
        <div class="feed-meta-row">
          <span class="cat-pill">${escapeHtml(item.category)}</span>
          <span class="status-tag ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <h4 class="feed-title">${escapeHtml(item.title)}</h4>
        <p class="feed-text">${escapeHtml(item.description)}</p>
        <div class="feed-footer">
          <span>${escapeHtml(item.district)}</span>
          <span>${item.date}</span>
        </div>
      </div>
    </article>
  `).join("");
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

window.openActionModal = function(id) {
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

window.closeActionModal = function() {
  document.getElementById("modalActionPetugas")?.classList.add("hidden");
};

window.saveActionModal = function(id) {
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

window.openPanduanModal = function() {
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

  document.getElementById("btnTrackSubmittedTicket").onclick = () => {
    modal.classList.add("hidden");
    window.trackTicketDirect(ticketCode);
  };
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
