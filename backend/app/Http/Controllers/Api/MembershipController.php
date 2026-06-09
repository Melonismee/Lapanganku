<?php

namespace App\Http\Controllers\Api;

use App\Models\MembershipPayment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MembershipController extends Controller
{
    private const MEMBERSHIP_AMOUNT = 29900;
    private const MEMBERSHIP_DURATION_DAYS = 30;

    public function current(Request $request)
    {
        $user = $request->user();
        $user->syncMembershipStatusFromPayments();

        $payment = $user->membershipPayments()
            ->latest()
            ->first();

        return response()->json([
            'user' => $user,
            'membership_payment' => $payment ? $this->serializePayment($payment) : null,
        ]);
    }

    public function createPayment(Request $request)
    {
        $user = $request->user();

        if ($this->hasActiveMembership($user)) {
            return response()->json([
                'message' => 'Membership kamu masih aktif.',
                'membership_until' => $user->membership_until,
            ], 422);
        }

        $existing = $user->membershipPayments()
            ->whereIn('status', ['unpaid', 'waiting_confirmation', 'rejected'])
            ->latest()
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Pembayaran membership sudah dibuat.',
                'membership_payment' => $this->serializePayment($existing),
            ]);
        }

        $payment = MembershipPayment::create([
            'user_id' => $user->id,
            'payment_method' => 'qris',
            'amount' => self::MEMBERSHIP_AMOUNT,
            'duration_days' => self::MEMBERSHIP_DURATION_DAYS,
            'qris_image' => 'qris.png',
            'status' => 'unpaid',
        ]);

        return response()->json([
            'message' => 'Pembayaran membership berhasil dibuat.',
            'membership_payment' => $this->serializePayment($payment),
        ], 201);
    }

    public function uploadProof(Request $request, MembershipPayment $membershipPayment)
    {
        if ($membershipPayment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Kamu tidak punya akses ke pembayaran membership ini.'
            ], 403);
        }

        if (in_array($membershipPayment->status, ['active', 'cancelled'], true)) {
            return response()->json([
                'message' => 'Pembayaran membership ini tidak bisa diubah.'
            ], 422);
        }

        $request->validate([
            'proof_image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($membershipPayment->proof_image) {
            Storage::disk('public')->delete($membershipPayment->proof_image);
        }

        $path = $request->file('proof_image')->store('membership-payment-proofs', 'public');

        $membershipPayment->update([
            'proof_image' => $path,
            'status' => 'waiting_confirmation',
            'paid_at' => null,
        ]);

        return response()->json([
            'message' => 'Bukti pembayaran membership berhasil dikirim. Menunggu validasi admin.',
            'membership_payment' => $this->serializePayment($membershipPayment->fresh()),
        ]);
    }

    public function cancel(Request $request, MembershipPayment $membershipPayment = null)
    {
        $user = $request->user();
        $payment = $membershipPayment ?: $user->membershipPayments()->latest()->first();

        if (!$payment || $payment->user_id !== $user->id) {
            return response()->json([
                'message' => 'Data membership tidak ditemukan.'
            ], 404);
        }

        if ($payment->status === 'cancelled') {
            return response()->json([
                'message' => 'Membership sudah dibatalkan.'
            ], 422);
        }

        DB::transaction(function () use ($payment, $user) {
            $payment->update([
                'status' => 'cancelled',
            ]);

            if ($user->is_member) {
                $user->update([
                    'is_member' => false,
                    'membership_until' => null,
                ]);
            }
        });

        return response()->json([
            'message' => 'Membership berhasil dibatalkan.',
            'membership_payment' => $this->serializePayment($payment->fresh()),
            'user' => $user->fresh(),
        ]);
    }

    private function hasActiveMembership($user): bool
    {
        return $user->is_member &&
            $user->membership_until &&
            now()->toDateString() <= $user->membership_until->toDateString();
    }

    private function serializePayment(MembershipPayment $payment): array
    {
        return [
            'id' => $payment->id,
            'payment_method' => $payment->payment_method,
            'amount' => $payment->amount,
            'duration_days' => $payment->duration_days,
            'qris_image' => $payment->qris_image,
            'proof_image' => $payment->proof_image,
            'proof_url' => $payment->proof_image ? asset('storage/' . $payment->proof_image) : null,
            'status' => $payment->status,
            'paid_at' => $payment->paid_at,
            'membership_until' => $payment->membership_until,
            'created_at' => $payment->created_at,
        ];
    }
}
