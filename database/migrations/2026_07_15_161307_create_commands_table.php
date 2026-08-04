<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commands', function (Blueprint $table) {

            $table->id();

            $table->foreignId('fornisseur_id')->constrained('fornisseurs');

            $table->enum('status',[
                'pending',
                'approved',
                'rejected'
            ]);

            $table->date('date');
            $table->string('number_command', 50);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dammands');
    }
};
