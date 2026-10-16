<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Buat instance Mailable baru.
     *
     * @param  string  $otpCode  Kode OTP 6 digit yang akan dikirim
     */
    public function __construct(
        public readonly string $otpCode,
    ) {}

    /**
     * Judul dan pengirim email.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kode OTP Login SIMPEL',
        );
    }

    /**
     * Konten email menggunakan Blade view.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.otp',
            with: [
                'otpCode' => $this->otpCode,
            ],
        );
    }

    /**
     * Lampiran email (tidak ada).
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
