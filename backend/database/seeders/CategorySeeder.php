<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Padel',
                'image' => '/images/categories/padel.jpg',
            ],
            [
                'name' => 'Futsal',
                'image' => '/images/categories/futsal.jpg',
            ],
            [
                'name' => 'Mini Soccer',
                'image' => '/images/categories/mini-soccer.jpg',
            ],
            [
                'name' => 'Bulu Tangkis',
                'image' => '/images/categories/bulu-tangkis.jpg',
            ],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['name' => $category['name']],
                ['image' => $category['image']]
            );
        }
    }
}
