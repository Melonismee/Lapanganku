<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CourtPromotionSeeder extends Seeder
{
    public function run(): void
    {
        $courtIds = DB::table('courts')->pluck('id');

        if ($courtIds->isEmpty()) {
            $this->command->warn('No courts found. Please run CourtSeeder first.');
            return;
        }

        DB::table('court_promotions')->truncate();

        $firstCourtId = $courtIds->first();
        $secondCourtId = $courtIds->count() > 1 ? $courtIds[1] : $firstCourtId;

        DB::table('court_promotions')->insert([
            [
                'court_id' => $firstCourtId,
                'start_date' => Carbon::now()->subDays(2)->toDateString(),
                'end_date' => Carbon::now()->addDays(5)->toDateString(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $secondCourtId,
                'start_date' => Carbon::now()->subDay()->toDateString(),
                'end_date' => Carbon::now()->addDays(7)->toDateString(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $firstCourtId,
                'start_date' => Carbon::now()->subDays(14)->toDateString(),
                'end_date' => Carbon::now()->subDays(7)->toDateString(),
                'status' => 'expired',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('Court promotions seeded successfully!');
    }
}
