<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpCode extends Model
{
    /**
     * Kolom yang bisa diisi secara mass assignment.
     *
     * @var array<string>
     */
    protected $fillable = [
        'email',
        'otp_code',
        'expires_at',
        'is_used',
    ];

    /**
     * Cast tipe data kolom.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'is_used'    => 'boolean',
        ];
    }

    /**
     * Cek apakah OTP ini sudah kedaluwarsa.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
