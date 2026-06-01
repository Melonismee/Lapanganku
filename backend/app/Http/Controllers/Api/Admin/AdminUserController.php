<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $users = User::select([
            'id',
            'name',
            'email',
            'role',
            'is_member',
            'membership_until',
            'created_at',
        ])
            ->latest()
            ->get()
            ->map(function ($user) {
                $isMembershipActive = $user->is_member &&
                    $user->membership_until &&
                    now()->toDateString() <= $user->membership_until->toDateString();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_member' => (bool) $user->is_member,
                    'membership_until' => $user->membership_until,
                    'membership_active' => (bool) $isMembershipActive,
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'users' => $users,
        ]);
    }
}
