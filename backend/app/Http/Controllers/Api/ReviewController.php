<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Court $court)
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string'],
        ]);

        $review = Review::create([
            'court_id' => $court->id,
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        $court->update([
            'rating' => round($court->reviews()->avg('rating'), 1),
        ]);

        return response()->json([
            'message' => 'Review berhasil ditambahkan',
            'review' => $review->load('user:id,name'),
            'rating' => $court->fresh()->rating,
        ], 201);
    }
}
