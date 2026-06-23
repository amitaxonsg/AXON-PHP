<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function load_local_env($path) {
    if (!is_readable($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        $value = trim($value, "\"'");
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
    if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
        return $data;
    }
    return $_POST;
}

function clean_text($value, $max = 4000) {
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
        CURLOPT_TIMEOUT => 20,
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

$data = json_input();
$name = clean_text($data['name'] ?? '', 120);
$email = clean_text($data['email'] ?? '', 180);
$phone = clean_text($data['phone'] ?? '', 80);
$website = clean_text($data['website'] ?? '', 240);
$message = clean_text($data['message'] ?? '', 4000);
$source = clean_text($data['source'] ?? 'Axon contact page', 120);

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please fill out all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$apiKey = getenv('RESEND_API_KEY') ?: '';
$toEmail = getenv('CONTACT_TO_EMAIL') ?: 'amit@axon.com.sg';
$fromEmail = getenv('CONTACT_FROM_EMAIL') ?: 'Axon 1ProIT <noreply@axon.com.sg>';
$replyTo = getenv('CONTACT_REPLY_TO_EMAIL') ?: 'support@axon.com.sg';

if ($apiKey === '') {
    error_log('RESEND_API_KEY is missing.');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Email service is not configured yet.']);
    exit;
}

$submittedAt = date('Y-m-d H:i:s T');
$subject = 'New Axon enquiry from ' . $name;

$internalHtml = '
<!doctype html><html><body style="margin:0;background:#f6f8fb;font-family:Arial,sans-serif;color:#14213d;">
  <div style="max-width:720px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e9f2;">
      <div style="padding:22px 26px;border-bottom:1px solid #e5e9f2;">
        <img src="https://axon.com.sg/logo.png" alt="Axon 1ProIT" style="height:42px;display:block;">
      </div>
      <div style="padding:26px;">
        <h2 style="margin:0 0 16px;font-size:22px;color:#003087;">New Website Enquiry</h2>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:10px;border-bottom:1px solid #eef2f7;font-weight:bold;width:170px;">Name</td><td style="padding:10px;border-bottom:1px solid #eef2f7;">' . h($name) . '</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #eef2f7;font-weight:bold;">Email</td><td style="padding:10px;border-bottom:1px solid #eef2f7;"><a href="mailto:' . h($email) . '">' . h($email) . '</a></td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #eef2f7;font-weight:bold;">Phone / WhatsApp</td><td style="padding:10px;border-bottom:1px solid #eef2f7;">' . h($phone) . '</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #eef2f7;font-weight:bold;">Website / Platform</td><td style="padding:10px;border-bottom:1px solid #eef2f7;">' . h($website ?: 'Not provided') . '</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #eef2f7;font-weight:bold;">Source</td><td style="padding:10px;border-bottom:1px solid #eef2f7;">' . h($source) . '</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #eef2f7;font-weight:bold;">Submitted</td><td style="padding:10px;border-bottom:1px solid #eef2f7;">' . h($submittedAt) . '</td></tr>
        </table>
        <h3 style="margin:24px 0 8px;color:#003087;">Message</h3>
        <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e9f2;border-radius:12px;padding:16px;line-height:1.6;">' . h($message) . '</div>
      </div>
    </div>
  </div>
</body></html>';

$customerFooterHtml = axon_customer_email_footer();

$clientHtml = '
<!doctype html><html><body style="margin:0;background:#f6f8fb;font-family:Arial,sans-serif;color:#14213d;">
  <div style="max-width:680px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e9f2;">
      <div style="padding:24px 28px;border-bottom:1px solid #e5e9f2;background:#ffffff;">
        <img src="https://axon.com.sg/logo.png" alt="Axon 1ProIT" style="height:44px;display:block;">
      </div>
      <div style="padding:30px 28px;line-height:1.7;">
        <h2 style="margin:0 0 14px;font-size:24px;color:#003087;">Thank you for contacting Axon</h2>
        <p>Dear ' . h($name) . ',</p>
        <p>Thank you for your enquiry. We have received your request and our team will review the details carefully.</p>
        <p>We will revert back to you as soon as possible. For urgent support, you may also <a href="https://wa.me/639614044560" style="color:#003087;font-weight:bold;">chat with Axon on WhatsApp</a> or email <a href="mailto:support@axon.com.sg" style="color:#003087;font-weight:bold;">support@axon.com.sg</a>.</p>
        <div style="margin:24px 0;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e5e9f2;">
          <strong>Your submitted message:</strong><br>
          <div style="white-space:pre-wrap;margin-top:8px;">' . h($message) . '</div>
        </div>
        <p>Regards,<br><strong>Axon 1ProIT</strong><br>Singapore-established technology, websites, hosting, cloud and AI advisory.</p>
      </div>' . $customerFooterHtml . '
    </div>
  </div>
</body></html>';

$internalSent = resend_send([
    'from' => $fromEmail,
    'to' => [$toEmail],
    'reply_to' => $email,
    'subject' => $subject,
    'html' => $internalHtml,
], $apiKey);

if (!$internalSent) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Unable to send your request right now. Please use WhatsApp or email support@axon.com.sg.']);
    exit;
}

resend_send([
    'from' => $fromEmail,
    'to' => [$email],
    'reply_to' => $replyTo,
    'subject' => 'We received your enquiry - Axon 1ProIT',
    'html' => $clientHtml,
], $apiKey);

echo json_encode(['success' => true, 'message' => 'Thank you. Your request has been sent successfully. We will revert back as soon as possible.']);
