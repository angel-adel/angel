<?php
// ========== НАСТРОЙКИ (укажите свои) ==========
$to = 'adel.angel2026@gmail.com'; // <--- Ваша техническая почта
$subject_prefix = 'Bug Report from Poetry Site';
// ===============================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}

$url = $_POST['url'] ?? 'Не указан';
$user_agent = $_POST['user_agent'] ?? 'Не указан';
$resolution = $_POST['resolution'] ?? 'Не указан';
$description = $_POST['description'] ?? 'Без описания';
$screenshot_data = $_POST['screenshot'] ?? '';

// Валидация: описание обязательно
if (empty($description)) {
    http_response_code(400);
    echo 'Описание обязательно';
    exit;
}

$subject = "$subject_prefix: " . substr($description, 0, 50);

// Формируем письмо
$boundary = md5(time());
$headers = "From: $to\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= "Страница: $url\n";
$body .= "Браузер: $user_agent\n";
$body .= "Разрешение экрана: $resolution\n";
$body .= "Описание проблемы:\n$description\n\n";
$body .= "--$boundary\r\n";

if (!empty($screenshot_data)) {
    $screenshot_data = preg_replace('#^data:image/\w+;base64,#i', '', $screenshot_data);
    $screenshot_data = str_replace(' ', '+', $screenshot_data);
    $decoded = base64_decode($screenshot_data);
    
    if ($decoded !== false) {
        $attachment = chunk_split(base64_encode($decoded));
        $body .= "Content-Type: image/png; name=\"screenshot.png\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"screenshot.png\"\r\n\r\n";
        $body .= $attachment . "\r\n";
    }
}

$body .= "--$boundary--";

if (mail($to, $subject, $body, $headers)) {
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Ошибка отправки';
}
