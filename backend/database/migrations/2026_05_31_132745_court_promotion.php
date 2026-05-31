<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('court_promotions', function (Blueprint $table) {
            $table->id();

            // Defines the BIGINT UNSIGNED column and the cascading foreign key
            $table->foreignId('court_id')
                  ->constrained('courts')
                  ->cascadeOnDelete();

            $table->dateTime('start_date');
            $table->dateTime('end_date');

            $table->enum('status', ['pending', 'active', 'expired', 'cancelled'])
                  ->default('pending');

            // Automatically creates created_at and updated_at TIMESTAMP columns
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drops the table (and its foreign key constraints) if you rollback
        Schema::dropIfExists('court_promotions');
    }
};
