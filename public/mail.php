<?php
// Почтовый ящик-получатель и отправитель — реальный ящик на домене.
// Отправка на тот же домен = локальная доставка, проходит надёжно;
// From с реального ящика домена проходит SPF, не улетает в спам.
$to   = 'order@terex-plus.ru';
$from = 'order@terex-plus.ru';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$name     = trim($_POST['user_name']     ?? '');
$phone    = trim($_POST['user_phone']    ?? '');
$technics = trim($_POST['user_technics'] ?? '');
$rent     = trim($_POST['user_rent']     ?? '');
$mail     = trim($_POST['user_mail']     ?? '');

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

// MIME-кодирование заголовков с кириллицей, чтобы тема и имя не превращались в «кракозябры».
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$fromName       = '=?UTF-8?B?' . base64_encode('Терекс-Плюс') . '?=';

$headers  = "From: {$fromName} <{$from}>\r\n";
// Ответ из письма уйдёт клиенту: на его email, если указан, иначе хотя бы видно телефон.
$headers .= 'Reply-To: ' . ($mail !== '' ? $mail : $from) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 5-й параметр (-f) задаёт конверт-отправителя (Return-Path) — ключ к доставляемости на shared-хостинге.
if (mail($to, $encodedSubject, $body, $headers, '-f' . $from)) {
    http_response_code(200);
} else {
    http_response_code(500);
}
