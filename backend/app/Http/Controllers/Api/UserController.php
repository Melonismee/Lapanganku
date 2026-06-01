<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

        if (
            $user->is_member &&
            $user->membership_until &&
            now()->toDateString() > $user->membership_until->toDateString()
        ) {
            $user->update([
                'is_member' => false,
                'membership_until' => null,
            ]);

            $user->refresh();
        }

        return response()->json($user);
    }
}
