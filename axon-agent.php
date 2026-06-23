<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

function load_env_file($file) {
    if (!is_readable($file)) return;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v, " \t\n\r\0\x0B\"'");
        if ($k !== '' && getenv($k) === false) putenv($k . '=' . $v);
    }
}

load_env_file(__DIR__ . '/.env.local');
load_env_file(dirname(__DIR__) . '/.env.local');

function respond_json($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function clean_text($value, $limit = 8000) {
    $value = trim(strip_tags((string)$value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit) : substr($value, 0, $limit);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) respond_json(400, ['success' => false, 'message' => 'Invalid request.']);

$question = clean_text($input['question'] ?? '', 8000);
$systemPrompt = clean_text($input['systemPrompt'] ?? '', 10000);
$mode = clean_text($input['mode'] ?? 'ask_axon', 80);

if ($question === '') respond_json(422, ['success' => false, 'message' => 'Please enter your question.']);

$apiKey = getenv('MOONSHOT_API_KEY');
if (!$apiKey) respond_json(500, ['success' => false, 'message' => 'Ask Axon AI is not configured yet.']);

$model = getenv('MOONSHOT_MODEL') ?: 'kimi-k2-0905-preview';

$defaultSystemPrompt = "You are Axon AI Agent, a practical website, hosting, forms, Wix, AI chatbot, AI app builder, AI-readiness and business technology support advisor for business owners. Answer in plain English and in useful detail. Do not be too brief. Always answer the actual question even if the user wording is informal or has typos. Classify the request first and focus on the relevant Axon area: website, hosting, domain/DNS, forms, email, Google Workspace, Microsoft 365, Wix, WordPress, Shopify, SEO, AI search, AI app publishing, chatbot, automation, security, backup or business technology advisory. If the user asks about building an app using AI, AI app builders, Lovable, Bolt, Replit, SaaS, portals, dashboards or app publishing, explain that AI tools can create prototypes quickly but real business apps still need requirements, database, login, payment, hosting, security, backups, testing and support. If the user asks a short generic phrase such as payment gateway, website slow, form not working, chatbot, hosting, domain, email, SEO or AI ready, do not give a vague answer. Treat it as a request for practical explanation, possible causes or setup items, safe checks and Axon next steps. For payment gateway questions, explain setup versus troubleshooting, including Stripe/PayNow/card payment, checkout page, forms, receipts, webhook/notification, business verification, test payments and website integration. Explain what could be happening or involved, what the user can safely check first, what needs an IT person, and when Axon should assist. If the user message includes BASIC LIVE WEBSITE CHECK RESULTS, use those results as the basis of the website advisory. Mention likely platform/build type with confidence language only. Explain that the scan is a basic single-page check and not a full audit. Always end by suggesting the user submit the form or use WhatsApp for immediate support if they want Axon to help.";
if ($systemPrompt === '') $systemPrompt = $defaultSystemPrompt;

$messages = [
    ['role' => 'system', 'content' => $systemPrompt],
    ['role' => 'user', 'content' => $question]
];

$payload = [
    'model' => $model,
    'messages' => $messages,
    'temperature' => 0.35,
    'max_tokens' => 2200
];

$ch = curl_init('https://api.moonshot.ai/v1/chat/completions');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 45);
$result = curl_exec($ch);
$curlError = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($result === false || $code < 200 || $code >= 300) {
    error_log('Ask Axon AI error: ' . $code . ' ' . $curlError . ' ' . $result);
    respond_json(502, ['success' => false, 'message' => 'Ask Axon AI is temporarily unavailable.']);
}

$data = json_decode($result, true);
$reply = $data['choices'][0]['message']['content'] ?? '';
$reply = clean_text($reply, 12000);

if ($reply === '') respond_json(502, ['success' => false, 'message' => 'Ask Axon AI returned an empty response.']);

respond_json(200, [
    'success' => true,
    'reply' => $reply,
    'mode' => $mode
]);
