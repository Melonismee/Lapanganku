<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CourtController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminCourtController;
use App\Http\Controllers\Api\SupportChatController;
use App\Http\Controllers\Api\MembershipController;
use App\Http\Controllers\Api\Admin\AdminCourtPromotionController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PaymentController;


Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'me']);

Route::get('/courts', [CourtController::class, 'index']);
Route::get('/courts/featured', [CourtController::class, 'featured']);
Route::get('/courts/{court}', [CourtController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/support/chat', [SupportChatController::class, 'chat']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/courts/{court}/reviews', [ReviewController::class, 'store']);

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{booking}/upload-proof', [PaymentController::class, 'uploadProof']);
    Route::patch('/bookings/{booking}/simulate-payment', [BookingController::class, 'simulatePayment']);

    Route::post('/membership/simulate-payment', [MembershipController::class, 'simulatePayment']);

    Route::get('/courts/{court}/booked-slots', [CourtController::class, 'bookedSlots']);

    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::patch('/admin/bookings/{booking}/confirm-payment', [AdminBookingController::class, 'confirmPayment']);
    Route::patch('/admin/bookings/{booking}/reject-payment', [AdminBookingController::class, 'rejectPayment']);
    Route::patch('/admin/bookings/{booking}/cancel', [AdminBookingController::class, 'cancelBooking']);

    Route::get('/admin/courts', [AdminCourtController::class, 'index']);
    Route::post('/admin/courts', [AdminCourtController::class, 'store']);
    Route::delete('/admin/courts/{court}', [AdminCourtController::class, 'destroy']);

    Route::get('/admin/promotions', [AdminCourtPromotionController::class, 'index']);
    Route::post('/admin/promotions', [AdminCourtPromotionController::class, 'store']);
    Route::patch('/admin/promotions/{promotion}/cancel', [AdminCourtPromotionController::class, 'cancel']);
    Route::get('/admin/users', [AdminUserController::class, 'index']);
});
