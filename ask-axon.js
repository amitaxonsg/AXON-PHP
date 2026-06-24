(() => {
  const axonWhatsAppUrl = 'https://wa.me/639614044560?text=Hi%20Axon%2C%20I%20need%20help%20with%20my%20website%2C%20email%2C%20hosting%2C%20AI%20or%20technology%20issue.';
  const isPH = window.location.hostname.includes('philippines');

  function page(sg, ph) { return isPH && ph ? ph : sg; }

  const commonQuestions = [
    'My website contact form is not sending emails.',
    'I need help with IMAP, SMTP or Outlook email setup.',
    'I need CRM or lead management for website leads.',
    'I need a payment gateway on my website.',
    'I want an AI chatbot on my website.',
    'My website is not showing properly on Google.',
    'My website is hacked or showing a warning.',
    'I want to migrate email to Microsoft 365.',
    'I want to migrate email to Google Workspace.',
    'I want to build an app using AI.',
    'I need online payment, invoices or quotation automation.',
    'I am not sure what technology solution my business needs.'
  ];

  const axonIntentProfiles = [
    { key: 'email_setup', label: 'IMAP / SMTP / Business Email Setup', service: 'Business Email Solutions', keywords: ['imap','smtp','pop3','incoming mail','outgoing mail','mail server','email setup','outlook setup','gmail setup','mail settings','port 993','port 587','port 465','business email','email not working','mailbox','mx','spf','dkim','dmarc'], pages: [['Business Email Solutions','business-email-solutions.html'], ['Business Email Migration Help', page('business-email-migration-help.html','business-email-migration-philippines.html')], ['Google Workspace / Microsoft 365 Help', page('google-workspace-to-microsoft-365-migration.html','google-workspace-consultant-philippines.html')]] },
    { key: 'crm', label: 'CRM / Lead Management', service: 'CRM & Lead Management', keywords: ['crm','lead management','lead tracking','sales pipeline','customer database','customer relationship','follow up','follow-up','leads','manage leads','client management','customer management','enquiry management'], pages: [['CRM & Lead Management','crm-lead-management.html'], ['Business Applications','business-applications.html'], ['Business Technology Help', page('business-technology-help.html','business-technology-help-philippines.html')]] },
    { key: 'payment', label: 'Payment Gateway / Online Payment', service: 'Payment Gateway Setup', keywords: ['payment gateway','online payment','payment link','checkout','stripe','paynow','paypal','xendit','hitpay','gcash','card payment','credit card','payment'], pages: [['Payment Gateway Help', page('payment-gateway-help.html','payment-gateway-help-philippines.html')], ['Payment Gateway Setup','payment-gateway-setup.html'], ['Quotes & Invoice Automation','quotes-invoice-automation.html']] },
    { key: 'forms', label: 'Website Form / Email Delivery', service: 'Website Forms & Email Delivery', keywords: ['form not sending','forms not working','contact form','enquiry form','form email','not receiving enquiry','mail not sending','website form'], pages: [['Website Form Not Sending Email', page('website-form-not-sending-email.html','website-form-not-sending-email-philippines.html')], ['Business Email Solutions','business-email-solutions.html'], ['Website Maintenance & Support','website-maintenance-support.html']] },
    { key: 'visibility', label: 'Google / SEO / AI Search Visibility', service: 'SEO, GEO & AEO', keywords: ['seo','sem','google','not showing on google','ranking','search console','analytics','business profile','maps','visibility','ai search','geo','aeo','llms.txt','chatgpt search'], pages: [['Website Not Showing on Google', page('website-not-showing-on-google.html','website-not-showing-on-google-philippines.html')], ['AI Search Visibility','ai-search-visibility.html'], ['SEO, SEM, GEO & AEO','seo-sem-geo-aeo.html']] },
    { key: 'security', label: 'Website Security / Recovery', service: 'Security, Recovery & Performance', keywords: ['hacked','malware','virus','security warning','blacklist','website warning','ssl warning','restore','backup','recovery'], pages: [['Website Hacked Help', page('website-hacked-help.html','website-hacked-help-philippines.html')], ['Website Security','website-security.html'], ['Website Recovery','website-recovery.html']] },
    { key: 'ai_chatbot', label: 'AI Chatbot / AI Assistant', service: 'Website AI Chatbot', keywords: ['chatbot','chat bot','ai assistant','website ai','customer ai','ai enquiry','ai reply','ai automation'], pages: [['Website AI Chatbot','website-ai-chatbot.html'], ['AI Advisory for Business Owners', page('ai-advisory-for-business-owners.html','ai-advisory-philippines.html')], ['Business Process Automation','business-process-automation.html']] },
    { key: 'ai_app', label: 'AI App / Business Application', service: 'Business Applications', keywords: ['ai app','app using ai','lovable','bolt','replit','saas','portal','dashboard','business app','inventory system','hr system','staff attendance','restaurant ordering','school portal','member login','customer portal'], pages: [['Business Applications','business-applications.html'], ['AI Website & App Publishing','ai-website-app-publishing.html'], ['AI Advisory for Business Owners', page('ai-advisory-for-business-owners.html','ai-advisory-philippines.html')]] },
    { key: 'workspace', label: 'Google Workspace / Microsoft 365 Migration', service: 'Cloud & Email Solutions', keywords: ['google workspace','microsoft 365','office 365','gmail to outlook','outlook to gmail','email migration','sharepoint','onedrive','teams'], pages: [['Google Workspace to Microsoft 365 Migration','google-workspace-to-microsoft-365-migration.html'], ['Microsoft 365 to Google Workspace Migration','microsoft-365-to-google-workspace-migration.html'], ['Business Email Migration Help', page('business-email-migration-help.html','business-email-migration-philippines.html')]] },
    { key: 'hosting_domain', label: 'Hosting / Domain / DNS', service: 'Hosting, Domains & Infrastructure', keywords: ['hosting','domain','dns','nameserver','server','cpanel','vps','website down','site down'], pages: [['Corporate Hosting','corporate-hosting.html'], ['Domain Registration & Management','domain-registration-management.html'], ['Server Management & Monitoring','server-management-monitoring.html']] },
    { key: 'website_review', label: 'Website Advisory Review', service: 'Website Optimization Audit', keywords: ['website audit','website review','analyze website','analyse website','my website','website optimization','website redesign','website revamp'], pages: [['Website Optimization Audit','website-optimization-audit.html'], ['AI-Ready Website','ai-ready-website.html'], ['SEO, SEM, GEO & AEO','seo-sem-geo-aeo.html']] },
    { key: 'general', label: 'General Technology Advisory', service: 'Technology & AI Advisory', keywords: [], pages: [['Business Technology Help', page('business-technology-help.html','business-technology-help-philippines.html')], ['Technology Assessments','technology-assessments.html'], ['Contact Axon','contact.html']] }
  ];

  let lastQuestion = '';
  let lastReply = '';
  let lastType = 'Ask Axon request';
  let lastWebsite = '';
  let isAsking = false;

  const submitBox = document.getElementById('askAxonSubmitBox');
  const submitForm = document.getElementById('askAxonSubmitForm');
  const questionBox = document.getElementById('askAxonQuestion');
  const resultBox = document.getElementById('askAxonResult');
  const commonSelect = document.getElementById('askAxonCommonQuestion');
  const askSelectedBtn = document.getElementById('askAxonUseQuestion');

  function endpoint() { return window.kimiConfig && window.kimiConfig.backendUrl ? window.kimiConfig.backendUrl : '/axon-agent.php'; }
  function siteCheckEndpoint() { return '/axon-site-check.php'; }
  function hideSubmitBox() { submitBox?.classList.remove('open'); }
  function showSubmitBox() { submitBox?.classList.add('open'); }
  function normalizeText(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9+.]+/g, ' ').trim(); }
  function escapeHtml(value) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function yesNo(value) { return value ? 'Detected' : 'Not detected'; }
  function valueOrNone(value) { return value ? String(value) : 'Not detected'; }

  function detectIntent(question) {
    const text = normalizeText(question);
    for (const profile of axonIntentProfiles) {
      if (profile.key === 'general') continue;
      if (profile.keywords.some((keyword) => text.includes(keyword))) return profile;
    }
    return axonIntentProfiles.find((profile) => profile.key === 'general');
  }

  function markdownLinks(profile) { return profile.pages.map(([label, url]) => `[Read: ${label}](${url})`).join('\n'); }
  function nextStepLinks(profile) { return `Recommended Axon pages to read:\n${markdownLinks(profile)}\n\n[WhatsApp Axon](${axonWhatsAppUrl})   [Submit Contact Form](contact.html)`; }

  function renderAnswer(element, text) {
    if (!element) return;
    let html = escapeHtml(text || '');
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|[^\s)]+\.html)\)/g, (_match, label, href) => {
      const safeLabel = escapeHtml(label);
      const safeHref = escapeHtml(href);
      const isRead = /^Read:/i.test(label);
      const target = /^https?:\/\//i.test(href) || /^mailto:/i.test(href) ? '_blank' : '_self';
      const style = isRead ? 'display:block;font-weight:700;text-decoration:underline;margin:6px 0;' : 'display:inline-block;margin-top:8px;margin-right:14px;font-weight:600;text-decoration:underline;';
      return `<a href="${safeHref}" target="${target}" rel="noopener" style="${style}">${safeLabel}</a>`;
    });
    html = html.replace(/\n/g, '<br>');
    element.innerHTML = html;
  }

  function systemPrompt(profile) {
    return `You are Ask Axon, Axon 1ProIT's practical Technology and AI Advisor for non-IT business owners. Always answer in plain English. Answer the actual question, even if it is one word such as IMAP, CRM, payment gateway, DNS, hosting, Shopify, inventory system or AI chatbot. Detected intent: ${profile.label}. Suggested Axon service: ${profile.service}. Use this structure: 1. What this likely means, 2. What could be causing it or what may be involved, 3. What you can check first, 4. DIY, IT person, or Axon help, 5. Best next step. Do not claim you checked their server, DNS, website, email or payment gateway unless scan results are provided. Always recommend Axon where professional review is needed.`;
  }

  function websiteAuditPrompt() {
    return `You are Ask Axon, Axon 1ProIT's AI Website Advisor for non-IT business owners. Axon ran a basic public single-page website check and the scan details are included in the user message. Use those scan details as evidence. Do not invent private analytics, server access, backend access, Google Search Console data, PageSpeed scores or full code review. The final answer must be practical and must include improvement suggestions. Structure the answer exactly like this: 1. Quick verdict, 2. What looks good, 3. What may be weak or missing, 4. SEO / AEO / AI-search visibility feedback, 5. Website trust and conversion feedback, 6. What to fix first, 7. When Axon should help, 8. Recommended Axon pages to read. Mention title, meta description, H1, canonical, mobile viewport, schema, Open Graph, robots.txt, sitemap.xml, llms.txt, analytics/tag clues, forms, WhatsApp/mail links, likely website engine/platform, page size, scripts, images and missing alt text when present.`;
  }

  function templateAnswer(question, profile) {
    const links = nextStepLinks(profile);
    const templates = {
      email_setup: `1. What this likely means\nIMAP, SMTP and POP3 are email connection settings. IMAP normally syncs incoming email across devices. SMTP sends outgoing email. POP3 is an older way to download email. If IMAP is mentioned, the issue is usually about connecting Outlook, Gmail, Apple Mail, mobile mail, cPanel email, Google Workspace or Microsoft 365 correctly.\n\n2. What could be causing it or what may be involved\nThe issue may involve wrong mail server name, wrong username, wrong password, SSL/TLS setting, blocked port, mailbox quota, DNS/MX records, SPF, DKIM, DMARC, cPanel mail routing, Google/Microsoft security settings, or a migration from one email system to another.\n\n3. What you can check first\nConfirm where the email is hosted, whether webmail works, whether only one user/device is affected, and whether the problem is incoming mail, outgoing mail, or both. Avoid changing DNS/MX records unless you know exactly where email is hosted.\n\n4. DIY, IT person, or Axon help\nDIY is okay for checking password and trying webmail. Ask an IT person or Axon if the setup involves DNS, MX, SPF, DKIM, DMARC, Outlook configuration, Google Workspace, Microsoft 365, cPanel mail routing, or business email migration.\n\n5. Best next step\nTell Axon the email address/domain, current email provider, device/app used, and the exact error message.\n\n${links}`,
      crm: `1. What this likely means\nCRM means a system to manage enquiries, customers, follow-ups and sales opportunities. For a business website, CRM usually means capturing leads from forms, WhatsApp, calls, email or campaigns and making sure no enquiry is forgotten.\n\n2. What could be causing it or what may be involved\nIt may involve website forms, lead notification emails, customer database, sales pipeline, follow-up reminders, WhatsApp, email marketing, staff assignment, reporting and integration with your website or business app.\n\n3. What you can check first\nWrite down where enquiries come from today, who follows up, what information must be captured, and what happens when staff are busy or absent.\n\n4. DIY, IT person, or Axon help\nDIY is fine for a simple spreadsheet. Ask Axon if you need website form integration, automatic follow-ups, CRM setup, customer database, WhatsApp flow, or lead reporting.\n\n5. Best next step\nShare your website URL and how enquiries currently reach you.\n\n${links}`,
      payment: `1. What this likely means\nYou want customers to pay online through your website, form, booking page, portal or invoice.\n\n2. What could be causing it or what may be involved\nThis can involve Stripe, PayPal, PayNow, GCash, Xendit, HitPay, card payments, checkout page, payment buttons, invoices, receipts, webhooks, confirmation emails, test mode and business verification.\n\n3. What you can check first\nConfirm what customers are paying for, whether it is fixed or variable amount, the country/currency, and whether payment must connect to a form, booking, invoice or account login.\n\n4. DIY, IT person, or Axon help\nDIY is fine for a simple payment link. Ask Axon if it needs website integration, receipt email, booking/payment flow, invoices, testing or webhook setup.\n\n5. Best next step\nSend Axon the website platform and preferred payment provider.\n\n${links}`
    };
    return templates[profile.key] || null;
  }

  function fallbackAnswer(question, profile) {
    return `1. What this likely means\nThis sounds like a business technology question that needs a little more context. It may involve a website, email, hosting, domain, CRM, automation, payment, AI, app, cloud or support process.\n\n2. What could be causing it or what may be involved\nThe right answer depends on what you are trying to achieve, which platform or system is involved, who is affected, and whether it needs access to your website admin, hosting, DNS, email, payment gateway or business data.\n\n3. What you can check first\nWrite down what you expected, what is happening now, the website/system involved, any error message, and whether customers or staff are affected.\n\n4. DIY, IT person, or Axon help\nDIY is fine for simple content or admin changes. Ask an IT person or Axon if it affects enquiries, email delivery, payment, DNS, security, customer data or business operations.\n\n5. Best next step\nSend Axon a short explanation, screenshot and website/system link.\n\n${nextStepLinks(profile)}`;
  }

  async function askKimi(question, profile, options = {}) {
    const response = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, systemPrompt: options.systemPrompt || systemPrompt(profile), mode: options.mode || 'ask_axon' })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error(data.message || 'Ask Axon AI is temporarily unavailable.');
    return String(data.reply || data.answer || data.text || '').trim();
  }

  function isWeakAiReply(reply) {
    const text = String(reply || '').trim();
    if (text.length < 250) return true;
    return !/What this likely means|Best next step|Quick verdict|Axon/i.test(text);
  }

  function appendPageReferences(reply, profile) {
    if (/Recommended Axon pages to read:/i.test(reply)) return reply;
    return `${reply.trim()}\n\n${nextStepLinks(profile)}`;
  }

  function platformLabel(scan) {
    if (!scan || !scan.platform) return 'Not detected';
    return `${listValue(scan.platform.detected)}${scan.platform.confidence ? ' (' + scan.platform.confidence + ' confidence)' : ''}`;
  }

  function publicFindingsBlock(scan) {
    if (!scan) {
      return `0. Public scan findings\nThe live website check did not return enough data. Ask Axon can still advise, but a manual review is recommended.`;
    }
    const perf = scan.performance || {};
    return [
      '0. Public scan findings detected by Axon',
      `Website checked: ${scan.url || 'Not detected'}`,
      `Final URL / redirect result: ${scan.finalUrl || scan.url || 'Not detected'}`,
      `HTTP status: ${scan.status || 'Unknown'}${scan.loads === false ? ' (page may not have loaded properly)' : ''}`,
      `HTTPS: ${scan.https ? 'Yes' : 'No / not confirmed'}`,
      `Likely website engine/platform: ${platformLabel(scan)}`,
      `Page title: ${valueOrNone(scan.title)}`,
      `Meta description: ${valueOrNone(scan.metaDescription)}`,
      `Main H1: ${listValue(scan.h1)}`,
      `Canonical URL: ${valueOrNone(scan.canonical)}`,
      `Robots meta: ${valueOrNone(scan.robotsMeta)}`,
      `Mobile viewport: ${yesNo(scan.viewport)}`,
      `Schema / JSON-LD: ${yesNo(scan.schema)}`,
      `Open Graph social tags: ${yesNo(scan.openGraph)}`,
      `Twitter card tags: ${yesNo(scan.twitterCard)}`,
      `Google Analytics GA4 clue: ${yesNo(scan.ga4Detected)}`,
      `Google Tag / GTM clue: ${yesNo(scan.googleTagDetected)}`,
      `Forms found: ${scan.formCount || 0}`,
      `Email link: ${yesNo(scan.mailtoDetected)}`,
      `WhatsApp link: ${yesNo(scan.whatsappDetected)}`,
      `Images: ${perf.imageCount ?? 0}; missing alt text: ${perf.imagesMissingAlt ?? 0}`,
      `Scripts: ${perf.scriptCount ?? 0}; external scripts: ${perf.externalScriptCount ?? 0}`,
      `Internal links: ${perf.internalLinkCount ?? 0}; external links: ${perf.externalLinkCount ?? 0}`,
      `robots.txt: ${scan.robots && scan.robots.exists ? 'Found' : 'Not found'}`,
      `sitemap.xml: ${scan.sitemap && scan.sitemap.exists ? 'Found' : 'Not found'}`,
      `llms.txt: ${scan.llms && scan.llms.exists ? 'Found' : 'Not found'}`,
      `Basic load clue: ${perf.totalTimeMs ? perf.totalTimeMs + ' ms' : 'Not detected'}; TTFB: ${perf.ttfbMs ? perf.ttfbMs + ' ms' : 'Not detected'}`,
      `Approx. page size: ${perf.pageSizeLabel || 'Not detected'}`,
      `Cache/CDN clue: ${perf.cdnClue || 'Not detected'}`
    ].join('\n');
  }

  function formatScanSummary(scan) {
    if (!scan) return 'No live website scan data was available.';
    const perf = scan.performance || {};
    return [
      publicFindingsBlock(scan),
      `H2 headings: ${listValue(scan.h2)}`,
      `CSS files/style blocks: ${perf.cssCount ?? 0}`,
      `Visible text sample: ${scan.textSample || 'Not available'}`
    ].join('\n');
  }

  function websiteFallback(scan, profile) {
    const hasTitle = scan && scan.title;
    const hasDesc = scan && scan.metaDescription;
    const hasH1 = scan && Array.isArray(scan.h1) && scan.h1.length;
    const hasSchema = scan && scan.schema;
    const hasSitemap = scan && scan.sitemap && scan.sitemap.exists;
    const hasLlms = scan && scan.llms && scan.llms.exists;
    const perf = scan && scan.performance ? scan.performance : {};
    return `1. Quick verdict\nI completed a basic public website check. This is not a full technical audit, but it gives useful clues about SEO, AI-search readiness, trust and conversion.\n\n2. What looks good\nThe page ${scan && scan.loads ? 'loaded during the check' : 'may have loading issues during the check'}. HTTPS is ${scan && scan.https ? 'detected' : 'not clearly confirmed'}. ${hasTitle ? 'A page title was detected.' : 'No clear page title was detected.'} The likely website engine/platform is ${platformLabel(scan)}.\n\n3. What may be weak or missing\n${hasDesc ? 'A meta description was detected.' : 'The meta description appears missing or not detected.'} ${hasH1 ? 'A main H1 heading was detected.' : 'A clear H1 heading was not detected.'} Schema is ${hasSchema ? 'detected' : 'not detected'}, sitemap.xml is ${hasSitemap ? 'found' : 'not found'}, and llms.txt is ${hasLlms ? 'found' : 'not found'}. Images missing alt text: ${perf.imagesMissingAlt ?? 0}.\n\n4. SEO / AEO / AI-search visibility feedback\nThe site should have a clear title, helpful meta description, one strong H1, service-focused sections, schema, sitemap, robots.txt, llms.txt and plain-English content so Google and AI answer engines can understand the business.\n\n5. Website trust and conversion feedback\nCheck whether visitors can quickly understand services, see contact options, submit forms, use WhatsApp, and know why they should trust the business.\n\n6. What to fix first\nStart with title, meta description, H1, service clarity, contact form, schema, sitemap, image alt text, tracking and AI-ready content.\n\n7. When Axon should help\nAsk Axon to review the full site if you need SEO/GEO/AEO, website revamp, tracking, form delivery, hosting, security or AI-search visibility improvements.\n\n${nextStepLinks(profile)}`;
  }

  function prepareWebsiteReply(reply, scan, profile) {
    const findings = publicFindingsBlock(scan);
    const cleanReply = appendPageReferences(reply || websiteFallback(scan, profile), profile);
    if (/0\. Public scan findings detected by Axon/i.test(cleanReply)) return cleanReply;
    return `${findings}\n\nAI advisory and improvement suggestions\n${cleanReply}`;
  }

  async function runAsk(question, type, website, outputBox, options = {}) {
    if (!question || !outputBox || isAsking) return;
    const profile = options.profile || detectIntent(question);
    hideSubmitBox();
    lastQuestion = question;
    lastReply = '';
    lastType = type;
    lastWebsite = website || '';
    isAsking = true;
    const triggerButton = options.triggerButton || null;
    const originalButtonText = triggerButton ? triggerButton.textContent : '';
    if (triggerButton) { triggerButton.disabled = true; triggerButton.textContent = type === 'AI Website Advisory Review' ? 'Analyzing...' : 'Reviewing...'; }
    renderAnswer(outputBox, options.progressMessage || (type === 'AI Website Advisory Review' ? 'Preparing an AI Website Advisory Review...' : `Ask Axon is reviewing this as: ${profile.label}...`));
    try {
      let reply = null;
      if (!options.websiteReview) reply = templateAnswer(question, profile);
      if (!reply) {
        reply = await askKimi(question, profile, { mode: options.websiteReview ? 'website_audit' : 'ask_axon', systemPrompt: options.systemPrompt });
        if (isWeakAiReply(reply)) reply = options.websiteReview ? websiteFallback(options.scan, profile) : fallbackAnswer(question, profile);
        reply = options.websiteReview ? prepareWebsiteReply(reply, options.scan, profile) : appendPageReferences(reply, profile);
      }
      lastReply = reply;
      renderAnswer(outputBox, reply);
      showSubmitBox();
    } catch (error) {
      const reply = options.websiteReview ? prepareWebsiteReply(websiteFallback(options.scan, profile), options.scan, profile) : (templateAnswer(question, profile) || fallbackAnswer(question, profile));
      lastReply = reply;
      renderAnswer(outputBox, `${reply}\n\nNote: The live AI service could not be reached, so Ask Axon prepared a safe advisory response using available checks and common business technology patterns.`);
      showSubmitBox();
      console.warn(error);
    } finally {
      isAsking = false;
      if (triggerButton) { triggerButton.disabled = false; triggerButton.textContent = originalButtonText; }
    }
  }

  async function scanWebsite(url) {
    const response = await fetch(siteCheckEndpoint(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error(data.message || 'Unable to run the basic website check.');
    return data.scan || null;
  }

  function listValue(value) { return Array.isArray(value) ? (value.length ? value.join(', ') : 'Not detected') : (value || 'Not detected'); }

  function populateCommonQuestions() {
    if (!commonSelect) return;
    if (commonSelect.options.length <= 1) {
      commonQuestions.forEach((question) => {
        const option = document.createElement('option');
        option.value = question;
        option.textContent = question;
        commonSelect.appendChild(option);
      });
    }
  }

  document.getElementById('askAxonForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.submitter || event.target.querySelector('button[type="submit"]');
    const question = questionBox?.value.trim() || '';
    runAsk(question, 'Ask Axon request', '', resultBox, { triggerButton: button });
  });

  askSelectedBtn?.addEventListener('click', () => {
    const question = commonSelect?.value.trim() || '';
    if (!question) { commonSelect?.focus(); return; }
    if (questionBox) questionBox.value = question;
    runAsk(question, 'Ask Axon request', '', resultBox, { triggerButton: askSelectedBtn });
  });

  document.querySelectorAll('[data-example]').forEach((button) => button.addEventListener('click', () => {
    if (questionBox) questionBox.value = button.getAttribute('data-example') || '';
    hideSubmitBox();
  }));

  document.getElementById('websiteReviewForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = document.getElementById('websiteUrl')?.value.trim() || '';
    const notes = document.getElementById('websiteNotes')?.value.trim() || '';
    const box = document.getElementById('websiteReviewResult');
    const button = event.submitter || event.target.querySelector('button[type="submit"]');
    if (!box || !url || isAsking) return;

    let scan = null;
    renderAnswer(box, 'Checking the live website first: status, final URL, title, meta description, H1, likely website engine/platform, mobile tag, schema, sitemap, robots.txt, llms.txt, analytics clues, forms, links and image clues...');
    try { scan = await scanWebsite(url); } catch (error) { console.warn(error); }
    const profile = axonIntentProfiles.find((item) => item.key === 'website_review') || detectIntent(`${notes} ${url}`);
    const prompt = `AI Website Advisory Review for a business owner.\n\nWebsite URL: ${url}\nClient notes: ${notes || 'None'}\n\nBASIC PUBLIC WEBSITE CHECK RESULTS:\n${formatScanSummary(scan)}\n\nPrepare an actual website advisory review using the scan findings. Avoid generic answers. Mention the detected title, meta description, H1, likely engine/platform, analytics/tag clues, schema, sitemap, robots.txt, llms.txt and practical improvements. Explain what Axon may need to check further.`;
    runAsk(prompt, 'AI Website Advisory Review', url, box, { websiteReview: true, triggerButton: button, profile, scan, systemPrompt: websiteAuditPrompt(), progressMessage: 'Basic website check completed. Ask Axon is preparing the website advisory review using the scan findings...' });
  });

  submitForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('askSubmitStatus');
    if (!lastQuestion || !lastReply) {
      if (status) { status.textContent = 'Please ask a question or run the website review first.'; status.className = 'ask-axon-status error'; }
      return;
    }
    if (status) { status.textContent = 'Sending to Axon Team...'; status.className = 'ask-axon-status'; }
    const payload = {
      name: document.getElementById('askName')?.value.trim() || '',
      email: document.getElementById('askEmail')?.value.trim() || '',
      phone: document.getElementById('askPhone')?.value.trim() || '',
      company: document.getElementById('askCompany')?.value.trim() || '',
      website: lastWebsite,
      requestType: lastType,
      question: lastQuestion,
      advisorReply: lastReply
    };
    try {
      const response = await fetch('ask-axon-submit.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to send right now.');
      if (status) { status.textContent = 'Sent successfully. A copy has also been emailed to you.'; status.classList.add('success'); }
      event.target.reset();
    } catch (error) {
      if (status) { status.textContent = error.message || 'Unable to send right now. Please email support@axon.com.sg.'; status.classList.add('error'); }
    }
  });

  populateCommonQuestions();
  if (resultBox && resultBox.textContent.includes('Your Ask Axon response')) {
    resultBox.textContent = 'No technical knowledge needed. Type your issue in your own words. Ask Axon will explain what it likely means, what to check first, and when Axon should assist.';
  }
  hideSubmitBox();
})();