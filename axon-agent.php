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
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_text($value, $limit = 8000) {
    $value = trim(strip_tags((string)$value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit) : substr($value, 0, $limit);
}

function normalize_query($value) {
    $value = strtolower((string)$value);
    $value = preg_replace('/[^a-z0-9+.\s]+/', ' ', $value);
    $value = preg_replace('/\s+/', ' ', $value);
    return trim($value);
}

function load_question_bank() {
    $file = __DIR__ . '/non-it-executive-questions.json';
    if (!is_readable($file)) return [];
    $json = file_get_contents($file);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function keyword_score($query, $entry) {
    $score = 0;
    $keywords = $entry['keywords'] ?? [];
    foreach ($keywords as $keyword) {
        $kw = normalize_query($keyword);
        if ($kw === '') continue;
        if (strpos($query, $kw) !== false) {
            $score += max(6, min(20, strlen($kw)));
        } else {
            $parts = array_filter(explode(' ', $kw), function($p) { return strlen($p) >= 3; });
            $hit = 0;
            foreach ($parts as $part) {
                if (strpos($query, $part) !== false) $hit++;
            }
            if ($hit > 0 && count($parts) > 0) $score += $hit;
        }
    }

    $question = normalize_query($entry['question'] ?? '');
    foreach (array_filter(explode(' ', $question), function($p) { return strlen($p) >= 5; }) as $word) {
        if (strpos($query, $word) !== false) $score += 1;
    }
    return $score;
}

function best_question_bank_match($question) {
    $bank = load_question_bank();
    if (!$bank) return null;
    $query = normalize_query($question);
    if ($query === '') return null;

    $best = null;
    $bestScore = 0;
    foreach ($bank as $entry) {
        if (!is_array($entry)) continue;
        $score = keyword_score($query, $entry);
        if ($score > $bestScore) {
            $best = $entry;
            $bestScore = $score;
        }
    }

    return ($best && $bestScore >= 6) ? $best : null;
}

function market_related_page($entry) {
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    if (strpos($host, 'philippines') !== false && !empty($entry['related_page_ph'])) return $entry['related_page_ph'];
    return $entry['related_page'] ?? 'contact.html';
}

function business_help_page() {
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    return strpos($host, 'philippines') !== false ? 'business-technology-help-philippines.html' : 'business-technology-help.html';
}

function question_bank_reply($entry) {
    $page = market_related_page($entry);
    $service = $entry['recommended_service'] ?? 'Axon Technology Advisory';
    $urgency = $entry['urgency'] ?? 'medium';

    $reply = "1. What this likely means\n";
    $reply .= ($entry['plain_english_answer'] ?? 'This looks like a business technology question that needs practical review.') . "\n\n";
    $reply .= "2. What to check first\n";
    $reply .= ($entry['recommended_action'] ?? 'Prepare your website URL, current platform, screenshots, error messages and what you want to achieve.') . "\n\n";
    $reply .= "3. DIY, IT person, or Axon help\n";
    $reply .= "DIY possible: " . ($entry['diy_possible'] ?? 'Partly') . ".\n";
    $reply .= ($entry['when_to_call_axon'] ?? 'Ask Axon if the issue affects enquiries, email, payments, security, search visibility, customer data or business operations.') . "\n\n";
    $reply .= "4. Recommended Axon service\n";
    $reply .= $service . " (urgency: " . $urgency . ").\n\n";
    $reply .= "5. Best next step\n";
    $reply .= "Share your website URL, current system, screenshot/error message and what result you want. Axon can advise the safest practical next step.\n\n";
    $reply .= "Recommended Axon pages to read:\n";
    $reply .= "[Read: " . $service . "](" . $page . ")\n";
    $reply .= "[Read: Business Technology Help](" . business_help_page() . ")\n\n";
    $reply .= "[WhatsApp Axon](https://wa.me/639614044560)   [Submit Contact Form](contact.html)";
    return $reply;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) respond_json(400, ['success' => false, 'message' => 'Invalid request.']);

$question = clean_text($input['question'] ?? ($input['message'] ?? ($input['prompt'] ?? '')), 8000);
$systemPrompt = clean_text($input['systemPrompt'] ?? '', 10000);
$mode = clean_text($input['mode'] ?? 'ask_axon', 80);

if ($question === '') respond_json(422, ['success' => false, 'message' => 'Please enter your question.']);

/*
 * Local Axon question bank first.
 * This handles common business-owner questions fast, avoids generic replies,
 * and still keeps Kimi as fallback for questions not covered by the bank.
 * Website audit mode is excluded because it must use the scan findings.
 */
if ($mode !== 'website_audit') {
    $bankMatch = best_question_bank_match($question);
    if ($bankMatch) {
        $bankReply = question_bank_reply($bankMatch);
        respond_json(200, [
            'success' => true,
            'reply' => $bankReply,
            'answer' => $bankReply,
            'mode' => $mode,
            'source' => 'non_it_executive_question_bank',
            'matched_id' => $bankMatch['id'] ?? null,
            'matched_category' => $bankMatch['category'] ?? null
        ]);
    }
}

$apiKey = getenv('MOONSHOT_API_KEY');
if (!$apiKey) {
    respond_json(500, [
        'success' => false,
        'message' => 'Ask Axon AI is not configured yet, and no question-bank match was found.'
    ]);
}

$model = getenv('MOONSHOT_MODEL') ?: 'kimi-k2-0905-preview';

$defaultSystemPrompt = "You are Axon AI Agent, a practical website, hosting, forms, Wix, AI chatbot, AI app builder, AI-readiness and business technology support advisor for business owners. Answer in plain English and in useful detail. Do not be too brief. Always answer the actual question even if the user wording is informal or has typos. Classify the request first and focus on the relevant Axon area: website, hosting, domain/DNS, forms, email, Google Workspace, Microsoft 365, Wix, WordPress, Shopify, SEO, AI search, AI app publishing, chatbot, automation, security, backup or business technology advisory. If the user asks about Axon contact details, address, phone, WhatsApp, location or office, explain that Axon supports Singapore, Philippines/Clark and remote clients, and direct them to WhatsApp and the Contact page rather than inventing a walk-in address. If the user asks about building an app using AI, AI app builders, Lovable, Bolt, Replit, SaaS, portals, dashboards or app publishing, explain that AI tools can create prototypes quickly but real business apps still need requirements, database, login, payment, hosting, security, backups, testing and support. If the user asks a short generic phrase such as payment gateway, website slow, form not working, chatbot, hosting, domain, email, SEO or AI ready, do not give a vague answer. Treat it as a request for practical explanation, possible causes or setup items, safe checks and Axon next steps. For payment gateway questions, explain setup versus troubleshooting, including Stripe/PayNow/card payment, checkout page, forms, receipts, webhook/notification, business verification, test payments and website integration. Explain what could be happening or involved, what the user can safely check first, what needs an IT person, and when Axon should assist. If the user message includes BASIC LIVE WEBSITE CHECK RESULTS, use those results as the basis of the website advisory. Mention likely platform/build type with confidence language only. Explain that the scan is a basic single-page check and not a full audit. Always end by suggesting the user submit the form or use WhatsApp for immediate support if they want Axon to help.";
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
    'answer' => $reply,
    'mode' => $mode,
    'source' => 'kimi_fallback'
]);
