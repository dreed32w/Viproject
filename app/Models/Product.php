<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        "name",
        "brand",
        "model",
        "category_id",
        "quantity"
    ];

    public function category()
{
    return $this->belongsTo(Categore::class);
}

    public function serials()
    {
        return $this->hasMany(ProductSerial::class);
    }
}