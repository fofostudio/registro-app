<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationConfirmation;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'telefono' => 'required|string',
            'identificacion' => 'required|string|unique:registrations',
            'correo' => 'required|email'
        ]);

        // Generar número único
        do {
            $numero = str_pad(rand(0, 4999), 4, '0', STR_PAD_LEFT);
        } while (Registration::where('numero_asignado', $numero)->exists());

        $registration = Registration::create([
            'nombre' => $request->nombre,
            'telefono' => $request->telefono,
            'identificacion' => $request->identificacion,
            'correo' => $request->correo,
            'numero_asignado' => $numero
        ]);

        // Enviar email
        Mail::to($request->correo)->send(new RegistrationConfirmation($registration));

        return response()->json(['registration' => $registration]);
    }

    public function index()
    {
        return response()->json(['registrations' => Registration::all()]);
    }
    public function getStats()
    {
        $totalAssigned = Registration::count();

        return response()->json([
            'total_assigned' => $totalAssigned
        ]);
    }
}
