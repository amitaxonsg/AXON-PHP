<?php
header('Content-Type: application/json');

function reply_json($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function normalize_url($url) {
    $url = trim((string)$url);
    if ($url === '') return '';
    if (!preg_match('/^https?:\/\//i', $url)) $url = 'https://' . $url;
    return filter_var($url, FILTER_VALIDATE_URL) ? $url : '';
}

function is_public_host($host) {
    $ips = @dns_get_record($host, DNS_A + DNS_AAAA);
    if (!$ips) return true;
    foreach ($ips as $record) {
        $ip = $record['ip'] ?? ($record['ipv6'] ?? null);
        if (!$ip) continue;
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return false;
        }
    }
    return true;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = $_POST;
$url = normalize_url($input['url'] ?? '');
if (!$url) reply_json(422, ['success' => false, 'message' => 'Please enter a valid website URL.']);

$parts = parse_url($url);
$host = $parts['host'] ?? '';
if (!$host || !is_public_host($host)) reply_json(422, ['success' => false, 'message' => 'This website address cannot be reviewed from here.']);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 4,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_USERAGENT => 'Ask Axon Website Advisory Review',
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);
$html = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
$error = curl_error($ch);
curl_close($ch);

if (!$html || $status >= 400) {
    reply_json(200, [
        'success' => true,
        'url' => $url,
        'finalUrl' => $finalUrl ?: $url,
        'status' => $status,
        'note' => 'The website could not be read fully. The advisory should be based on the URL and any notes provided by the client.',
        'error' => $error,
    ]);
}

$sample = substr($html, 0, 250000);
$title = '';
$description = '';
$h1 = [];
$h2 = [];
$hasViewport = false;

if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $sample, $m)) $title = trim(strip_tags($m[1]));
if (preg_match('/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']/i', $sample, $m)) $description = trim($m[1]);
if (preg_match('/<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']/i', $sample, $m)) $description = trim($m[1]);
preg_match_all('/<h1[^>]*>(.*?)<\/h1>/is', $sample, $h1Matches);
preg_match_all('/<h2[^>]*>(.*?)<\/h2>/is', $sample, $h2Matches);
foreach (($h1Matches[1] ?? []) as $item) $h1[] = trim(preg_replace('/\s+/', ' ', strip_tags($item)));
foreach (($h2Matches[1] ?? []) as $item) $h2[] = trim(preg_replace('/\s+/', ' ', strip_tags($item)));
$hasViewport = (bool)preg_match('/<meta[^>]+name=["\']viewport["\']/i', $sample);

reply_json(200, [
    'success' => true,
    'url' => $url,
    'finalUrl' => $finalUrl ?: $url,
    'status' => $status,
    'title' => $title,
    'description' => $description,
    'h1' => array_values(array_filter(array_slice($h1, 0, 3))),
    'h2' => array_values(array_filter(array_slice($h2, 0, 8))),
    'hasViewport' => $hasViewport,
    'usesHttps' => stripos($finalUrl ?: $url, 'https://') === 0,
    'note' => 'This is only a basic page snapshot for an AI Website Advisory Review, not a full technical audit.'
]);
