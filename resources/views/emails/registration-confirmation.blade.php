<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Registro - NMAX 0Km</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .registration-details {
            background: #f1f5f9;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-item {
            margin-bottom: 10px;
        }
        .detail-label {
            color: #64748b;
            font-size: 0.9em;
            font-weight: 500;
        }
        .detail-value {
            color: #1e293b;
            font-weight: 600;
        }
        .number-box {
            background: linear-gradient(135deg, #1e40af, #2563eb);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
        }
        .number-label {
            color: #ffffff;
            font-size: 1.1em;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .number {
            font-size: 48px;
            color: #ffffff;
            font-weight: 700;
            letter-spacing: 4px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 10px 0;
        }
        .number-note {
            color: #ffffff;
            font-size: 0.9em;
            opacity: 0.9;
        }
        .rules {
            background: #f8fafc;
            padding: 25px;
            border-radius: 10px;
            margin-top: 30px;
            border: 1px solid #e2e8f0;
        }
        .rules h2 {
            color: #1e40af;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .rules ul {
            padding-left: 20px;
            margin: 0;
        }
        .rules li {
            margin-bottom: 12px;
            position: relative;
            padding-left: 25px;
            color: #334155;
        }
        .rules li:before {
            content: "•";
            color: #3b82f6;
            font-size: 20px;
            position: absolute;
            left: 0;
            top: -2px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #64748b;
            font-size: 14px;
            font-weight: 300;
        }
        .timestamp {
            color: #64748b;
            font-size: 0.9em;
            text-align: right;
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Registro Exitoso!</h1>
        <p>Actividad NMAX 0Km Pool Party</p>
    </div>

    <div class="content">
        <p>Hola {{ $registration->nombre }},</p>
        
        <p>¡Tu registro ha sido confirmado exitosamente! A continuación, encontrarás los detalles de tu registro:</p>

        <div class="registration-details">
            <div class="detail-item">
                <span class="detail-label">Nombre:</span><br>
                <span class="detail-value">{{ $registration->nombre }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Identificación:</span><br>
                <span class="detail-value">{{ $registration->identificacion }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Fecha y hora de registro:</span><br>
                <span class="detail-value">
                    {{ \Carbon\Carbon::parse($registration->created_at)->format('d/m/Y h:i A') }}
                </span>
            </div>
        </div>

        <div class="number-box">
            <div class="number-label">Tu número asignado es</div>
            <div class="number">{{ $registration->numero_asignado }}</div>
            <div class="number-note">Este es tu número único para la actividad</div>
        </div>

        <div class="rules">
            <h2>Reglas de la Actividad</h2>
            <ul>
                <li>El Participante debe estar presente el evento</li>
                <li>Debe presentar su documento de Identidad</li>
                <li>Cada participante puede registrarse una sola vez</li>
                <li>Se te asignará un número único entre 0000 y 9999</li>
                <li>Recibirás un correo con la confirmación y tu número</li>
                <li>El registro es personal e intransferible</li>
                <li>Conserva tu número para futura referencia</li>
            </ul>
        </div>

        <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
            
        </div>
    </div>
</body>
</html>