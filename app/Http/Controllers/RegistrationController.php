<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationConfirmation;
use App\Models\Unique;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $messages = [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.string' => 'El nombre debe ser texto',
            'telefono.required' => 'El teléfono es obligatorio',
            'telefono.string' => 'El teléfono debe ser texto',
            'identificacion.required' => 'La cédula es obligatoria',
            'identificacion.string' => 'La cédula debe ser texto',
            'identificacion.unique' => 'Esta cédula ya está registrada en el sistema',
            'correo.required' => 'El correo electrónico es obligatorio',
            'correo.email' => 'El correo electrónico debe tener un formato válido'
        ];
    
        $request->validate([
            'nombre' => 'required|string',
            'telefono' => 'required|string',
            'identificacion' => 'required|string|unique:registrations',
            'correo' => 'required|email'
        ], $messages);
    
        // Obtener el número especial de la tabla unique
        $numeroEspecial = Unique::first()->numero_especial ?? '5276';
    
        // Generar número único
        do {
            $numero = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        } while ($numero == $numeroEspecial || Registration::where('numero_asignado', $numero)->exists());
    
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
    
    public function registerWin(Request $request)
    {
        try {
            // Limpiando los parámetros de la URL
            $nombre = trim($request->query('nombre'), '"');
            $telefono = trim($request->query('Telefono'), '"');
            $identificacion = trim($request->query('Identificacion'), '"');
            $correo = trim($request->query('Correo'), '"');
    
            $validator = Validator::make([
                'nombre' => $nombre,
                'telefono' => $telefono,
                'identificacion' => $identificacion,
                'correo' => $correo
            ], [
                'nombre' => 'required|string',
                'telefono' => 'required|string',
                'identificacion' => 'required|string|unique:registrations',
                'correo' => 'required|email'
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
    
            // Obtener el número especial de la tabla unique
            $numeroEspecial = Unique::first()->numero_especial ?? '5276';
    
            // Verificar si el número especial ya está asignado
            if (Registration::where('numero_asignado', $numeroEspecial)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'El número especial ' . $numeroEspecial . ' ya ha sido asignado'
                ], 400);
            }
    
            $registration = Registration::create([
                'nombre' => $nombre,
                'telefono' => $telefono,
                'identificacion' => $identificacion,
                'correo' => $correo,
                'numero_asignado' => $numeroEspecial
            ]);
    
            // Enviar email
            Mail::to($correo)->send(new RegistrationConfirmation($registration));
    
            return response()->json([
                'success' => true,
                'message' => 'Registro exitoso con número especial ' . $numeroEspecial,
                'registration' => $registration
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en el registro',
                'error' => $e->getMessage()
            ], 500);
        }
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
