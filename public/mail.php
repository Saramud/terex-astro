<?php
$to = 's.saramud@gmail.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$name     = trim($_POST['user_name']    ?? '');
$phone    = trim($_POST['user_phone']   ?? '');
$technics = trim($_POST['user_technics'] ?? '');
$rent     = trim($_POST['user_rent']    ?? '');
$mail     = trim($_POST['user_mail']    ?? '');

if (empty($phone)) {
    http_response_code(400);
    exit;
}

$subject = 'Заявка с сайта Terex-Plus';

$body  = "Имя: {$name}\n";
$body .= "Телефон: {$phone}\n";
if ($technics) $body .= "Техника: {$technics}\n";
if ($rent)     $body .= "Срок аренды: {$rent}\n";
if ($mail)     $body .= "Email: {$mail}\n";

$headers  = "From: noreply@terex-plus.ru\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
} else {
    http_response_code(500);
}
