<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\OtpController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — SIMPEL Authentication
|--------------------------------------------------------------------------
|
| Rute autentikasi SIMPEL:
|
| Masyarakat (Passwordless via OTP Email):
|   POST /api/send-otp      → Kirim kode OTP ke email
|   POST /api/verify-otp    → Verifikasi OTP dan login / daftar otomatis
|
| Admin (Email + Password Standar):
|   POST /api/admin/login   → Login admin dengan kredensial
|
*/

// ── Autentikasi Masyarakat via OTP ─────────────────────────────────────────
Route::post('/send-otp', [OtpController::class, 'sendOtp'])
    ->name('otp.send');

Route::post('/verify-otp', [OtpController::class, 'verifyOtp'])
    ->name('otp.verify');

// ── Autentikasi Admin via Email + Password ──────────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])
        ->name('login');
});
