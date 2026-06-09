<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipPayment;
use Illuminate\Support\Facades\DB;

class AdminMembershipController extends Controller
{
    public function index()
    {
        $payments = MembershipPayment::with('user:id,name,email,is_member,membership_until')
            ->latest()
            ->get()
            ->map(fn (MembershipPayment $payment) => $this->serializePayment($payment));

        return response()->json([
            'membership_payments' => $payments,
        ]);
    }

    public function confirm(MembershipPayment $membershipPayment)
    {
        if (!$membershipPayment->proof_image) {
            return response()->json([
                'message' => 'Bukti pembayaran belum diupload user.'
            ], 422);
        }

        $membershipUntil = now()->addDays($membershipPayment->duration_days)->toDateString();

        DB::transaction(function () use ($membershipPayment, $membershipUntil) {
            $membershipPayment->update([
                'status' => 'active',
                'paid_at' => now(),
                'membership_until' => $membershipUntil,
            ]);

            $membershipPayment->user->update([
                'is_member' => true,
                'membership_until' => $membershipUntil,
            ]);
        });

        return response()->json([
            'message' => 'Pembayaran valid dan membership berhasil diaktifkan.',
            'membership_payment' => $this->serializePayment($membershipPayment->fresh('user')),
        ]);
    }

    public function reject(MembershipPayment $membershipPayment)
    {
        $membershipPayment->update([
            'status' => 'rejected',
            'paid_at' => null,
        ]);

        return response()->json([
            'message' => 'Pembayaran membership ditolak. User diminta upload ulang bukti pembayaran.',
            'membership_payment' => $this->serializePayment($membershipPayment->fresh('user')),
        ]);
    }

    public function cancel(MembershipPayment $membershipPayment)
    {
        DB::transaction(function () use ($membershipPayment) {
            $membershipPayment->update([
                'status' => 'cancelled',
            ]);

            if ($membershipPayment->user->is_member) {
                $membershipPayment->user->update([
                    'is_member' => false,
                    'membership_until' => null,
                ]);
            }
        });

        return response()->json([
            'message' => 'Membership berhasil dibatalkan admin.',
            'membership_payment' => $this->serializePayment($membershipPayment->fresh('user')),
        ]);
    }

    private function serializePayment(MembershipPayment $payment): array
    {
        return [
            'id' => $payment->id,
            'user' => $payment->user,
            'payment_method' => $payment->payment_method,
            'amount' => $payment->amount,
            'duration_days' => $payment->duration_days,
            'status' => $payment->status,
            'paid_at' => $payment->paid_at,
            'membership_until' => $payment->membership_until,
            'proof_image' => $payment->proof_image,
            'proof_url' => $payment->proof_image ? asset('storage/' . $payment->proof_image) : null,
            'created_at' => $payment->created_at,
        ];
    }
}
