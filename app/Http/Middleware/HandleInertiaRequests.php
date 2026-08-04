<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success_envoyee'      => $request->session()->get('success_envoyee'),
                'success_change'       => $request->session()->get('success_change'),
                'success_delete'       => $request->session()->get('success_delete'),
                'reci_dammand'         => $request->session()->get('reci_dammand'),
                'success_EmployerC'    => $request->session()->get('success_EmployerC'),
                'success_addAffectation'=> $request->session()->get('success_addAffectation'),
                'modifier_success'     => $request->session()->get('modifier_success'),
                'success_incident'     => $request->session()->get('success_incident'),
                'success_res'          => $request->session()->get('success_res'),
                'success'              => $request->session()->get('success'),
                'error'                => $request->session()->get('error'),
            ],
        ];
    }
}
