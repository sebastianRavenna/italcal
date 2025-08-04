<?php
// Configuración básica
$to_email = 'info@italcal.com.ar';
$from_email = 'noreply@italcal.com.ar';

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Método no permitido']));
}

// Establecer header JSON
header('Content-Type: application/json');

// Obtener datos del formulario
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$empresa = isset($_POST['empresa']) ? trim($_POST['empresa']) : '';
$asunto = isset($_POST['asunto']) ? trim($_POST['asunto']) : '';
$mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

// Validación básica
if (empty($nombre) || empty($email) || empty($telefono) || empty($asunto) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, complete todos los campos obligatorios.']);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, ingrese un correo electrónico válido.']);
    exit;
}

// Mapear asuntos para el email
$asuntos_map = [
    'servicios' => 'Servicios',
    'calibraciones' => 'Calibraciones', 
    'equipamiento' => 'Equipamiento',
    'consulta' => 'Consulta General'
];

$asunto_texto = isset($asuntos_map[$asunto]) ? $asuntos_map[$asunto] : $asunto;

// Preparar el email
$subject = "Nuevo contacto desde Italcal.com.ar - $asunto_texto";
$email_body = "
Nuevo mensaje de contacto desde el sitio web de Italcal:

Nombre: $nombre
Email: $email
Teléfono: $telefono
Empresa: " . ($empresa ? $empresa : 'No especificada') . "
Asunto: $asunto_texto
Fecha: " . date('d/m/Y H:i:s') . "
IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'No disponible') . "

Mensaje:
$mensaje

---
Este mensaje fue enviado desde el formulario de contacto de italcal.com.ar
";

$headers = "From: $from_email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Intentar enviar el email
$mail_sent = @mail($to_email, $subject, $email_body, $headers);

if ($mail_sent) {
    // Log del mensaje enviado (opcional)
    $log_entry = date('Y-m-d H:i:s') . " - Contacto desde: $email ($nombre) - Asunto: $asunto_texto - IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n";
    @file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.']);
} else {
    // Log del error
    error_log('Error al enviar email de contacto desde: ' . $email);
    echo json_encode(['success' => false, 'message' => 'Error al enviar el mensaje. Por favor, inténtelo más tarde o contacte directamente por email.']);
}
?>