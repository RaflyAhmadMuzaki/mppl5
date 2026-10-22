<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Login SIMPEL</title>
    <style>
        /* Reset & Base */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8;
            color: #1a202c;
            padding: 24px;
        }

        /* Wrapper */
        .wrapper {
            max-width: 560px;
            margin: 0 auto;
        }

        /* Card utama */
        .card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        /* Header dengan gradient */
        .header {
            background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
            padding: 36px 40px 32px;
            text-align: center;
        }
        .header-logo {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            padding: 10px 20px;
            margin-bottom: 16px;
        }
        .header-logo span {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 2px;
        }
        .header h1 {
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
            opacity: 0.9;
            margin: 0;
        }
        .header p {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 4px;
        }

        /* Body */
        .body {
            padding: 36px 40px;
        }
        .greeting {
            font-size: 15px;
            color: #4a5568;
            line-height: 1.7;
            margin-bottom: 28px;
        }

        /* Kotak OTP */
        .otp-container {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px dashed #93c5fd;
            border-radius: 12px;
            padding: 28px 20px;
            text-align: center;
            margin-bottom: 28px;
        }
        .otp-label {
            font-size: 12px;
            font-weight: 600;
            color: #3b82f6;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }
        .otp-code {
            font-size: 48px;
            font-weight: 800;
            letter-spacing: 10px;
            color: #1e40af;
            font-family: 'Courier New', Courier, monospace;
            line-height: 1;
            text-shadow: 0 2px 4px rgba(30, 64, 175, 0.15);
        }
        .otp-expiry {
            font-size: 12px;
            color: #6b7280;
            margin-top: 12px;
        }
        .otp-expiry strong {
            color: #ef4444;
        }

        /* Info Box */
        .info-box {
            background: #fefce8;
            border-left: 4px solid #f59e0b;
            border-radius: 0 8px 8px 0;
            padding: 14px 18px;
            margin-bottom: 28px;
        }
        .info-box p {
            font-size: 13px;
            color: #78350f;
            line-height: 1.6;
        }

        /* Langkah-langkah */
        .steps {
            margin-bottom: 28px;
        }
        .steps h3 {
            font-size: 13px;
            font-weight: 700;
            color: #374151;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .step-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 10px;
        }
        .step-number {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            background: #2563eb;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .step-text {
            font-size: 13px;
            color: #4a5568;
            line-height: 1.6;
            padding-top: 2px;
        }

        /* Footer */
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 40px;
            text-align: center;
        }
        .footer p {
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.7;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        .footer .app-name {
            font-weight: 700;
            color: #1e3a5f;
        }

        /* Divider */
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 0 0 28px;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">

        {{-- ===== HEADER ===== --}}
        <div class="header">
            <div class="header-logo">
                <span>SIMPEL</span>
            </div>
            <h1>Kode Verifikasi Login</h1>
            <p>Sistem Pelaporan Lingkungan Kota</p>
        </div>

        {{-- ===== BODY ===== --}}
        <div class="body">

            <p class="greeting">
                Halo! Kami menerima permintaan login ke akun SIMPEL Anda.
                Gunakan kode OTP berikut untuk masuk ke aplikasi:
            </p>

            {{-- Kotak kode OTP --}}
            <div class="otp-container">
                <p class="otp-label">Kode OTP Anda</p>
                <div class="otp-code">{{ $otpCode }}</div>
                <p class="otp-expiry">
                    Kode ini berlaku selama <strong>5 menit</strong> sejak email diterima.
                </p>
            </div>

            {{-- Peringatan keamanan --}}
            <div class="info-box">
                <p>
                    <strong>PENTING: Jangan bagikan kode ini kepada siapapun</strong>, termasuk
                    petugas SIMPEL. Tim kami tidak akan pernah meminta kode OTP Anda melalui
                    telepon, SMS, atau chat.
                </p>
            </div>

            <div class="divider"></div>

            {{-- Langkah penggunaan --}}
            <div class="steps">
                <h3>Cara Menggunakan Kode OTP</h3>
                <div class="step-item">
                    <div class="step-number">1</div>
                    <p class="step-text">Kembali ke halaman login SIMPEL di browser Anda.</p>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <p class="step-text">Masukkan kode <strong>{{ $otpCode }}</strong> pada kolom verifikasi OTP.</p>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <p class="step-text">Klik tombol <strong>Verifikasi</strong> untuk masuk ke akun Anda.</p>
                </div>
            </div>

            <p class="greeting" style="font-size: 13px; color: #6b7280;">
                Jika Anda tidak meminta kode ini, abaikan email ini. Akun Anda tetap aman.
            </p>

        </div>

        {{-- ===== FOOTER ===== --}}
        <div class="footer">
            <p>
                Email ini dikirim secara otomatis oleh sistem
                <span class="app-name">SIMPEL</span> — Sistem Pelaporan Lingkungan Kota.<br>
                Mohon jangan membalas email ini. Butuh bantuan?
                <a href="#">Hubungi dukungan kami</a>.
            </p>
            <p style="margin-top: 8px;">
                &copy; {{ date('Y') }} SIMPEL. Semua hak dilindungi.
            </p>
        </div>

    </div>
</div>
</body>
</html>
