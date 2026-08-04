<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Asset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Supplier;
use App\Models\Cammand;
use App\Models\ProductSerial;
use App\Models\Product;
use App\Models\Affectation;
use App\Models\Category;
use App\Models\Incident;

class EmployerController extends Controller
{
    public function Dashboard(){
        $productIds = Affectation::where("employer_id", Auth::id())->where("returned_at", null)->pluck("product_serial_id");

        return Inertia::render("employer/dashboard", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,

            "info" => [
                "nb_products" => $productIds->count(),
                "nb_Incidents_pending" => Incident::whereIn("product_serial_id", $productIds)->where("status", "pending")->count(),
                "nb_Incidents_repairing" => Incident::whereIn("product_serial_id", $productIds)->where("status", "repairing")->count(),
                "nb_Incidents_solved" => Incident::whereIn("product_serial_id", $productIds)->where("status", "solved")->count(),
            ]
        ]);
    }

    public function change_pass(){
        return Inertia::render("employer/change_pass", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
        ]);
    }

    public function save_change_pass(Request $request){
        $request->validate([
            "current_password" => "required",
            "new_password" => "required|min:6|confirmed",
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                "current_password" => "Le mot de passe actuel est incorrect."
            ]);
        }

        $user->password = bcrypt($request->new_password);
        $user->save();

        return back()->with("success", "Mot de passe modifié avec succès.");
    }

    public function get_products(){
        $affectations = Affectation::where("employer_id", Auth::id())->where("returned_at", null)->get();

        foreach ($affectations as $af) {

            $product = ProductSerial::find($af->product_serial_id);

            $product_type = Product::find($product->product_id);

            $af->serial_number = $product->serial_number;
            $af->status = $product->status;
            $af->product_id = $product->id;
            $af->name = $product_type->name;
            $af->brand = $product_type->brand;
            $af->model = $product_type->model;
            $af->is_Incident = Incident::where("product_serial_id", $product->id)->exists();
        }

        return Inertia::render("employer/products", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "products" => $affectations,
        ]);
    }

    public function new_incident(Request $request){
        return Inertia::render("employer/new_incident", [
            'username' => Auth::user()->nom ." ". Auth::user()->prenom,
            'id' => $request->id
        ]);
    }

    public function save_incident(Request $request){
        $request->validate([
            'problem' => 'required|min:20',
        ]);
        Incident::create([
            "product_serial_id"=>$request->id,
            "problem" => $request->problem,
            'date' => now(),
            'status' => "pending",
        ]);
        return redirect("/MyProducts")->with("success_incident", "l'incident ete ajotee");
    }

    public function get_incidents(){
        $productIds = Affectation::where("employer_id", Auth::id())->pluck("product_serial_id");
        $incidents = Incident::whereIn("product_serial_id", $productIds)->get();
        foreach ($incidents as $incident) {
            $product = ProductSerial::find($incident->product_serial_id);
            $product_type = Product::find($product->product_id);
            $incident->product_name = $product_type->name;
            $incident->product_model = $product_type->model;
            $incident->product_brand = $product_type->brand;
            $incident->serial_number = $product->serial_number;
        }

        return Inertia::render("employer/incidents", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "incidents" => $incidents
        ]);
    }


    public function confirm_resoulation(Request $request){
        if(!$request->id) return;
        $incident = Incident::where("id", $request->id)->first();
        $incident->delete();
        return back()->with("success_res", "la resoulution est confirmer");
    }
}