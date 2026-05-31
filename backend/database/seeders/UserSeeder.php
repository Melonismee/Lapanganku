<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_member' => false,
                'membership_until' => null,
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'User',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_member' => false,
                'membership_until' => null,
            ]
        );

        User::updateOrCreate(
            ['email' => 'member@gmail.com'],
            [
                'name' => 'Member User',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_member' => true,
                'membership_until' => now()->addDays(30)->toDateString(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'king@gmail.com'],
            [
                'name' => 'Ryuzora',
                'password' => Hash::make('admin123'),
                'role' => 'user',
                'is_member' => false,
                'membership_until' => null,
            ]
        );
    }
}
