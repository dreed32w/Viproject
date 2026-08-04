<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use App\http\Controllers\AccController;
use App\http\Controllers\AdminController;

use Illuminate\Support\Facades\Auth;
use App\http\Controllers\EmployerController;

Route::get('/', function () {
    if(Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->dashboard();
    if(Auth::check() && Auth::user()->role == "employer")
        return app(EmployerController::class)->dashboard();

    return redirect("/login");
});

Route::get("/login", function(){
    if(!Auth::check())
        return Inertia::render('acc/login');
    return redirect('/');
});
Route::post("/login", [AccController::class, 'login']);

Route::post("/logout",[AccController::class,"logout"]);

Route::get("/change-password", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->change_pass();
    if (Auth::check() && Auth::user()->role == "employer")
        return app(EmployerController::class)->change_pass();

    return redirect("/login");
});

Route::post("/change-password", function (Request $request) {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->save_change_pass($request);
    if (Auth::check() && Auth::user()->role == "employer")
        return app(EmployerController::class)->save_change_pass($request);

    return redirect("/login");
});

Route::get("/SendMail", function(){
    if(!Auth::check())
        return Inertia::render('acc/send_mail');
    return redirect('/');
});

Route::post("/SendMail", [AccController::class, 'SendMail']);

Route::get("/ResetPass", function(Request $request){
    $user = User::where('token', $request->token)->first();
    if(!$request->token || $request->token == '' || !$user){
        return redirect('/');
    }
    return Inertia::render("acc/reset_pass",[
        "token"=>$request->token
    ]);
});

Route::post('/ResetPass', [AccController::class, 'ResetPass']);




//==Admin=================================
// Admin

Route::get("/achats", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return Inertia::render("admin/achats", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
        ]);

    return redirect("/");
});



// Commands

Route::get("/achats/commands", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->commands();

    return redirect("/");
});

Route::get("/achats/addCommand", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->add_command();

    return redirect("/");
});

Route::post("/command/save", [AdminController::class, "save_command"]);
Route::post("/command/receive", [AdminController::class, "receive_command"]);

Route::post("/command/delete", [AdminController::class, "delete_command"]);

Route::get("/command/view/{id}", [AdminController::class, "view_command"]);

Route::post("/command/edit", [AdminController::class, "edit_command"]);
Route::post("/command/edit/save", [AdminController::class, "save_edit_command"]);




// Products

Route::get("/achats/products", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->products();

    return redirect("/");
});



Route::post("/product/delete", [AdminController::class, "delete_product"]);
Route::get("/product/add", [AdminController::class, "add_product"]);
Route::post("/product/add/save", [AdminController::class, "save_product"]);
Route::get("/product/edit/{id}", [AdminController::class, "edit_product"]);
Route::post("/product/edit/save", [AdminController::class, "save_edit_product"]);




// Categories

Route::get("/achats/categories", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->categories();

    return redirect("/");
});

Route::post("/category/save", [AdminController::class, "save_category"]);

Route::post("/category/delete", [AdminController::class, "delete_category"]);

Route::post("/category/edit", [AdminController::class, "edit_category"]);
Route::post("/category/edit/save", [AdminController::class, "save_edit_category"]);




// Suppliers

Route::get("/achats/suppliers", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->suppliers();

    return redirect("/");
});

Route::get("/achats/addSupplier", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return Inertia::render("admin/products/add_supplier", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
        ]);

    return redirect("/");
});

Route::post("/supplier/save", [AdminController::class, "save_supplier"]);

Route::post("/supplier/delete", [AdminController::class, "delete_supplier"]);

Route::post("/supplier/edit", [AdminController::class, "edit_supplier"]);
Route::post("/supplier/edit/save", [AdminController::class, "save_edit_supplier"]);



//=========================================================

Route::get("/affectations", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->affectations();

    return redirect("/");
});

Route::get("/affectation/add", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->add_affectation();

    return redirect("/");
});

Route::post("/affectation/save", [AdminController::class, "save_affectation"]);

Route::post("/affectation/return", [AdminController::class, "return_affectation"]);

//=========================================================

Route::get("/employers", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return app(AdminController::class)->employers();

    return redirect("/");
});

Route::get("/employer/add", function () {
    if (Auth::check() && Auth::user()->role == "admin")
        return Inertia::render("admin/add_employer", [
            "username" => Auth::user()->nom . " " . Auth::user()->prenom,
        ]);

    return redirect("/");
});

Route::post("/employer/save", [AdminController::class, "save_employer"]);
Route::post("/employer/delete", [AdminController::class, "delete_employer"]);
Route::post("/employer/edit", [AdminController::class, "edit_employer"]);
Route::post("/employer/edit/save", [AdminController::class, "save_edit_employer"]);


Route::get("/incidents", function(){
    if(Auth::check() && Auth::user()->role=="admin")
        return app(AdminController::class)->incidents();
    return redirect('/');
});
Route::post("/incident/changeStatus",[AdminController::class,"changeIncidentStatus"]);



//Employer==============================================

Route::get("/MyProducts", function(){
    if(Auth::check() && Auth::user()->role=="employer")
        return app(EmployerController::class)->get_products();
    return redirect('/');
});

Route::post("/incident/new", [EmployerController::class, "new_incident"]);
Route::post("/incident/save", [EmployerController::class, "save_incident"]);
Route::get("/MyIncident", function(){
    if(Auth::check() && Auth::user()->role=="employer")
        return app(EmployerController::class)->get_incidents();
    return redirect('/');
});
Route::post("/confirm/resoulation", [EmployerController::class, "confirm_resoulation"]);