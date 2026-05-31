<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CourtPromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Fetch existing court IDs to prevent foreign key constraint errors
        $courtIds = DB::table('courts')->pluck('id');

        // Check if there are actually courts in the database
        if ($courtIds->isEmpty()) {
            $this->command->warn('No courts found in the database. Please run your Court seeder first.');
            return;
        }

        // 2. Safely grab up to two different court IDs (or fallback to the first one)
        $firstCourtId = $courtIds->first();
        $secondCourtId = $courtIds->count() > 1 ? $courtIds[1] : $firstCourtId;

        DB::table('court_promotions')->insert([
            [
                'court_id' => $firstCourtId,
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(5),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $secondCourtId,
                'start_date' => Carbon::now()->subDays(14),
                'end_date' => Carbon::now()->subDays(7),
                'status' => 'expired',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $firstCourtId,
                'start_date' => Carbon::now()->addDays(6),
                'end_date' => Carbon::now()->addDays(13),
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $secondCourtId,
                'start_date' => Carbon::now()->subDays(1),
                'end_date' => Carbon::now()->addDays(6),
                'status' => 'cancelled',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        $this->command->info('Court promotions seeded successfully!');
    }
}
