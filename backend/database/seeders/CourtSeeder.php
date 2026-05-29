<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Court;
use App\Models\Category;

class CourtSeeder extends Seeder
{
    public function run(): void
    {
        $padel = Category::where('name', 'Padel')->first();
        $futsal = Category::where('name', 'Futsal')->first();
        $mini = Category::where('name', 'Mini Soccer')->first();
        $badminton = Category::where('name', 'Bulu Tangkis')->first();

        Court::insert([
            [
                'name' => 'Elite Padel Club',
                'category_id' => $padel->id,
                'location' => 'Jakarta Selatan',
                'price_per_hour' => 250000,
                'rating' => 0,
                'image' => 'padel1.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567890',
            ],
            [
                'name' => 'Padel Pro Arena',
                'category_id' => $padel->id,
                'location' => 'Jakarta Barat',
                'price_per_hour' => 220000,
                'rating' => 0,
                'image' => 'padel2.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567891',
            ],
            [
                'name' => 'Futsal Champion Arena',
                'category_id' => $futsal->id,
                'location' => 'Jakarta Timur',
                'price_per_hour' => 150000,
                'rating' => 0,
                'image' => 'futsal1.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567892',
            ],
            [
                'name' => 'Galaxy Futsal',
                'category_id' => $futsal->id,
                'location' => 'Jakarta Selatan',
                'price_per_hour' => 140000,
                'rating' => 0,
                'image' => 'futsal2.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567893',
            ],
            [
                'name' => 'Mini Soccer Pro Field',
                'category_id' => $mini->id,
                'location' => 'Jakarta Pusat',
                'price_per_hour' => 300000,
                'rating' => 0,
                'image' => 'mini1.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567894',
            ],
            [
                'name' => 'Soccer Arena 7',
                'category_id' => $mini->id,
                'location' => 'Jakarta Utara',
                'price_per_hour' => 280000,
                'rating' => 0,
                'image' => 'mini2.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567895',
            ],
            [
                'name' => 'Badminton Hall A',
                'category_id' => $badminton->id,
                'location' => 'Jakarta Barat',
                'price_per_hour' => 80000,
                'rating' => 0,
                'image' => 'badminton1.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567896',
            ],
            [
                'name' => 'Smash Arena',
                'category_id' => $badminton->id,
                'location' => 'Jakarta Selatan',
                'price_per_hour' => 90000,
                'rating' => 0,
                'image' => 'badminton2.jpg',
                'whatsapp_link' => 'https://wa.me/6281234567897',
            ],
        ]);
    }
}
