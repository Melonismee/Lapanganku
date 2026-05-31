<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CourtController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminCourtController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/courts', [CourtController::class, 'index']);
Route::get('/courts/{court}', [CourtController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/courts/{court}/reviews', [ReviewController::class, 'store']);

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::patch('/bookings/{booking}/simulate-payment', [BookingController::class, 'simulatePayment']);

    Route::get('/courts/{court}/booked-slots', [CourtController::class, 'bookedSlots']);

    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::patch('/admin/bookings/{booking}/confirm-payment', [AdminBookingController::class, 'confirmPayment']);

    Route::get('/admin/courts', [AdminCourtController::class, 'index']);
    Route::post('/admin/courts', [AdminCourtController::class, 'store']);
    Route::delete('/admin/courts/{court}', [AdminCourtController::class, 'destroy']);
});
