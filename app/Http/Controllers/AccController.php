<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AccController extends Controller
{
    public function login(Request $request){
        $val = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if (Auth::attempt($val)) {
            $request->session()->regenerate();
            return redirect("/");
        }

        return back()->withErrors([
            'email' => 'l\'Email ou mot de pase incorrect'
        ]);
    
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Inertia::location('/login'); 
    }


    public function SendMail(Request $request){
        $user = User::where('email', $request->email)->first();
        if($user){
            $email = $request->email;
            $token = Str::random(64);
            $link = "http://127.0.0.1:8000/ResetPass?token=$token";
            Mail::to($email)->send(new ResetPasswordMail($link));
            $user->token = $token;
            $user->save();
            return back()->with('success_envoyee', 'Email envoyee.');
        }
        else{
            return back()->withErrors([
                'email' => 'l\'email n\'exist pas'
            ]);
        }
    }

    public function Resetpass(Request $request){
        $user = User::where('token', $request->token)->first();
        
         if(!$user){
            return redirect('/SendMail')->withErrors([
                'emaill'=> 'Email est Fausse'
            ]);
        }
        $request->validate([
            'new_pass' => 'required|min:8',
        ]);
        $user->password = Hash::make($request->new_pass);
        $user->token = null;
        $user->save();
        return redirect('/login')->with('success_change', 'le mot de pass est changee');
    }
}
