<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'court_id',
        'user_id',
        'rating',
        'comment',
    ];

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
