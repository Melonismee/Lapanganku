<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'court.category', 'payment'])
            ->latest()
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_date' => $booking->booking_date,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,

                    'user' => $booking->user,
                    'court' => $booking->court,

                    'payment' => $booking->payment ? [
                        'id' => $booking->payment->id,
                        'payment_method' => $booking->payment->payment_method,
                        'amount' => $booking->payment->amount,
                        'status' => $booking->payment->status,
                        'paid_at' => $booking->payment->paid_at,
                        'proof_image' => $booking->payment->proof_image,
                        'proof_url' => $booking->payment->proof_image
                            ? asset('storage/' . $booking->payment->proof_image)
                            : null,
                    ] : null,
                ];
            });

        return response()->json($bookings);
    }

    public function confirmPayment(Booking $booking)
    {
        $payment = $booking->payment;

        if (!$payment) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan.'
            ], 404);
        }

        if (!$payment->proof_image) {
            return response()->json([
                'message' => 'Bukti pembayaran belum diupload user.'
            ], 422);
        }

        $payment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $booking->update([
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Pembayaran valid dan booking berhasil dikonfirmasi.'
        ]);
    }

    public function rejectPayment(Booking $booking)
    {
        $payment = $booking->payment;

        if (!$payment) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan.'
            ], 404);
        }

        $payment->update([
            'status' => 'rejected',
            'paid_at' => null,
        ]);

        $booking->update([
            'status' => 'pending_payment',
        ]);

        return response()->json([
            'message' => 'Pembayaran ditolak. User diminta upload ulang bukti pembayaran.'
        ]);
    }

    public function cancelBooking(Booking $booking)
    {
        if ($booking->status === 'confirmed') {
            return response()->json([
                'message' => 'Booking yang sudah confirmed tidak bisa dibatalkan admin.'
            ], 422);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibatalkan admin.'
        ]);
    }
}
