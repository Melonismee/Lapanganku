<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'court_id' => ['required', 'exists:courts,id'],
            'booking_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'total_price' => ['required', 'integer', 'min:0'],
        ]);

        $conflict = Booking::where('court_id', $request->court_id)
            ->where('booking_date', $request->booking_date)
            ->whereIn('status', ['pending_payment', 'confirmed'])
            ->where(function ($query) use ($request) {
                $query->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Jam tersebut sudah dibooking. Silakan pilih jam lain.'
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'court_id' => $validated['court_id'],
            'booking_date' => $validated['booking_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'total_price' => $validated['total_price'],
            'status' => 'pending_payment',
        ]);

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'payment_method' => 'qris',
            'amount' => $booking->total_price,
            'qris_image' => 'qris.png',
            'status' => 'unpaid',
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat',
            'booking_id' => $booking->id,
            'booking' => $booking,
            'payment' => $payment,
        ], 201);
    }

    public function show(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Tidak punya akses ke booking ini'
            ], 403);
        }

        return response()->json([
            'booking' => $booking->load([
                'court.category',
                'payment',
                'user:id,name,email',
            ])
        ]);
    }

    public function myBookings(Request $request)
    {
        $bookings = Booking::with([
            'court.category',
            'payment',
        ])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Tidak punya akses ke booking ini.'
            ], 403);
        }

        if ($booking->status !== 'pending_payment') {
            return response()->json([
                'message' => 'Booking ini tidak bisa dibatalkan.'
            ], 422);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibatalkan.',
            'booking' => $booking->load(['court.category', 'payment']),
        ]);
    }
}
