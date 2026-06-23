<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

function respond_json($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function clean_text($value, $limit = 2000) {
    $value = trim(strip_tags((string)$value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit) : substr($value, 0, $limit);
}

function normalize_url($url) {
    $url = trim((string)$url);
    if ($url === '') return '';
    if (!preg_match('#^https?://#i', $url)) $url = 'https://' . $url;
    return $url;
}

function is_public_host($host) {
    if (!$host || preg_match('/(^|\.)localhost$/i', $host)) return false;
    $records = @dns_get_record($host, DNS_A + DNS_AAAA);
    if (!$records || !is_array($records)) return true; // Let cURL report failure if DNS is not available.
    foreach ($records as $record) {
        $ip = $record['ip'] ?? ($record['ipv6'] ?? null);
        if (!$ip) continue;
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) return false;
    }
    return true;
}

function fetch_url($url, $timeout = 15) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 4,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT => 'AxonWebsiteCheck/1.0 (+https://axon.com.sg)',
        CURLOPT_ENCODING => '',
        CURLOPT_HEADER => true,
    ]);
    $raw = curl_exec($ch);
    $err = curl_error($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    if ($raw === false) {
        return ['ok' => false, 'error' => $err ?: 'Unable to fetch URL', 'info' => $info, 'headers' => '', 'body' => ''];
    }

    $headerSize = $info['header_size'] ?? 0;
    $headers = substr($raw, 0, $headerSize);
    $body = substr($raw, $headerSize);
    if (strlen($body) > 700000) $body = substr($body, 0, 700000);

    return ['ok' => true, 'error' => '', 'info' => $info, 'headers' => $headers, 'body' => $body];
}

function extract_match($pattern, $html) {
    if (preg_match($pattern, $html, $m)) return trim(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    return '';
}

function has_pattern($pattern, $text) {
    return preg_match($pattern, $text) === 1;
}

function header_value($headers, $name) {
    $safe = preg_quote($name, '/');
    if (preg_match_all('/^' . $safe . ':\s*(.*?)\s*$/im', $headers, $matches) && !empty($matches[1])) {
        return trim(end($matches[1]));
    }
    return '';
}

function count_pattern($pattern, $text) {
    return preg_match_all($pattern, $text, $unused);
}

function bytes_to_label($bytes) {
    $bytes = (int)$bytes;
    if ($bytes <= 0) return 'Not detected';
    if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
    if ($bytes >= 1024) return round($bytes / 1024, 1) . ' KB';
    return $bytes . ' bytes';
}

function detect_platform($html, $headers, $finalUrl) {
    $all = strtolower($html . "\n" . $headers . "\n" . $finalUrl);
    $platforms = [];

    $checks = [
        'WordPress' => ['wp-content', 'wp-includes', 'wp-json', 'wordpress', 'woocommerce'],
        'Wix' => ['wixstatic.com', 'static.parastorage.com', 'x-wix', 'wix.com/website'],
        'Shopify' => ['cdn.shopify.com', 'shopify.theme', 'myshopify.com', 'shopify-section'],
        'Squarespace' => ['squarespace.com', 'static1.squarespace.com', 'squarespace-cdn'],
        'Webflow' => ['webflow.js', 'assets.website-files.com', 'data-wf-page'],
        'WooCommerce' => ['woocommerce', 'wc-cart-fragments', 'wp-content/plugins/woocommerce'],
        'Laravel/PHP app' => ['laravel_session', 'x-powered-by: php'],
        'React / Next-style app' => ['__next_data__', '/_next/static/', 'data-reactroot'],
        'Elementor / WordPress builder' => ['elementor', 'elementor-pro'],
        'Framer-style site' => ['framerusercontent.com', 'framer-motion'],
    ];

    foreach ($checks as $name => $needles) {
        foreach ($needles as $needle) {
            if (strpos($all, strtolower($needle)) !== false) {
                $platforms[$name] = true;
                break;
            }
        }
    }

    $detected = array_keys($platforms);
    if (empty($detected)) {
        $path = parse_url($finalUrl, PHP_URL_PATH) ?: '';
        if (preg_match('/\.php(\?|$)/i', $path) || stripos($headers, 'x-powered-by: php') !== false) {
            $detected[] = 'Custom PHP / HTML website';
        } else {
            $detected[] = 'Custom or static HTML website';
        }
    }

    $confidence = 'medium';
    if (count($detected) === 1 && in_array($detected[0], ['Custom or static HTML website', 'Custom PHP / HTML website'], true)) $confidence = 'low';
    if (count($detected) > 1 || $detected[0] !== 'Custom or static HTML website') $confidence = 'medium-high';

    return ['detected' => $detected, 'confidence' => $confidence];
}

function check_url_exists($url) {
    $result = fetch_url($url, 10);
    $code = $result['info']['http_code'] ?? 0;
    return ['exists' => $result['ok'] && $code >= 200 && $code < 400, 'status' => $code, 'url' => $url];
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = $_POST;
if (!is_array($input) || empty($input)) $input = $_GET;

$url = normalize_url($input['url'] ?? '');
if ($url === '') respond_json(422, ['success' => false, 'message' => 'Please enter a website URL.']);

$parts = parse_url($url);
if (!$parts || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true) || empty($parts['host'])) {
    respond_json(422, ['success' => false, 'message' => 'Please enter a valid website URL.']);
}

$host = strtolower($parts['host']);
if (!is_public_host($host)) respond_json(422, ['success' => false, 'message' => 'This website address cannot be checked.']);

$result = fetch_url($url);
$info = $result['info'];
$status = $info['http_code'] ?? 0;
$finalUrl = $info['url'] ?? $url;
$html = $result['body'];
$headers = $result['headers'];

if (!$result['ok'] || $status < 200 || $status >= 500) {
    respond_json(200, [
        'success' => true,
        'scan' => [
            'url' => $url,
            'finalUrl' => $finalUrl,
            'status' => $status,
            'loads' => false,
            'error' => $result['error'] ?: 'Website did not load successfully during the basic check.',
            'platform' => ['detected' => ['Unable to determine'], 'confidence' => 'low'],
        ]
    ]);
}

$title = extract_match('/<title[^>]*>(.*?)<\/title>/is', $html);
$description = extract_match('/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']/is', $html);
if ($description === '') $description = extract_match('/<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']/is', $html);
$canonical = extract_match('/<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']*)["\']/is', $html);
$viewport = has_pattern('/<meta[^>]+name=["\']viewport["\']/is', $html);
$og = has_pattern('/<meta[^>]+property=["\']og:/is', $html);
$twitter = has_pattern('/<meta[^>]+name=["\']twitter:/is', $html);
$schema = has_pattern('/application\/ld\+json/i', $html);
$ga4 = has_pattern('/G-[A-Z0-9]{6,}/', $html);
$gtm = has_pattern('/GTM-[A-Z0-9]+|GT-[A-Z0-9]+/', $html);
$forms = preg_match_all('/<form\b/i', $html, $unused);
$mailto = has_pattern('/mailto:/i', $html);
$whatsapp = has_pattern('/wa\.me|whatsapp/i', $html);

$imageCount = count_pattern('/<img\b/i', $html);
$scriptCount = count_pattern('/<script\b/i', $html);
$externalScriptCount = count_pattern('/<script\b[^>]+src=["\']/i', $html);
$styleBlockCount = count_pattern('/<style\b/i', $html);
$stylesheetCount = count_pattern('/<link\b[^>]+rel=["\'][^"\']*stylesheet/i', $html);
$cssCount = $styleBlockCount + $stylesheetCount;
$iframeCount = count_pattern('/<iframe\b/i', $html);
$videoCount = count_pattern('/<video\b|youtube\.com|vimeo\.com/i', $html);

$cacheControl = header_value($headers, 'cache-control');
$expiresHeader = header_value($headers, 'expires');
$contentEncoding = header_value($headers, 'content-encoding');
$serverHeader = header_value($headers, 'server');
$xPoweredBy = header_value($headers, 'x-powered-by');
$cfCache = header_value($headers, 'cf-cache-status');
$xCache = header_value($headers, 'x-cache');
$cdnClue = '';
if ($cfCache !== '' || stripos($serverHeader, 'cloudflare') !== false) $cdnClue = 'Cloudflare clue detected';
elseif ($xCache !== '') $cdnClue = 'Cache/CDN header clue detected';
else $cdnClue = 'No obvious CDN/cache header clue detected';

$pageBytes = (int)($info['size_download'] ?? strlen($html));
$bodyBytes = strlen($html);
$totalTimeMs = (int)round((float)($info['total_time'] ?? 0) * 1000);
$ttfbMs = (int)round((float)($info['starttransfer_time'] ?? 0) * 1000);
$redirectCount = (int)($info['redirect_count'] ?? 0);

$scheme = strtolower($parts['scheme']);
$base = $scheme . '://' . $host;
$robots = check_url_exists($base . '/robots.txt');
$sitemap = check_url_exists($base . '/sitemap.xml');
if (!$sitemap['exists'] && $robots['exists']) {
    $robotsBody = fetch_url($base . '/robots.txt', 8)['body'] ?? '';
    if (preg_match('/^\s*Sitemap:\s*(\S+)/im', $robotsBody, $m)) {
        $sitemap = check_url_exists(trim($m[1]));
    }
}

$platform = detect_platform($html, $headers, $finalUrl);

$scan = [
    'url' => $url,
    'finalUrl' => $finalUrl,
    'status' => $status,
    'loads' => $status >= 200 && $status < 400,
    'https' => stripos($finalUrl, 'https://') === 0,
    'redirected' => $finalUrl !== $url,
    'title' => clean_text($title, 220),
    'metaDescription' => clean_text($description, 320),
    'canonical' => clean_text($canonical, 300),
    'viewport' => $viewport,
    'openGraph' => $og,
    'twitterCard' => $twitter,
    'schema' => $schema,
    'ga4Detected' => $ga4,
    'googleTagDetected' => $gtm,
    'formCount' => (int)$forms,
    'mailtoDetected' => $mailto,
    'whatsappDetected' => $whatsapp,
    'robots' => $robots,
    'sitemap' => $sitemap,
    'platform' => $platform,
    'performance' => [
        'totalTimeMs' => $totalTimeMs,
        'ttfbMs' => $ttfbMs,
        'redirectCount' => $redirectCount,
        'pageBytes' => $pageBytes,
        'pageSizeLabel' => bytes_to_label($pageBytes),
        'bodyBytes' => $bodyBytes,
        'bodySizeLabel' => bytes_to_label($bodyBytes),
        'imageCount' => (int)$imageCount,
        'scriptCount' => (int)$scriptCount,
        'externalScriptCount' => (int)$externalScriptCount,
        'cssCount' => (int)$cssCount,
        'stylesheetCount' => (int)$stylesheetCount,
        'styleBlockCount' => (int)$styleBlockCount,
        'iframeCount' => (int)$iframeCount,
        'videoEmbedCount' => (int)$videoCount,
        'cacheControl' => clean_text($cacheControl, 240),
        'expires' => clean_text($expiresHeader, 160),
        'contentEncoding' => clean_text($contentEncoding, 80),
        'serverHeader' => clean_text($serverHeader, 160),
        'xPoweredBy' => clean_text($xPoweredBy, 160),
        'cfCacheStatus' => clean_text($cfCache, 80),
        'xCache' => clean_text($xCache, 120),
        'cdnClue' => $cdnClue,
    ],
    'contentLength' => strlen($html),
];

respond_json(200, ['success' => true, 'scan' => $scan]);
