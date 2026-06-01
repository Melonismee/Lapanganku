<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourtPromotion;
use Illuminate\Http\Request;

class AdminCourtPromotionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $promotions = CourtPromotion::with('court.category')
            ->latest()
            ->get();

        return response()->json([
            'promotions' => $promotions
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'court_id' => ['required', 'exists:courts,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        CourtPromotion::where('court_id', $validated['court_id'])
            ->where('status', 'active')
            ->update([
                'status' => 'cancelled'
            ]);

        $promotion = CourtPromotion::create([
            'court_id' => $validated['court_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Lapangan berhasil ditampilkan di billboard',
            'promotion' => $promotion->load('court.category'),
        ], 201);
    }

    public function cancel(Request $request, CourtPromotion $promotion)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $promotion->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'message' => 'Promosi lapangan berhasil dibatalkan',
            'promotion' => $promotion->load('court.category'),
        ]);
    }
}
