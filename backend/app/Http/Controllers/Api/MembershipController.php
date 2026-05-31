<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MembershipController extends Controller
{
    public function simulatePayment(Request $request)
    {
        $user = $request->user();

        $user->is_member = true;
        $user->membership_until = Carbon::now()->addDays(30)->toDateString();
        $user->save();

        return response()->json([
            'message' => 'Membership aktif.',
            'membership_until' => $user->membership_until,
            'is_member' => $user->is_member,
        ]);
    }
}

