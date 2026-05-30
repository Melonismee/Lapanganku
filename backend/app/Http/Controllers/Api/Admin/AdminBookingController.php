<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Akses ditolak.'
            ], 403);
        }

        $bookings = Booking::with([
            'user:id,name,email',
            'court.category',
            'payment',
        ])
            ->latest()
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function confirmPayment(Request $request, Booking $booking)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Akses ditolak.'
            ], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'Booking sudah dibatalkan.'
            ], 422);
        }

        if (!$booking->payment) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan.'
            ], 404);
        }

        $booking->update([
            'status' => 'confirmed',
        ]);

        $booking->payment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dikonfirmasi.',
            'booking' => $booking->load([
                'user:id,name,email',
                'court.category',
                'payment',
            ]),
        ]);
    }
}
