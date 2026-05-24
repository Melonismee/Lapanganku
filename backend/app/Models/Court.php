<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'location',
        'price_per_hour',
        'rating',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
