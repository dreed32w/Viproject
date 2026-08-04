<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    protected $fillable = [
        "product_serial_id",
        "employer_id",
        "assigned_at",
        "returned_at"
    ];

    public function productSerial()
    {
        return $this->belongsTo(ProductSerial::class, "product_serial_id");
    }

    public function employer()
    {
        return $this->belongsTo(User::class, "employer_id");
    }
}