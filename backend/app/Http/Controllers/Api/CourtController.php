<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\Booking;
use App\Models\CourtPromotion;
use Illuminate\Http\Request;

class CourtController extends Controller
{
    public function index()
    {
        return Court::with('category')->get();
    }

    public function show(Court $court)
    {
        return $court->load([
            'category',
            'reviews.user:id,name',
        ]);
    }

    public function bookedSlots(Request $request, Court $court)
    {
        $request->validate([
            'date' => ['required', 'date'],
        ]);

        $bookings = Booking::where('court_id', $court->id)
            ->where('booking_date', $request->date)
            ->whereIn('status', ['pending_payment', 'confirmed'])
            ->get();

        $bookedSlots = [];

        foreach ($bookings as $booking) {
            $start = (int) substr($booking->start_time, 0, 2);
            $end = (int) substr($booking->end_time, 0, 2);

            for ($hour = $start; $hour < $end; $hour++) {
                $bookedSlots[] = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00';
            }
        }

        return response()->json([
            'booked_slots' => array_values(array_unique($bookedSlots)),
        ]);
    }

    public function featured()
    {
        $today = now()->toDateString();

        $courts = Court::with(['category', 'activePromotion'])
            ->whereHas('promotions', function ($query) use ($today) {
                $query->where('status', 'active')
                    ->whereDate('start_date', '<=', $today)
                    ->whereDate('end_date', '>=', $today);
            })
            ->get();

        return response()->json([
            'courts' => $courts,
        ]);
    }
}
