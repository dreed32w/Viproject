<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    protected $fillable = [
        "product_serial_id",
        "problem",
        "date",
        "status"
    ];

    public function serial()
    {
        return $this->belongsTo(ProductSerial::class, "product_serial_id");
    }
}