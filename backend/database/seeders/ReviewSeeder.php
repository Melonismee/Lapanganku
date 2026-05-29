<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'user@gmail.com')->first();

        if (!$user) {
            return;
        }

        $reviews = [
            'Elite Padel Club' => [
                ['rating' => 5, 'comment' => 'Lapangan bagus, bersih, dan nyaman.'],
                ['rating' => 5, 'comment' => 'Fasilitasnya lengkap dan tempatnya strategis.'],
            ],
            'Padel Pro Arena' => [
                ['rating' => 4, 'comment' => 'Lapangan cukup bagus, hanya parkir agak penuh.'],
                ['rating' => 5, 'comment' => 'Tempat nyaman untuk main padel.'],
            ],
            'Futsal Champion Arena' => [
                ['rating' => 5, 'comment' => 'Rumput sintetisnya bagus dan tidak licin.'],
                ['rating' => 4, 'comment' => 'Harga sesuai dengan fasilitas.'],
            ],
            'Galaxy Futsal' => [
                ['rating' => 4, 'comment' => 'Lapangan oke untuk main bareng teman.'],
                ['rating' => 5, 'comment' => 'Pelayanan ramah dan tempat bersih.'],
            ],
            'Mini Soccer Pro Field' => [
                ['rating' => 5, 'comment' => 'Lapangan luas dan cocok untuk mini soccer.'],
                ['rating' => 5, 'comment' => 'Sangat recommended.'],
            ],
            'Soccer Arena 7' => [
                ['rating' => 4, 'comment' => 'Tempat bagus, lokasi mudah dicari.'],
                ['rating' => 5, 'comment' => 'Lapangan nyaman dan bersih.'],
            ],
            'Badminton Hall A' => [
                ['rating' => 4, 'comment' => 'Lapangan bersih dan pencahayaan cukup.'],
                ['rating' => 5, 'comment' => 'Nyaman untuk latihan badminton.'],
            ],
            'Smash Arena' => [
                ['rating' => 5, 'comment' => 'Tempatnya nyaman dan tidak terlalu ramai.'],
                ['rating' => 4, 'comment' => 'Harga terjangkau dan fasilitas oke.'],
            ],
        ];

        foreach ($reviews as $courtName => $courtReviews) {
            $court = Court::where('name', $courtName)->first();

            if (!$court) {
                continue;
            }

            foreach ($courtReviews as $review) {
                Review::create([
                    'court_id' => $court->id,
                    'user_id' => $user->id,
                    'rating' => $review['rating'],
                    'comment' => $review['comment'],
                ]);
            }

            $court->update([
                'rating' => round($court->reviews()->avg('rating'), 1),
            ]);
        }
    }
}
