<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan kolom role dan membuat password nullable pada tabel users.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Tambah kolom role hanya jika belum ada
            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('masyarakat')->after('email');
            }
            // Buat password nullable hanya jika kolom ada dan belum nullable
            $table->string('password')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
            $table->string('password')->nullable(false)->change();
        });
    }

};
