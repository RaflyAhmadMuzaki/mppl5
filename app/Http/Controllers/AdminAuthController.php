<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    /**
     * POST /api/admin/login
     *
     * Autentikasi admin menggunakan email + password standar.
     * Hanya user dengan role 'admin' yang diizinkan login di sini.
     */
    public function login(Request $request): JsonResponse
    {
        // Validasi payload JSON
        $validated = $request->validate([
            'email'    => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        // Cari user admin berdasarkan email
        $admin = User::where('email', $validated['email'])
            ->where('role', 'admin')
            ->first();

        // Verifikasi user ditemukan dan password cocok
        if (! $admin || ! Hash::check($validated['password'], $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah, atau akun tidak memiliki hak akses admin.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login admin berhasil.',
            'user'    => [
                'id'    => $admin->id,
                'name'  => $admin->name,
                'email' => $admin->email,
                'role'  => $admin->role,
            ],
        ]);
    }
}
