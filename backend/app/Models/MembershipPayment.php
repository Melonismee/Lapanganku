<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipPayment extends Model
{
    protected $fillable = [
        'user_id',
        'payment_method',
        'amount',
        'duration_days',
        'qris_image',
        'proof_image',
        'status',
        'paid_at',
        'membership_until',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'membership_until' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
