<?php

use App\Models\Category;
use App\Models\Court;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/courts', function () {
    return Court::with('category')->get();
});

Route::get('/categories', function () {
    return Category::all();
});

Route::get('/courts/{court}', function (Court $court) {
    return $court->load([
        'category',
        'reviews.user:id,name',
    ]);
});

Route::middleware(['auth:sanctum'])->post('/courts/{court}/reviews', function (Request $request, Court $court) {
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
});

Route::middleware(['auth:sanctum'])->post('/bookings', function (Request $request) {
    $validated = $request->validate([
        'court_id' => ['required', 'exists:courts,id'],
        'booking_date' => ['required', 'date'],
        'start_time' => ['required'],
        'end_time' => ['required'],
        'total_price' => ['required', 'integer', 'min:0'],
    ]);

    $booking = Booking::create([
        'user_id' => $request->user()->id,
        'court_id' => $validated['court_id'],
        'booking_date' => $validated['booking_date'],
        'start_time' => $validated['start_time'],
        'end_time' => $validated['end_time'],
        'total_price' => $validated['total_price'],
        'status' => 'pending_payment',
    ]);

    return response()->json([
        'message' => 'Booking berhasil dibuat',
        'booking' => $booking,
    ], 201);
});
