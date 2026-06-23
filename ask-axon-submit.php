<?php
header('Content-Type: application/json');

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

function clean_value($value, $limit = 6000) {
    $value = trim(strip_tags((string)$value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit) : substr($value, 0, $limit);
}

function h($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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


function send_resend_mail($to, $subject, $html, $replyTo = null) {
    $apiKey = getenv('RESEND_API_KEY');
    if (!$apiKey) return false;
    $payload = [
        'from' => getenv('CONTACT_FROM_EMAIL') ?: 'Axon 1ProIT <noreply@axon.com.sg>',
        'to' => [$to],
        'subject' => $subject,
        'html' => $html
    ];
    if ($replyTo) $payload['reply_to'] = $replyTo;
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    $result = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code < 200 || $code >= 300) {
        error_log('Ask Axon mail error: ' . $code . ' ' . $result);
        return false;
    }
    return true;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = $_POST;

$name = clean_value($input['name'] ?? '', 120);
$email = filter_var(trim((string)($input['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = clean_value($input['phone'] ?? '', 80);
$company = clean_value($input['company'] ?? '', 160);
$website = clean_value($input['website'] ?? '', 250);
$requestType = clean_value($input['requestType'] ?? 'Ask Axon request', 120);
$question = clean_value($input['question'] ?? '', 8000);
$advisorReply = clean_value($input['advisorReply'] ?? '', 10000);

if (!$name || !$email || !$question) {
    respond_json(422, ['success' => false, 'message' => 'Please provide your name, email and request details.']);
}

$admin = getenv('CONTACT_TO_EMAIL') ?: 'amit@axon.com.sg';
$boxStyle = 'white-space:pre-wrap;background:#f5f8fc;padding:14px;border-radius:12px;border:1px solid #e3ebf7;';

$adminHtml = '<div style="font-family:Arial,sans-serif;color:#17202a;line-height:1.5"><h2>New Ask Axon request</h2>'
    . '<p><strong>Type:</strong> ' . htmlspecialchars($requestType) . '</p>'
    . '<p><strong>Name:</strong> ' . htmlspecialchars($name) . '<br><strong>Email:</strong> ' . htmlspecialchars($email) . '<br><strong>Phone:</strong> ' . htmlspecialchars($phone ?: '-') . '<br><strong>Company:</strong> ' . htmlspecialchars($company ?: '-') . '<br><strong>Website:</strong> ' . htmlspecialchars($website ?: '-') . '</p>'
    . '<h3>Client request</h3><div style="' . $boxStyle . '">' . htmlspecialchars($question) . '</div>'
    . '<h3>Ask Axon response shown to client</h3><div style="' . $boxStyle . '">' . htmlspecialchars($advisorReply ?: 'No AI response captured.') . '</div></div>';

$customerFooterHtml = axon_customer_email_footer();

$clientHtml = '
<!doctype html><html><body style="margin:0;background:#f6f8fb;font-family:Arial,sans-serif;color:#14213d;">
  <div style="max-width:680px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e9f2;">
      <div style="padding:24px 28px;border-bottom:1px solid #e5e9f2;background:#ffffff;">
        <img src="https://axon.com.sg/logo.png" alt="Axon 1ProIT" style="height:44px;display:block;">
      </div>
      <div style="padding:30px 28px;line-height:1.7;">
        <h2 style="margin:0 0 14px;font-size:24px;color:#003087;">We received your Ask Axon request</h2>
        <p>Hi ' . h($name) . ',</p>
        <p>Thank you for using Ask Axon. A copy of your request has been sent to the Axon team.</p>
        <p>This is an initial advisory request, not a full technical audit. Where access or deeper checking is required, Axon will advise the safest next step.</p>
        <p>For urgent support, you may <a href="https://wa.me/639614044560" style="color:#003087;font-weight:bold;">chat with Axon on WhatsApp</a> or email <a href="mailto:support@axon.com.sg" style="color:#003087;font-weight:bold;">support@axon.com.sg</a>.</p>
        <h3 style="margin:24px 0 8px;color:#003087;">Your request</h3>
        <div style="' . $boxStyle . '">' . h($question) . '</div>
        <h3 style="margin:24px 0 8px;color:#003087;">Ask Axon advisory response</h3>
        <div style="' . $boxStyle . '">' . h($advisorReply ?: 'The Axon team will review your request.') . '</div>
        <p>Regards,<br><strong>Axon 1ProIT</strong><br>Singapore-established technology, websites, hosting, cloud and AI advisory.</p>
      </div>' . $customerFooterHtml . '
    </div>
  </div>
</body></html>';

$adminOk = send_resend_mail($admin, 'New Ask Axon request from ' . $name, $adminHtml, $email);
$clientOk = send_resend_mail($email, 'We received your Ask Axon request', $clientHtml, getenv('CONTACT_REPLY_TO_EMAIL') ?: 'support@axon.com.sg');

if (!$adminOk) respond_json(502, ['success' => false, 'message' => 'Unable to send the request right now. Please email support@axon.com.sg.']);
respond_json(200, ['success' => true, 'clientCopySent' => $clientOk]);
