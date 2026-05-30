<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Court;
use Illuminate\Http\Request;

class AdminCourtController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Akses ditolak.'
            ], 403);
        }

        $courts = Court::with('category')
            ->latest()
            ->get();

        return response()->json([
            'courts' => $courts,
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Akses ditolak.'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'price_per_hour' => ['required', 'integer', 'min:0'],
            'whatsapp_link' => ['nullable', 'string', 'max:255'],
        ]);

        $court = Court::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'location' => $validated['location'],
            'price_per_hour' => $validated['price_per_hour'],
            'whatsapp_link' => $validated['whatsapp_link'] ?? null,
            'rating' => 0,
        ]);

        return response()->json([
            'message' => 'Lapangan berhasil ditambahkan.',
            'court' => $court->load('category'),
        ], 201);
    }

    public function destroy(Request $request, Court $court)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Akses ditolak.'
            ], 403);
        }

        if ($court->bookings()->exists()) {
            return response()->json([
                'message' => 'Lapangan tidak bisa dihapus karena sudah memiliki data booking.'
            ], 422);
        }

        $court->delete();

        return response()->json([
            'message' => 'Lapangan berhasil dihapus.'
        ]);
    }
}
