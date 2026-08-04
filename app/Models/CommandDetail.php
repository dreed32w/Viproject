<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandDetail extends Model
{
    protected $fillable = [
        "command_id",
        "name",
        "brand",
        "model",
        "category_id",
        "quantity",
        "price"
    ];

    public function command()
    {
        return $this->belongsTo(Command::class);
    }

    public function category()
    {
        return $this->belongsTo(Categore::class, "category_id");
    }
}