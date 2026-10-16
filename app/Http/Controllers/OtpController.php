<?php

namespace App\Http\Controllers;

use App\Mail\SendOtpMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    /**
     * POST /api/send-otp
     *
     * Membuat kode OTP 6 digit, menyimpan ke tabel otp_codes,
     * dan mengirim email ke alamat yang diberikan.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        // Validasi payload JSON
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = $validated['email'];

        // Nonaktifkan semua OTP lama yang belum digunakan untuk email ini
        OtpCode::where('email', $email)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        // Generate kode OTP 6 digit acak (zero-padded)
        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Simpan OTP baru ke database, expired dalam 5 menit
        OtpCode::create([
            'email'      => $email,
            'otp_code'   => $otpCode,
            'expires_at' => now()->addMinutes(5),
            'is_used'    => false,
        ]);

        // Kirim email OTP
        Mail::to($email)->send(new SendOtpMail($otpCode));

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP telah dikirim ke email ' . $email . '. Berlaku selama 5 menit.',
        ]);
    }

    /**
     * POST /api/verify-otp
     *
     * Memverifikasi kode OTP, lalu membuat atau mengambil akun user masyarakat.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        // Validasi payload JSON
        $validated = $request->validate([
            'email'    => ['required', 'email', 'max:255'],
            'otp_code' => ['required', 'string', 'size:6'],
        ]);

        $email   = $validated['email'];
        $otpCode = $validated['otp_code'];

        // Cari OTP yang valid: cocok, belum digunakan, dan belum expired
        $otp = OtpCode::where('email', $email)
            ->where('otp_code', $otpCode)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (! $otp) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kedaluwarsa. Mohon minta kode baru.',
            ], 422);
        }

        // Tandai OTP sebagai sudah digunakan
        $otp->update(['is_used' => true]);

        // Cari atau buat user baru dengan role 'masyarakat'
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                // Ambil nama dari bagian sebelum @ sebagai nama default
                'name'     => ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $email)[0])),
                'password' => null,
                'role'     => 'masyarakat',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }
}
