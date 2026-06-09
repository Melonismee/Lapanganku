<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_member',
        'membership_until',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_member' => 'boolean',
        'membership_until' => 'date',
    ];

    public function membershipPayments(): HasMany
    {
        return $this->hasMany(MembershipPayment::class);
    }

    public function syncMembershipStatusFromPayments(): void
    {
        $activePayment = $this->membershipPayments()
            ->where('status', 'active')
            ->whereDate('membership_until', '>=', now()->toDateString())
            ->latest('membership_until')
            ->first();

        if ($activePayment) {
            if (
                !$this->is_member ||
                !$this->membership_until ||
                $this->membership_until->toDateString() !== $activePayment->membership_until->toDateString()
            ) {
                $this->update([
                    'is_member' => true,
                    'membership_until' => $activePayment->membership_until->toDateString(),
                ]);

                $this->refresh();
            }

            return;
        }

        if (
            $this->is_member &&
            (!$this->membership_until || now()->toDateString() > $this->membership_until->toDateString())
        ) {
            $this->update([
                'is_member' => false,
                'membership_until' => null,
            ]);

            $this->refresh();
        }
    }
}
