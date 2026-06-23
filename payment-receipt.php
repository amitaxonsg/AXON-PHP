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

function clean_text($value, $max = 1000) {
    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    return mb_substr($value, 0, $max);
}

function h($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function axon_customer_email_footer() {
    return '
      <div style="padding:22px 28px;background:#f8fafc;border-top:1px solid #e5e9f2;font-size:13px;color:#526071;line-height:1.7;">
        <strong>Axon 1ProIT - Singapore</strong><br>
        Established in Singapore since 2002. Technology, websites, hosting, domains, cloud and AI advisory for business owners.<br><br>
        <strong>Singapore</strong><br>
        Axon Consulting / Axon 1ProIT<br><br>
        <strong>Axon - Baguio Office</strong><br>
        Pacdal Road, Baguio, 2600 Benguet<br><br>
        <strong>OnePro IT Solutions - Pampanga</strong><br>
        208-G, B4, L5 Real St, Balibago, Angeles, 2009 Pampanga<br><br>
        <strong>Email:</strong> <a href="mailto:support@axon.com.sg" style="color:#003087;">support@axon.com.sg</a> | <a href="mailto:amit@axon.com.sg" style="color:#003087;">amit@axon.com.sg</a><br>
        <strong>WhatsApp:</strong> <a href="https://wa.me/639614044560" style="color:#003087;">Chat with Axon on WhatsApp</a><br>
        <strong>Corporate Website:</strong> <a href="https://axon.com.sg" style="color:#003087;">axon.com.sg</a><br>
        <strong>Renewals:</strong> <a href="https://1proit.com" style="color:#003087;">1ProIT.com</a> | <strong>Hosting &amp; Domains:</strong> <a href="https://1prohost.com" style="color:#003087;">1ProHost.com</a><br>
        <strong>Server Portal:</strong> <a href="https://ai.axonserver.com/" style="color:#003087;">ai.axonserver.com</a>
      </div>';
}


function pdf_text($text) {
    $text = (string) $text;
    $text = str_replace(["\\", "(", ")", "\r"], ["\\\\", "\\(", "\\)", ""], $text);
    $text = preg_replace('/[^\x09\x0A\x0D\x20-\x7E]/', '', $text);
    return $text;
}

function money_format_usd($amountCents, $currency) {
    $amount = ((int) $amountCents) / 100;
    return strtoupper($currency ?: 'usd') . ' ' . number_format($amount, 2);
}

function stripe_request($method, $url, $secretKey, $params = []) {
    if ($method === 'GET' && $params) {
        $url .= (strpos($url, '?') === false ? '?' : '&') . http_build_query($params);
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => $secretKey . ':',
        CURLOPT_TIMEOUT => 20,
    ]);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    }

    $body = curl_exec($ch);
    $error = curl_error($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $decoded = json_decode((string) $body, true);
    if ($body === false || $status < 200 || $status >= 300 || !is_array($decoded)) {
        error_log('Stripe API failed. HTTP ' . $status . ' Error: ' . $error . ' Body: ' . $body);
        return null;
    }
    return $decoded;
}

function resend_send($payload, $apiKey) {
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 25,
    ]);

    $body = curl_exec($ch);
    $error = curl_error($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body === false || $status < 200 || $status >= 300) {
        error_log('Resend send failed. HTTP ' . $status . ' Error: ' . $error . ' Body: ' . $body);
        return false;
    }
    return true;
}

function make_pdf_invoice($invoice) {
    $lines = [];
    $lines[] = ['type' => 'title', 'text' => 'AXON 1ProIT'];
    $lines[] = ['type' => 'sub', 'text' => 'Technology, AI, Websites and Business Support'];
    $lines[] = ['type' => 'gap'];
    $lines[] = ['type' => 'heading', 'text' => 'Payment Receipt / Support Credit Invoice'];
    $lines[] = ['type' => 'gap'];
    $lines[] = ['type' => 'row', 'label' => 'Invoice No.', 'value' => $invoice['invoice_no']];
    $lines[] = ['type' => 'row', 'label' => 'Payment Date', 'value' => $invoice['date']];
    $lines[] = ['type' => 'row', 'label' => 'Stripe Session', 'value' => $invoice['session_id']];
    $lines[] = ['type' => 'row', 'label' => 'Payment Status', 'value' => strtoupper($invoice['payment_status'])];
    $lines[] = ['type' => 'gap'];
    $lines[] = ['type' => 'heading', 'text' => 'Customer Information'];
    $lines[] = ['type' => 'row', 'label' => 'Name', 'value' => $invoice['name']];
    $lines[] = ['type' => 'row', 'label' => 'Email', 'value' => $invoice['email']];
    $lines[] = ['type' => 'row', 'label' => 'Phone / WhatsApp', 'value' => $invoice['phone'] ?: 'Not provided'];
    $lines[] = ['type' => 'gap'];
    $lines[] = ['type' => 'heading', 'text' => 'Payment Information'];
    $lines[] = ['type' => 'row', 'label' => 'Item', 'value' => 'Axon Support Credits'];
    $lines[] = ['type' => 'row', 'label' => 'Credit Hours', 'value' => $invoice['hours'] . ' hour' . ((int) $invoice['hours'] === 1 ? '' : 's')];
    $lines[] = ['type' => 'row', 'label' => 'Hourly Rate', 'value' => 'USD ' . number_format((float) $invoice['hourly_rate'], 2)];
    $lines[] = ['type' => 'row', 'label' => 'Total Paid', 'value' => $invoice['amount']];
    $lines[] = ['type' => 'row', 'label' => 'Valid Until', 'value' => $invoice['valid_until']];
    if ($invoice['project_note'] !== '') {
        $lines[] = ['type' => 'gap'];
        $lines[] = ['type' => 'heading', 'text' => 'Support Note'];
        foreach (str_split($invoice['project_note'], 82) as $piece) {
            $lines[] = ['type' => 'text', 'text' => $piece];
        }
    }
    $lines[] = ['type' => 'footer_gap'];
    $lines[] = ['type' => 'text', 'text' => 'Credits are valid for 3 months from purchase date and are subject to Axon support credit terms.'];
    $lines[] = ['type' => 'text', 'text' => 'Axon - Baguio Office: Pacdal Road, Baguio, 2600 Benguet'];
    $lines[] = ['type' => 'text', 'text' => 'OnePro IT Solutions - Pampanga: 208-G, B4, L5 Real St, Balibago, Angeles, 2009 Pampanga'];
    $lines[] = ['type' => 'text', 'text' => 'Email: support@axon.com.sg | Website: axon.com.sg'];

    $content = [];
    $content[] = '0.94 0.97 1 rg 0 0 595 842 re f';
    $content[] = '0.00 0.19 0.53 rg 0 772 595 70 re f';
    $content[] = '1 1 1 rg BT /F1 24 Tf 50 812 Td (' . pdf_text('AXON 1ProIT') . ') Tj ET';
    $content[] = '1 1 1 rg BT /F1 10 Tf 50 792 Td (' . pdf_text('Technology, AI, Websites and Business Support') . ') Tj ET';
    $content[] = '0.98 0.98 0.98 rg 40 60 515 690 re f';
    $content[] = '0.86 0.90 0.95 RG 40 60 515 690 re S';

    $y = 720;
    foreach ($lines as $line) {
        $type = $line['type'];
        if ($type === 'title' || $type === 'sub') continue;
        if ($type === 'gap') { $y -= 14; continue; }
        if ($type === 'footer_gap') { $y -= 24; continue; }
        if ($y < 95) break;

        if ($type === 'heading') {
            $content[] = '0.00 0.19 0.53 rg BT /F1 14 Tf 60 ' . $y . ' Td (' . pdf_text($line['text']) . ') Tj ET';
            $y -= 22;
        } elseif ($type === 'row') {
            $content[] = '0.07 0.13 0.23 rg BT /F1 10 Tf 60 ' . $y . ' Td (' . pdf_text($line['label']) . ') Tj ET';
            $content[] = '0.17 0.21 0.28 rg BT /F1 10 Tf 190 ' . $y . ' Td (' . pdf_text($line['value']) . ') Tj ET';
            $y -= 18;
        } else {
            $content[] = '0.20 0.24 0.30 rg BT /F1 9 Tf 60 ' . $y . ' Td (' . pdf_text($line['text']) . ') Tj ET';
            $y -= 15;
        }
    }

    $contentStream = implode("\n", $content) . "\n";
    $objects = [];
    $objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
    $objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    $objects[] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
    $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    $objects[] = '<< /Length ' . strlen($contentStream) . " >>\nstream\n" . $contentStream . 'endstream';

    $pdf = "%PDF-1.4\n";
    $offsets = [0];
    foreach ($objects as $i => $obj) {
        $offsets[] = strlen($pdf);
        $pdf .= ($i + 1) . " 0 obj\n" . $obj . "\nendobj\n";
    }
    $xref = strlen($pdf);
    $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
    $pdf .= "0000000000 65535 f \n";
    for ($i = 1; $i <= count($objects); $i++) {
        $pdf .= str_pad((string) $offsets[$i], 10, '0', STR_PAD_LEFT) . " 00000 n \n";
    }
    $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";
    return $pdf;
}

$data = json_input();
$sessionId = clean_text($data['session_id'] ?? '', 255);

if ($sessionId === '' || !preg_match('/^cs_(test|live)_[A-Za-z0-9_]+$/', $sessionId)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid Stripe session ID.']);
    exit;
}

$sentDir = __DIR__ . '/payment-receipts-sent';
if (!is_dir($sentDir)) {
    @mkdir($sentDir, 0755, true);
}
$sentFile = $sentDir . '/' . hash('sha256', $sessionId) . '.json';
if (is_readable($sentFile)) {
    $cached = json_decode((string) file_get_contents($sentFile), true);
    echo json_encode([
        'success' => true,
        'already_sent' => true,
        'message' => 'Payment receipt email was already sent.',
        'summary' => $cached['summary'] ?? null,
    ]);
    exit;
}

$stripeSecretKey = getenv('STRIPE_SECRET_KEY') ?: '';
$resendApiKey = getenv('RESEND_API_KEY') ?: '';
$toEmail = getenv('CONTACT_TO_EMAIL') ?: 'amit@axon.com.sg';
$fromEmail = getenv('CONTACT_FROM_EMAIL') ?: 'Axon 1ProIT <noreply@axon.com.sg>';
$replyTo = getenv('CONTACT_REPLY_TO_EMAIL') ?: 'support@axon.com.sg';

if ($stripeSecretKey === '' || $resendApiKey === '') {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Receipt email service is not fully configured.']);
    exit;
}

$session = stripe_request('GET', 'https://api.stripe.com/v1/checkout/sessions/' . rawurlencode($sessionId), $stripeSecretKey, ['expand[]' => 'line_items']);
if (!$session) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Unable to verify Stripe payment.']);
    exit;
}

if (($session['payment_status'] ?? '') !== 'paid') {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Stripe payment is not marked as paid yet.']);
    exit;
}

$metadata = $session['metadata'] ?? [];
$email = clean_text($session['customer_details']['email'] ?? ($session['customer_email'] ?? ($metadata['customer_email'] ?? '')), 180);
$name = clean_text($session['customer_details']['name'] ?? ($metadata['customer_name'] ?? 'Customer'), 120);
$phone = clean_text($session['customer_details']['phone'] ?? ($metadata['customer_phone'] ?? ''), 80);
$hours = (int) ($metadata['hours'] ?? 0);
$hourlyRate = (float) ($metadata['hourly_rate_usd'] ?? 0);
$projectNote = clean_text($metadata['project_note'] ?? '', 1000);
$amount = money_format_usd($session['amount_total'] ?? 0, $session['currency'] ?? 'usd');
$paidAt = date('Y-m-d H:i:s T', (int) ($session['created'] ?? time()));
$validUntil = date('Y-m-d', strtotime('+3 months', (int) ($session['created'] ?? time())));
$invoiceNo = 'AXON-' . date('Ymd', (int) ($session['created'] ?? time())) . '-' . strtoupper(substr(hash('sha1', $sessionId), 0, 8));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Stripe payment does not include a valid customer email.']);
    exit;
}

$invoice = [
    'invoice_no' => $invoiceNo,
    'date' => $paidAt,
    'session_id' => $sessionId,
    'payment_status' => $session['payment_status'] ?? 'paid',
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'hours' => $hours ?: 'N/A',
    'hourly_rate' => $hourlyRate,
    'amount' => $amount,
    'valid_until' => $validUntil,
    'project_note' => $projectNote,
];

$pdf = make_pdf_invoice($invoice);
$pdfBase64 = base64_encode($pdf);
$pdfFilename = $invoiceNo . '-receipt.pdf';

$summaryHtml = '
<table style="width:100%;border-collapse:collapse;font-size:15px;">
  <tr><td style="padding:9px;border-bottom:1px solid #e5e9f2;font-weight:bold;">Invoice No.</td><td style="padding:9px;border-bottom:1px solid #e5e9f2;">' . h($invoiceNo) . '</td></tr>
  <tr><td style="padding:9px;border-bottom:1px solid #e5e9f2;font-weight:bold;">Credit Hours</td><td style="padding:9px;border-bottom:1px solid #e5e9f2;">' . h($invoice['hours']) . '</td></tr>
  <tr><td style="padding:9px;border-bottom:1px solid #e5e9f2;font-weight:bold;">Total Paid</td><td style="padding:9px;border-bottom:1px solid #e5e9f2;">' . h($amount) . '</td></tr>
  <tr><td style="padding:9px;border-bottom:1px solid #e5e9f2;font-weight:bold;">Valid Until</td><td style="padding:9px;border-bottom:1px solid #e5e9f2;">' . h($validUntil) . '</td></tr>
</table>';

$customerFooterHtml = axon_customer_email_footer();

$customerHtml = '
<!doctype html><html><body style="margin:0;background:#f6f8fb;font-family:Arial,sans-serif;color:#14213d;">
  <div style="max-width:680px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e9f2;">
      <div style="padding:24px 28px;border-bottom:1px solid #e5e9f2;background:#ffffff;">
        <img src="https://axon.com.sg/logo.png" alt="Axon 1ProIT" style="height:44px;display:block;">
      </div>
      <div style="padding:30px 28px;line-height:1.7;">
        <h2 style="margin:0 0 14px;font-size:24px;color:#003087;">Payment received - Axon support credits</h2>
        <p>Dear ' . h($name) . ',</p>
        <p>Thank you. Your Axon support credit payment has been received successfully.</p>
        ' . $summaryHtml . '
        <p style="margin-top:20px;">Your branded PDF receipt / invoice is attached for your records.</p>
        <p>For urgent support, you may <a href="https://wa.me/639614044560" style="color:#003087;font-weight:bold;">chat with Axon on WhatsApp</a> or email <a href="mailto:support@axon.com.sg" style="color:#003087;font-weight:bold;">support@axon.com.sg</a>.</p>
        <p>Regards,<br><strong>Axon 1ProIT</strong><br>Singapore-established technology, websites, hosting, cloud and AI advisory.</p>
      </div>' . $customerFooterHtml . '
    </div>
  </div>
</body></html>';

$adminHtml = '
<!doctype html><html><body style="margin:0;background:#f6f8fb;font-family:Arial,sans-serif;color:#14213d;">
  <div style="max-width:720px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e9f2;">
      <div style="padding:22px 26px;border-bottom:1px solid #e5e9f2;"><img src="https://axon.com.sg/logo.png" alt="Axon 1ProIT" style="height:42px;display:block;"></div>
      <div style="padding:26px;line-height:1.65;">
        <h2 style="margin:0 0 16px;font-size:22px;color:#003087;">New Support Credit Payment</h2>
        ' . $summaryHtml . '
        <p><strong>Customer:</strong> ' . h($name) . ' &lt;' . h($email) . '&gt;</p>
        <p><strong>Phone / WhatsApp:</strong> ' . h($phone ?: 'Not provided') . '</p>
        <p><strong>Stripe Session:</strong> ' . h($sessionId) . '</p>
        <p><strong>Support Note:</strong><br>' . nl2br(h($projectNote ?: 'Not provided')) . '</p>
      </div>
    </div>
  </div>
</body></html>';

$attachment = [[
    'filename' => $pdfFilename,
    'content' => $pdfBase64,
]];

$customerSent = resend_send([
    'from' => $fromEmail,
    'to' => [$email],
    'reply_to' => $replyTo,
    'subject' => 'Payment received - Axon support credits ' . $invoiceNo,
    'html' => $customerHtml,
    'attachments' => $attachment,
], $resendApiKey);

$adminSent = resend_send([
    'from' => $fromEmail,
    'to' => [$toEmail],
    'reply_to' => $email,
    'subject' => 'New Axon credit payment - ' . $amount . ' - ' . $name,
    'html' => $adminHtml,
    'attachments' => $attachment,
], $resendApiKey);

if (!$customerSent || !$adminSent) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Payment verified, but receipt email could not be sent.']);
    exit;
}

$summary = [
    'invoice_no' => $invoiceNo,
    'name' => $name,
    'email' => $email,
    'amount' => $amount,
    'hours' => $invoice['hours'],
    'valid_until' => $validUntil,
];

@file_put_contents($sentFile, json_encode([
    'sent_at' => date('c'),
    'session_id' => $sessionId,
    'summary' => $summary,
], JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'already_sent' => false,
    'message' => 'Payment receipt email with PDF invoice has been sent.',
    'summary' => $summary,
]);
