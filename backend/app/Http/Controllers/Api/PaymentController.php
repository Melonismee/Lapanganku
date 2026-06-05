<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function uploadProof(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Kamu tidak punya akses ke booking ini.'
            ], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'Booking sudah dibatalkan.'
            ], 422);
        }

        if ($booking->status === 'confirmed') {
            return response()->json([
                'message' => 'Booking sudah dikonfirmasi.'
            ], 422);
        }

        $request->validate([
            'proof_image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $payment = $booking->payment;

        if (!$payment) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan.'
            ], 404);
        }

        if ($payment->proof_image) {
            Storage::disk('public')->delete($payment->proof_image);
        }

        $path = $request->file('proof_image')->store('payment-proofs', 'public');

        $payment->update([
            'proof_image' => $path,
            'status' => 'waiting_confirmation',
            'paid_at' => null,
        ]);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil dikirim. Menunggu validasi admin.',
            'payment' => $payment,
            'proof_url' => asset('storage/' . $path),
        ]);
    }
}
