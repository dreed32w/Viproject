<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Command extends Model
{
    protected $fillable = [
        "fornisseur_id",
        "status",
        "date",
        'number_command'
    ];

    public function fornisseur()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function details()
    {
        return $this->hasMany(CommandDetail::class);
    }
}