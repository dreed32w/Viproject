<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nom'=>'nom',
            'prenom'=>'prenom',
            'email' => 'exemple@gmail.com',
            'cin'=>'ABCDEF',
            'role'=>'admin',
            'password'=>'0000000000',
            'telephone'=>'000000000'
        ]);
    }
}
