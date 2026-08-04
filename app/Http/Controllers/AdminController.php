<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductSerial;
use App\Models\ProductPriceHistory;
use App\Models\Command;
use App\Models\CommandDetail;
use App\Models\Supplier;
use App\Models\Category;
use App\Models\Affectation;
use App\Models\Incident;


class AdminController extends Controller
{
    public function dashboard(){
        $info = [
            "employers" => User::where("role", "employer")->count(),
            "products" => Product::count(),
            "serials" => ProductSerial::count(),
            "available_serials" => ProductSerial::where("status", "Disponible")->count(),
            "assigned_serials" => ProductSerial::where("status", "Attribue")->count(),
            "repairing_serials" => ProductSerial::where("status", "En_reparation")->count(),
            "hors_service_serials" => ProductSerial::where("status", "Hors_service")->count(),
            "suppliers" => Supplier::count(),
            "categories" => Category::count(),
            "pending_commands" => Command::where("status", "pending")->count(),
            "approved_commands" => Command::where("status", "approved")->count(),
            "rejected_commands" => Command::where("status", "rejected")->count(),
            "pending_incidents" => Incident::where("status", "pending")->count(),
            "repairing_incidents" => Incident::where("status", "repairing")->count(),
            "solved_incidents" => Incident::where("status", "solved")->count(),
        ];

        return Inertia::render("admin/dashboard", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "info" => $info,
        ]);
    }


    public function change_pass(){
        return Inertia::render("admin/change_pass", [
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

    public function commands(){
        $commands = Command::with('fornisseur')->latest()->get();

        foreach ($commands as $command) {
            $command->supplier_name = $command->fornisseur->company_name;
            $command->products_count = CommandDetail::where("command_id", $command->id)->count();
        }

        return Inertia::render("admin/achatsF/commands", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "commands" => $commands
        ]);
    }

    public function add_command(){
        return Inertia::render("admin/achatsF/add_command", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "suppliers" => Supplier::orderBy("company_name")->get(),
            "categories" => Category::orderBy("name")->get(),
            "products" => Product::orderBy("name")->get(),
        ]);
    }

    public function save_command(Request $request){
        $request->validate([
            "supplier_id" => "required|exists:fornisseurs,id",
            "products" => "required|array|min:1",
        ]);

        $command = Command::create([
            "fornisseur_id" => $request->supplier_id,
            "status" => "pending",
            "date" => $request->date,
            'number_command' => $request->number_command
        ]);

        foreach ($request->products as $product) {

            CommandDetail::create([
                "command_id" => $command->id,
                "name" => $product["name"],
                "brand" => $product["brand"],
                "model" => $product["model"],
                "category_id" => $product["category_id"],
                "quantity" => $product["quantity"],
                "price" => $product["unit_price"],

            ]);

        }

        return redirect("/achats/commands")->with("success", "Commande créée avec succès.");
    }



    public function receive_command(Request $request){
        $command = Command::findOrFail($request->id);
        if ($command->status == "approved") {
            return back();
        }
        $details = CommandDetail::where("command_id", $command->id)->get();
        foreach ($details as $detail) {
            $product = Product::where("name", $detail->name)->where("brand", $detail->brand)->where("model", $detail->model)->where("category_id", $detail->category_id)->first();
            if ($product) {
                $product->quantity += $detail->quantity;
                $product->save();

            } else {
                $product = Product::create([
                    "name" => $detail->name,
                    "brand" => $detail->brand,
                    "model" => $detail->model,
                    "category_id" => $detail->category_id,
                    "quantity" => $detail->quantity,
                ]);
            }

            for ($i = 0; $i < $detail->quantity; $i++) {
                ProductSerial::create([
                    "product_id" => $product->id,
                    "serial_number" => strtoupper(Str::uuid()),
                    "status" => "Disponible",
                ]);
            }
        }
        $command->status = "approved";
        $command->save();

        return back()->with("success", "Commande reçue avec succès.");
    }



    public function delete_command(Request $request){
        $command = Command::findOrFail($request->id);

        if ($command->status == "approved") {
            return back()->withErrors([
                "approved" => "Impossible de supprimer une commande déjà reçue."
            ]);
        }

        CommandDetail::where("command_id", $command->id)->delete();

        $command->delete();

        return back()->with("success", "Commande supprimée avec succès.");
    }



    public function view_command($id) {
        $command = Command::with("fornisseur")->findOrFail($id);

        $details = CommandDetail::where("command_id", $command->id)->get();

        return Inertia::render("admin/achatsF/view_command", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "command"  => $command,
            "details"  => $details,
        ]);
    }

    public function edit_command(Request $request){
        
        $command = Command::findOrFail($request->id);

        if ($command->status == "approved") {
            return back()->withErrors([
                "approved" => "Impossible de modifier une commande approuvée."
            ]);
        }

        $details = CommandDetail::where("command_id", $command->id)->get();

        return Inertia::render("admin/achatsF/modifier_command", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "command" => $command,
            "details" => $details,
            "categories" => Category::all(),
            "suppliers" => Supplier::all(),
        ]);
    }

    public function save_edit_command(Request $request){
        $request->validate([
            "id" => "required|exists:commands,id",
            "supplier_id" => "required|exists:fornisseurs,id",
            "products" => "required|array|min:1",
        ]);

        $command = Command::findOrFail($request->id);

        if ($command->status == "approved") {
            return back()->withErrors([
                "approved" => "Impossible de modifier une commande approuvée."
            ]);
        }

        $command->fornisseur_id = $request->supplier_id;
        $command->save();

        CommandDetail::where("command_id", $command->id)->delete();

        foreach ($request->products as $product) {

            CommandDetail::create([
                "command_id" => $command->id,
                "name" => $product["product_name"],
                "brand" => $product["brand"],
                "model" => $product["model"],
                "category_id" => $product["category_id"],
                "quantity" => $product["quantity"],
                "price" => $product["unit_price"],
            ]);

        }

        return redirect("/achats/commands")->with(
            "modifier_success",
            "La commande a été modifiée avec succès."
        );
    }



    public function categories(){
        $categories = Category::all();

        foreach ($categories as $category) {
            $category->nb_products = Product::where("category_id", $category->id)->count();
        }

        return Inertia::render("admin/achatsF/categories", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "categories" => $categories
        ]);
    }

    public function save_category(Request $request){
        $request->validate([
            "name" => "required|unique:categories,name"
        ]);

        Category::create([
            "name" => $request->name
        ]);

        return redirect("/achats/categories")->with("success", "Catégorie ajoutée avec succès.");
    }

    public function delete_category(Request $request){
        $category = Category::findOrFail($request->id);

        if (Product::where("category_id", $category->id)->exists()) {
            return back()->withErrors([
                "used" => "Impossible de supprimer cette catégorie."
            ]);
        }

        $category->delete();

        return back()->with("success", "Catégorie supprimée avec succès.");
    }

    public function edit_category(Request $request){
        $category = Category::findOrFail($request->id);

        return Inertia::render("admin/achatsF/modifier_category", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "category" => $category
        ]);
    }

    public function save_edit_category(Request $request){
        $request->validate([
            "id" => "required|exists:categories,id",
            "name" => "required|unique:categories,name," . $request->id
        ]);

        $category = Category::findOrFail($request->id);

        $category->name = $request->name;
        $category->save();

        return redirect("/achats/categories")->with("success", "Catégorie modifiée avec succès.");
    }


    public function suppliers(){
        $suppliers = Supplier::all();

        foreach ($suppliers as $supplier) {
            $supplier->nb_commands = Command::where("fornisseur_id", $supplier->id)->count();
        }

        return Inertia::render("admin/products/suppliers", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "suppliers" => $suppliers
        ]);
    }

    public function save_supplier(Request $request){
        $request->validate([
            "company_name" => "required|unique:fornisseurs,company_name",
            "email" => "required|email|unique:fornisseurs,email",
            "telephone" => "required|unique:fornisseurs,telephone"
        ]);

        Supplier::create([
            "company_name" => $request->company_name,
            "email" => $request->email,
            "telephone" => $request->telephone
        ]);

        return redirect("/achats/suppliers")->with("success", "Fournisseur ajouté avec succès.");
    }

    public function delete_supplier(Request $request){
        $supplier = Supplier::findOrFail($request->id);

        if (
            Product::where("supplier_id", $supplier->id)->exists() ||
            Command::where("fornisseur_id", $supplier->id)->exists()
        ) {
            return back()->withErrors([
                "used" => "Impossible de supprimer ce fournisseur."
            ]);
        }

        $supplier->delete();
        return back()->with("success", "Fournisseur supprimé avec succès.");
    }

    public function edit_supplier(Request $request){
        $supplier = Supplier::findOrFail($request->id);

        return Inertia::render("admin/products/modifier_supplier", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "supplier" => $supplier
        ]);
    }

    public function save_edit_supplier(Request $request){
        $request->validate([
            "id" => "required|exists:fornisseurs,id",
            "company_name" => [
                "required",
                Rule::unique("fornisseurs", "company_name")->ignore($request->id),
            ],
            "email" => [
                "required",
                "email",
                Rule::unique("fornisseurs", "email")->ignore($request->id),
            ],
            "telephone" => [
                "required",
                Rule::unique("fornisseurs", "telephone")->ignore($request->id),
            ],
        ]);

        $supplier = Supplier::findOrFail($request->id);

        $supplier->update([
            "company_name" => $request->company_name,
            "email" => $request->email,
            "telephone" => $request->telephone,
        ]);

        return redirect("/achats/suppliers")->with("success", "Fournisseur modifié avec succès.");
    }

    public function incidents(){
        $incidents = Incident::all();
        foreach ($incidents as $incident) {
            $serial = ProductSerial::find($incident->product_serial_id);
            $product = Product::find($serial->product_id);

            $affectation = Affectation::where("product_serial_id", $serial->id)
                ->whereNull("returned_at")
                ->first();

            if ($affectation) {

                $user = User::find($affectation->employer_id);

                $incident->emp_name = $user->nom . " " . $user->prenom;
                $incident->cin = $user->cin;
                $incident->email = $user->email;

            } else {

                $incident->emp_name = "Aucun";
                $incident->cin = "-";
                $incident->email = "-";
            }

            $incident->product_name = $product->name;
            $incident->brand = $product->brand;
            $incident->model = $product->model;
            $incident->serial_number = $serial->serial_number;
        }

        return Inertia::render("admin/incidents", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "incidents" => $incidents
        ]);
    }

    public function changeIncidentStatus(Request $request){
        $incident = Incident::findOrFail($request->id);

        $incident->status = $request->status;

        $incident->save();

        return back();
    }

    public function products(){
        $products = Product::all();

        foreach ($products as $product) {

            $product->category = Category::find($product->category_id)?->name;
            $product->supplier = Supplier::find($product->supplier_id)?->company_name;
            $product->available = ProductSerial::where("product_id", $product->id)->where("status", "Disponible")->count();

            $product->assigned = ProductSerial::where("product_id", $product->id)->where("status", "Attribue")->count();
            $product->hors_service = ProductSerial::where("product_id", $product->id)->where("status", "Hors_service")->count();
        }

        return Inertia::render("admin/products", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "products" => $products
        ]);
    }

    public function delete_product(Request $request){
        $product = Product::findOrFail($request->id);

        if (ProductSerial::where("product_id", $product->id)->where("status", "!=", "Disponible")->exists()) {

            return back()->withErrors([
                "used" => "Impossible de supprimer ce produit."
            ]);
        }

        ProductSerial::where("product_id", $product->id)->delete();

        $product->delete();

        return back()->with("success", "Produit supprimé.");
    }

    public function add_product(){
        return Inertia::render("admin/add_product", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "categories" => Category::all(),
        ]);
    }

    public function save_product(Request $request){
        $request->validate([
            "name" => "required",
            "brand" => "required",
            "model" => "required",
            "category_id" => "required|exists:categories,id",
            'quantity' => "required|integer|min:0"
        ]);

        $product = Product::create([
            "name" => $request->name,
            "brand" => $request->brand,
            "model" => $request->model,
            "category_id" => $request->category_id,
            "quantity" => $request->quantity
        ]);

        for ($i = 0; $i < $request->quantity; $i++) {
            ProductSerial::create([
                "product_id" => $product->id,
                "serial_number" => strtoupper(Str::uuid()),
                "status" => "Disponible",
            ]);
        }

        return redirect("/achats/products")->with("success", "Produit ajouté avec succès.");
    }

    public function edit_product($id){
        $product = Product::findOrFail($id);

        return Inertia::render("admin/modifier_product", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "product" => $product,
            "categories" => Category::all(),
        ]);
    }

    public function save_edit_product(Request $request){
        
        $request->validate([
            "id" => "required|exists:products,id",
            "name" => "required",
            "brand" => "required",
            "model" => "required",
            "category_id" => "required|exists:categories,id",
            'quantity' => "required|integer|min:0"
            
        ]);
        

        $product = Product::findOrFail($request->id);

        $product->update([
            "name" => $request->name,
            "brand" => $request->brand,
            "model" => $request->model,
            "category_id" => $request->category_id,
            "supplier_id" => $request->supplier_id,
            "quantity" => $request->quantity
        ]);

        return redirect("/achats/products")->with("success", "Produit modifié avec succès.");
    }

    public function affectations(){
        $affectations = Affectation::with(["productSerial.product","employer"])->get();
        foreach ($affectations as $aff) {

            $aff->product_name = $aff->productSerial->product->name;
            $aff->brand = $aff->productSerial->product->brand;
            $aff->model = $aff->productSerial->product->model;

            $aff->serial_number = $aff->productSerial->serial_number;

            $aff->emp_name = $aff->employer->nom . " " . $aff->employer->prenom;
            $aff->cin = $aff->employer->cin;
        }

        return Inertia::render("admin/affectations", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "affectations" => $affectations,
        ]);
    }
    public function add_affectation(){
        $serials = ProductSerial::with("product")->where("status", "Disponible")->get();
        foreach ($serials as $serial) {

            $serial->product_name = $serial->product->name;
            $serial->brand = $serial->product->brand;
            $serial->model = $serial->product->model;

        }

        return Inertia::render("admin/add_affectation", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "serials" => $serials,
            "employers" => User::where("role", "employer")->get(),
        ]);
    }

    public function save_affectation(Request $request){
        $request->validate([
            "serial" => "required|exists:product_serials,id",
            "employer" => "required|exists:users,id",
        ]);
        $serial = ProductSerial::findOrFail($request->serial);
        if ($serial->status != "Disponible") {
            return back()->withErrors([
                "serial" => "Ce produit est déjà attribué."
            ]);
        }
        Affectation::create([
            "product_serial_id" => $serial->id,
            "employer_id" => $request->employer,
            "assigned_at" => now(),
            "returned_at" => null,
        ]);
        $serial->status = "Attribue";
        $serial->save();
        $product = $serial->product;
        $product->quantity = ProductSerial::where("product_id", $product->id)->where("status", "Disponible")->count();
        $product->save();
        return redirect("/affectations")->with("success", "Produit affecté avec succès.");
    }

    public function return_affectation(Request $request){
        $affectation = Affectation::findOrFail($request->id);
        if ($affectation->returned_at != null) {
            return back();
        }
        $affectation->returned_at = now();
        $affectation->save();
        $serial = ProductSerial::findOrFail($affectation->product_serial_id);
        $serial->status = "Disponible";
        $serial->save();
        $product = $serial->product;
        $product->quantity = ProductSerial::where("product_id", $product->id)->where("status", "Disponible")->count();

        $product->save();

        return back()->with("success", "Produit retourné avec succès.");
    }

    public function employers(){
        $employers = User::where("role", "employer")->get();

        foreach ($employers as $employer) {
            $employer->nb_products = Affectation::where("employer_id", $employer->id)->whereNull("returned_at")->count();
        }

        return Inertia::render("admin/employers", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "employers" => $employers,
        ]);
    }

    public function save_employer(Request $request){
        $request->validate([
            "nom" => "required",
            "prenom" => "required",
            "cin" => "required|unique:users,cin",
            "email" => "required|email|unique:users,email",
            "telephone" => "required|unique:users,telephone",
            "password" => "required|min:6",
        ]);

        User::create([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "cin" => $request->cin,
            "email" => $request->email,
            "telephone" => $request->telephone,
            "password" => bcrypt($request->password),
            "role" => "employer",
        ]);

        return redirect("/employers")->with("success", "Employé ajouté avec succès.");
    }

    public function delete_employer(Request $request){
        $employer = User::findOrFail($request->id);
        if (
            Affectation::where("employer_id", $employer->id)->whereNull("returned_at")->exists()
        ) {
            return back()->withErrors([
                "used" => "Impossible de supprimer cet employé car il possède encore des produits."
            ]);
        }
        $employer->delete();
        return back()->with("success", "Employé supprimé avec succès.");
    }

    public function edit_employer(Request $request){
        $employer = User::findOrFail($request->id);

        return Inertia::render("admin/edit_employer", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
            "employer" => $employer,
        ]);
    }
    public function save_edit_employer(Request $request){
        $request->validate([
            "id" => "required|exists:users,id",
            "nom" => "required",
            "prenom" => "required",
            "cin" => [
                "required",
                Rule::unique("users", "cin")->ignore($request->id),
            ],
            "email" => [
                "required",
                "email",
                Rule::unique("users", "email")->ignore($request->id),
            ],
            "telephone" => [
                "required",
                Rule::unique("users", "telephone")->ignore($request->id),
            ],
        ]);

        $employer = User::findOrFail($request->id);

        $employer->update([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "cin" => $request->cin,
            "email" => $request->email,
            "telephone" => $request->telephone,
        ]);

        return redirect("/employers")->with("success", "Employé modifié avec succès.");
    }
}