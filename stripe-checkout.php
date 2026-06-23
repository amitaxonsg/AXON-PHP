<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function load_local_env($path) {
    if (!is_readable($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim(trim($value), "\"'");
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

load_local_env(__DIR__ . '/.env.local');
load_local_env(dirname(__DIR__) . '/.env.local');

function json_input() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function clean_text($value, $max = 500) {
    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    return mb_substr($value, 0, $max);
}

function is_valid_email_or_empty($email) {
    return $email === '' || filter_var($email, FILTER_VALIDATE_EMAIL);
}

$data = json_input();
$hours = (int) ($data['hours'] ?? 1);
$hours = max(1, min(40, $hours));
$hourlyRate = $hours >= 5 ? 80 : 100;
$amountCents = $hours * $hourlyRate * 100;

$name = clean_text($data['name'] ?? '', 120);
$email = clean_text($data['email'] ?? '', 180);
$phone = clean_text($data['phone'] ?? '', 80);
$project = clean_text($data['project'] ?? '', 500);

if ($name === '' || $email === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter your name and email before payment.']);
    exit;
}

if (!is_valid_email_or_empty($email)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$stripeSecretKey = getenv('STRIPE_SECRET_KEY') ?: '';
if ($stripeSecretKey === '') {
    error_log('STRIPE_SECRET_KEY is missing.');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Stripe is not configured yet.']);
    exit;
}

$siteUrl = rtrim(getenv('AXON_SITE_URL') ?: 'https://axon.com.sg', '/');
$successUrl = getenv('STRIPE_SUCCESS_URL') ?: $siteUrl . '/credit-success.html?session_id={CHECKOUT_SESSION_ID}';
$cancelUrl = getenv('STRIPE_CANCEL_URL') ?: $siteUrl . '/credit-top-up.html?checkout=cancelled';

$params = [
    'mode' => 'payment',
    'success_url' => $successUrl,
    'cancel_url' => $cancelUrl,
    'customer_email' => $email,
    'client_reference_id' => 'axon-credit-' . $hours . 'h-' . time(),
    'phone_number_collection[enabled]' => 'true',
    'billing_address_collection' => 'auto',
    'line_items[0][quantity]' => 1,
    'line_items[0][price_data][currency]' => 'usd',
    'line_items[0][price_data][unit_amount]' => $amountCents,
    'line_items[0][price_data][product_data][name]' => 'Axon Support Credits - ' . $hours . ' hour' . ($hours === 1 ? '' : 's'),
    'line_items[0][price_data][product_data][description]' => 'Prepaid remote support credits valid for 3 months.',
    'metadata[customer_name]' => $name,
    'metadata[customer_email]' => $email,
    'metadata[customer_phone]' => $phone,
    'metadata[hours]' => (string) $hours,
    'metadata[hourly_rate_usd]' => (string) $hourlyRate,
    'metadata[project_note]' => $project,
    'payment_intent_data[metadata][customer_name]' => $name,
    'payment_intent_data[metadata][customer_email]' => $email,
    'payment_intent_data[metadata][customer_phone]' => $phone,
    'payment_intent_data[metadata][hours]' => (string) $hours,
    'payment_intent_data[metadata][hourly_rate_usd]' => (string) $hourlyRate,
    'payment_intent_data[metadata][project_note]' => $project,
];

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => $stripeSecretKey . ':',
    CURLOPT_POSTFIELDS => http_build_query($params),
    CURLOPT_TIMEOUT => 20,
]);

$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$response = json_decode((string) $responseBody, true);

if ($responseBody === false || $status < 200 || $status >= 300 || empty($response['url'])) {
    error_log('Stripe Checkout failed. HTTP ' . $status . ' Error: ' . $curlError . ' Body: ' . $responseBody);
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Unable to start Stripe checkout right now. Please contact Axon.']);
    exit;
}

echo json_encode([
    'success' => true,
    'checkoutUrl' => $response['url'],
    'hours' => $hours,
    'amount' => $hours * $hourlyRate,
]);
