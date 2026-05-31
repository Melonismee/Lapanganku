<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $user = auth()->user();

        $isMembershipActive = $user->is_member &&
            $user->membership_until &&
            now()->toDateString() <= $user->membership_until->toDateString();

        $maxBookingDate = $isMembershipActive
            ? now()->addDays(3)->toDateString()
            : now()->addDays(2)->toDateString();

        if ($request->booking_date < now()->toDateString()) {
            return response()->json([
                'message' => 'Tanggal booking tidak boleh kurang dari hari ini'
            ], 422);
        }

        if ($request->booking_date > $maxBookingDate) {
            return response()->json([
                'message' => $isMembershipActive
                    ? 'Member hanya bisa booking sampai 3 hari ke depan'
                    : 'User biasa hanya bisa booking sampai 2 hari ke depan'
            ], 422);
        }

        $startTime = substr($request->start_time, 0, 5);
        $highDemandHours = ['18:00', '19:00', '20:00'];

        if (!$isMembershipActive && in_array($startTime, $highDemandHours)) {
            return response()->json([
                'message' => 'Jam ini hanya bisa dipesan oleh user membership'
            ], 422);
        }

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

    public function simulatePayment(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Tidak punya akses ke booking ini'
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

        if ($booking->payment->status === 'paid') {
            return response()->json([
                'message' => 'Pembayaran sudah dikonfirmasi.'
            ], 422);
        }

        DB::transaction(function () use ($booking) {
            $booking->update([
                'status' => 'confirmed',
            ]);

            $booking->payment->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Pembayaran berhasil disimulasikan.',
            'booking' => $booking->fresh()->load([
                'court.category',
                'payment',
                'user:id,name,email',
            ]),
        ]);
    }
}
