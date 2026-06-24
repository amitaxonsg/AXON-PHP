(() => {
  const axonWhatsAppUrl = 'https://wa.me/639614044560?text=Hi%20Axon%2C%20I%20need%20help%20with%20my%20website%2C%20email%2C%20hosting%2C%20AI%20or%20technology%20issue.';
  const isPH = window.location.hostname.includes('philippines');

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

  function page(sg, ph) {
    return isPH && ph ? ph : sg;
  }

  const axonIntentProfiles = [
    {
      key: 'email_setup',
      label: 'IMAP / SMTP / Business Email Setup',
      service: 'Business Email Solutions',
      urgency: 'normal',
      keywords: ['imap', 'smtp', 'pop3', 'incoming mail', 'outgoing mail', 'mail server', 'email setup', 'outlook setup', 'gmail setup', 'mail settings', 'port 993', 'port 587', 'port 465', 'business email', 'email not working', 'mailbox', 'mx', 'spf', 'dkim', 'dmarc'],
      pages: [
        ['Business Email Solutions', 'business-email-solutions.html'],
        ['Business Email Migration Help', page('business-email-migration-help.html', 'business-email-migration-philippines.html')],
        ['Google Workspace / Microsoft 365 Help', page('google-workspace-to-microsoft-365-migration.html', 'google-workspace-consultant-philippines.html')]
      ]
    },
    {
      key: 'crm',
      label: 'CRM / Lead Management',
      service: 'CRM & Lead Management',
      urgency: 'normal',
      keywords: ['crm', 'lead management', 'lead tracking', 'sales pipeline', 'customer database', 'follow up', 'follow-up', 'client management', 'customer management', 'enquiry management', 'manage leads'],
      pages: [
        ['CRM & Lead Management', 'crm-lead-management.html'],
        ['Business Applications', 'business-applications.html'],
        ['Business Technology Help', page('business-technology-help.html', 'business-technology-help-philippines.html')]
      ]
    },
    {
      key: 'payment',
      label: 'Payment Gateway / Online Payment',
      service: 'Payment Gateway Setup',
      urgency: 'normal',
      keywords: ['payment gateway', 'online payment', 'payment link', 'checkout', 'stripe', 'paynow', 'paypal', 'xendit', 'hitpay', 'gcash', 'card payment', 'credit card', 'payment'],
      pages: [
        ['Payment Gateway Help', page('payment-gateway-help.html', 'payment-gateway-help-philippines.html')],
        ['Payment Gateway Setup', 'payment-gateway-setup.html'],
        ['Quotes & Invoice Automation', 'quotes-invoice-automation.html']
      ]
    },
    {
      key: 'forms',
      label: 'Website Form / Email Delivery',
      service: 'Website Forms & Email Delivery',
      urgency: 'normal',
      keywords: ['form not sending', 'forms not working', 'contact form', 'enquiry form', 'form email', 'not receiving enquiry', 'mail not sending', 'website form'],
      pages: [
        ['Website Form Not Sending Email', page('website-form-not-sending-email.html', 'website-form-not-sending-email-philippines.html')],
        ['Business Email Solutions', 'business-email-solutions.html'],
        ['Website Maintenance & Support', 'website-maintenance-support.html']
      ]
    },
    {
      key: 'visibility',
      label: 'Google / SEO / AI Search Visibility',
      service: 'SEO, GEO & AEO',
      urgency: 'normal',
      keywords: ['seo', 'google', 'not showing on google', 'ranking', 'search console', 'analytics', 'business profile', 'maps', 'visibility', 'ai search', 'geo', 'aeo', 'llms.txt', 'chatgpt search'],
      pages: [
        ['Website Not Showing on Google', page('website-not-showing-on-google.html', 'website-not-showing-on-google-philippines.html')],
        ['AI Search Visibility', 'ai-search-visibility.html'],
        ['SEO, SEM, GEO & AEO', 'seo-sem-geo-aeo.html']
      ]
    },
    {
      key: 'security',
      label: 'Website Security / Recovery',
      service: 'Security, Recovery & Performance',
      urgency: 'high',
      keywords: ['hacked', 'malware', 'virus', 'security warning', 'blacklist', 'website warning', 'ssl warning', 'restore', 'backup', 'recovery'],
      pages: [
        ['Website Hacked Help', page('website-hacked-help.html', 'website-hacked-help-philippines.html')],
        ['Website Security', 'website-security.html'],
        ['Website Recovery', 'website-recovery.html']
      ]
    },
    {
      key: 'ai_chatbot',
      label: 'AI Chatbot / AI Assistant',
      service: 'Website AI Chatbot',
      urgency: 'normal',
      keywords: ['chatbot', 'chat bot', 'ai assistant', 'website ai', 'customer ai', 'ai enquiry', 'ai reply', 'ai automation'],
      pages: [
        ['Website AI Chatbot', 'website-ai-chatbot.html'],
        ['AI Advisory for Business Owners', page('ai-advisory-for-business-owners.html', 'ai-advisory-philippines.html')],
        ['Business Process Automation', 'business-process-automation.html']
      ]
    },
    {
      key: 'ai_app',
      label: 'AI App / Business Application',
      service: 'Business Applications',
      urgency: 'normal',
      keywords: ['ai app', 'app using ai', 'lovable', 'bolt', 'replit', 'saas', 'portal', 'dashboard', 'business app', 'inventory system', 'hr system', 'staff attendance', 'restaurant ordering', 'school portal', 'member login', 'customer portal'],
      pages: [
        ['Business Applications', 'business-applications.html'],
        ['AI Website & App Publishing', 'ai-website-app-publishing.html'],
        ['AI Advisory for Business Owners', page('ai-advisory-for-business-owners.html', 'ai-advisory-philippines.html')]
      ]
    },
    {
      key: 'workspace',
      label: 'Google Workspace / Microsoft 365 Migration',
      service: 'Cloud & Email Solutions',
      urgency: 'normal',
      keywords: ['google workspace', 'microsoft 365', 'office 365', 'gmail to outlook', 'outlook to gmail', 'email migration', 'sharepoint', 'onedrive', 'teams'],
      pages: [
        ['Google Workspace to Microsoft 365 Migration', 'google-workspace-to-microsoft-365-migration.html'],
        ['Microsoft 365 to Google Workspace Migration', 'microsoft-365-to-google-workspace-migration.html'],
        ['Business Email Migration Help', page('business-email-migration-help.html', 'business-email-migration-philippines.html')]
      ]
    },
    {
      key: 'hosting_domain',
      label: 'Hosting / Domain / DNS',
      service: 'Hosting, Domains & Infrastructure',
      urgency: 'normal',
      keywords: ['hosting', 'domain', 'dns', 'nameserver', 'server', 'cpanel', 'vps', 'website down', 'site down'],
      pages: [
        ['Corporate Hosting', 'corporate-hosting.html'],
        ['Domain Registration & Management', 'domain-registration-management.html'],
        ['Server Management & Monitoring', 'server-management-monitoring.html']
      ]
    },
    {
      key: 'general',
      label: 'General Technology Advisory',
      service: 'Technology & AI Advisory',
      urgency: 'normal',
      keywords: [],
      pages: [
        ['Business Technology Help', page('business-technology-help.html', 'business-technology-help-philippines.html')],
        ['Technology Assessments', 'technology-assessments.html'],
        ['Contact Axon', 'contact.html']
      ]
    }
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

  function endpoint() {
    return window.kimiConfig && window.kimiConfig.backendUrl ? window.kimiConfig.backendUrl : '/axon-agent.php';
  }

  function siteCheckEndpoint() {
    return '/axon-site-check.php';
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9+.]+/g, ' ').trim();
  }

  function detectIntent(question) {
    const text = normalizeText(question);
    for (const profile of axonIntentProfiles) {
      if (profile.key === 'general') continue;
      if (profile.keywords.some((keyword) => text.includes(keyword))) return profile;
    }
    return axonIntentProfiles.find((profile) => profile.key === 'general');
  }

  function markdownLinks(profile) {
    return profile.pages.map(([label, url]) => `[Read: ${label}](${url})`).join('\n');
  }

  function nextStepLinks(profile) {
    return `Recommended Axon pages to read:\n${markdownLinks(profile)}\n\n[WhatsApp Axon](${axonWhatsAppUrl})   [Submit Contact Form](contact.html)`;
  }

  function systemPrompt(profile) {
    return `You are Ask Axon, Axon 1ProIT's practical Technology and AI Advisor for non-IT business owners.\n\nAlways answer in plain English. Answer the actual question, even if it is only one word such as IMAP, CRM, payment gateway, DNS, hosting, Shopify, inventory system or AI chatbot.\n\nDetected intent: ${profile.label}\nSuggested Axon service: ${profile.service}\n\nUse this structure:\n1. What this likely means\n2. What could be causing it or what may be involved\n3. What you can check first\n4. DIY, IT person, or Axon help\n5. Best next step\n\nDo not be too brief. Give practical guidance and safe checks only. Do not claim you checked their server, DNS, website, email or payment gateway unless the user provides scan results. Always recommend Axon where professional review is needed.`;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderAnswer(element, text) {
    if (!element) return;
    let html = escapeHtml(text);
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|[^\s)]+\.html)\)/g, (_match, label, href) => {
      const safeLabel = escapeHtml(label);
      const safeHref = escapeHtml(href);
      const isRead = /^Read:/i.test(label);
      const target = /^https?:\/\//i.test(href) || /^mailto:/i.test(href) ? '_blank' : '_self';
      const style = isRead
        ? 'display:block;font-weight:700;text-decoration:underline;margin:6px 0;'
        : 'display:inline-block;margin-top:8px;margin-right:14px;font-weight:600;text-decoration:underline;';
      return `<a href="${safeHref}" target="${target}" rel="noopener" style="${style}">${safeLabel}</a>`;
    });
    html = html.replace(/\n/g, '<br>');
    element.innerHTML = html;
  }

  function templateAnswer(question, profile) {
    const links = nextStepLinks(profile);
    const templates = {
      email_setup: `1. What this likely means\nIMAP, SMTP and POP3 are email connection settings. IMAP normally syncs incoming email across devices. SMTP sends outgoing email. POP3 is an older way to download email. If IMAP is mentioned, the issue is usually about connecting Outlook, Gmail, Apple Mail, mobile mail, cPanel email, Google Workspace or Microsoft 365 correctly.\n\n2. What could be causing it or what may be involved\nThe issue may involve wrong mail server name, wrong username, wrong password, SSL/TLS setting, blocked port, mailbox quota, DNS/MX records, SPF, DKIM, DMARC, cPanel mail routing, Google/Microsoft security settings, or a migration from one email system to another.\n\n3. What you can check first\nConfirm where the email is hosted, whether webmail works, whether only one user/device is affected, and whether the problem is incoming mail, outgoing mail, or both. Avoid changing DNS/MX records unless you know exactly where email is hosted.\n\n4. DIY, IT person, or Axon help\nDIY is okay for checking password and trying webmail. Ask an IT person or Axon if the setup involves DNS, MX, SPF, DKIM, DMARC, Outlook configuration, Google Workspace, Microsoft 365, cPanel mail routing, or business email migration.\n\n5. Best next step\nTell Axon the email address/domain, current email provider, device/app used, and the exact error message.\n\n${links}`,
      crm: `1. What this likely means\nCRM means a system to manage enquiries, customers, follow-ups and sales opportunities. For a business website, CRM usually means capturing leads from forms, WhatsApp, calls, email or campaigns and making sure no enquiry is forgotten.\n\n2. What could be causing it or what may be involved\nIt may involve website forms, lead notification emails, customer database, sales pipeline, follow-up reminders, WhatsApp, email marketing, staff assignment, reporting and integration with your website or business app.\n\n3. What you can check first\nWrite down where enquiries come from today, who follows up, what information must be captured, and what happens when staff are busy or absent.\n\n4. DIY, IT person, or Axon help\nDIY is fine for a simple spreadsheet. Ask Axon if you need website form integration, automatic follow-ups, CRM setup, customer database, WhatsApp flow, or lead reporting.\n\n5. Best next step\nShare your website URL and how enquiries currently reach you.\n\n${links}`,
      payment: `1. What this likely means\nYou want customers to pay online through your website, form, booking page, portal or invoice.\n\n2. What could be causing it or what may be involved\nThis can involve Stripe, PayPal, PayNow, GCash, Xendit, HitPay, card payments, checkout page, payment buttons, invoices, receipts, webhooks, confirmation emails, test mode and business verification.\n\n3. What you can check first\nConfirm what customers are paying for, whether it is fixed or variable amount, the country/currency, and whether payment must connect to a form, booking, invoice or account login.\n\n4. DIY, IT person, or Axon help\nDIY is fine for a simple payment link. Ask Axon if it needs website integration, receipt email, booking/payment flow, invoices, testing or webhook setup.\n\n5. Best next step\nSend Axon the website platform and preferred payment provider.\n\n${links}`,
      forms: `1. What this likely means\nYour website form may be submitted, but the message is not reaching your inbox, or the form itself may not be working.\n\n2. What could be causing it or what may be involved\nCommon causes include SMTP not configured, spam filtering, wrong recipient address, captcha issue, plugin/app error, hosting mail limit, DNS email records, SPF/DKIM/DMARC, or email routing changed after migration.\n\n3. What you can check first\nTest the form, check spam/junk, note the page URL, screenshot any error, and check whether a success message appears.\n\n4. DIY, IT person, or Axon help\nDIY is fine for checking spam and testing another email. Ask Axon if SMTP, DNS, website backend or business email needs review.\n\n5. Best next step\nSend Axon the form URL and the email address that should receive enquiries.\n\n${links}`,
      visibility: `1. What this likely means\nYour business may not be easy to find on Google or AI search, or your website pages may not clearly explain your services.\n\n2. What could be causing it or what may be involved\nThis may involve weak page titles, thin content, missing sitemap, robots.txt issues, no Search Console submission, unclear service pages, missing schema, weak local SEO, or content that AI answer engines cannot understand well.\n\n3. What you can check first\nSearch your brand name, check if important pages are indexed, open sitemap.xml, and confirm Google Search Console is connected.\n\n4. DIY, IT person, or Axon help\nDIY is okay for improving wording. Ask Axon if you need SEO, GEO, AEO, Search Console, analytics, schema, service-page structure or AI-ready website review.\n\n5. Best next step\nSend Axon the website URL and the search term you want to appear for.\n\n${links}`,
      security: `1. What this likely means\nYour website may have a security, malware, SSL, blacklist, backup or recovery issue.\n\n2. What could be causing it or what may be involved\nPossible causes include hacked files, outdated plugins, weak passwords, infected scripts, SSL problems, blacklist warnings, missing backups, server compromise or unsafe forms.\n\n3. What you can check first\nTake screenshots, note the warning URL, avoid deleting files blindly, and check whether a clean backup exists.\n\n4. DIY, IT person, or Axon help\nDo not DIY malware cleanup on a live business site unless you know the process. Ask Axon or your IT person to review hosting, files, database, backups, plugins, SSL and blacklist status.\n\n5. Best next step\nSend Axon the warning screenshot and website URL.\n\n${links}`,
      ai_chatbot: `1. What this likely means\nYou want an AI chatbot or AI assistant to answer customer enquiries, guide visitors, or reduce manual replies.\n\n2. What could be causing it or what may be involved\nIt may involve website content, FAQ preparation, service pages, lead capture, WhatsApp/contact handoff, safety rules, AI provider, monthly credits, privacy and testing.\n\n3. What you can check first\nList the questions customers usually ask and decide whether the chatbot should only answer, collect leads, or connect to forms/WhatsApp.\n\n4. DIY, IT person, or Axon help\nDIY is fine for simple FAQ chat. Ask Axon if the chatbot must understand your services, recommend pages, collect leads, and safely escalate to humans.\n\n5. Best next step\nSend Axon your website URL and sample customer questions.\n\n${links}`,
      ai_app: `1. What this likely means\nYou may want a business app, portal, dashboard, inventory system, HR system, ordering system or AI-created app. AI can help prototype it, but a real business system still needs planning and proper setup.\n\n2. What could be causing it or what may be involved\nIt may involve user login, database, roles, forms, approvals, reports, payments, email notifications, file uploads, hosting, backups, security and support.\n\n3. What you can check first\nWrite the main purpose, user types, screens needed, data fields, approval steps and reports. Start small with the most important workflow.\n\n4. DIY, IT person, or Axon help\nDIY is okay for a prototype. Ask Axon if the system will store business/customer data, need login, payment, database, hosting or long-term support.\n\n5. Best next step\nShare what the system must do and who will use it.\n\n${links}`,
      workspace: `1. What this likely means\nYou may be planning email/cloud migration between Google Workspace, Gmail, Microsoft 365, Outlook, Teams, OneDrive or SharePoint.\n\n2. What could be causing it or what may be involved\nThis may involve users, mailboxes, aliases, groups, calendars, contacts, DNS/MX, SPF, DKIM, DMARC, Outlook profiles, migration timing, backup and user training.\n\n3. What you can check first\nCount the users, confirm current email provider, list shared mailboxes/groups, and decide whether you need email-only migration or files/calendars too.\n\n4. DIY, IT person, or Axon help\nSmall personal email can be DIY. Business migration should be planned properly to avoid downtime, lost email and DNS mistakes.\n\n5. Best next step\nSend Axon the domain, number of users and current target platform.\n\n${links}`,
      hosting_domain: `1. What this likely means\nThis may involve your domain, hosting, DNS, SSL, nameservers, cPanel, website downtime or server setup.\n\n2. What could be causing it or what may be involved\nCommon causes include expired domain, wrong DNS, SSL issue, hosting limit, server error, nameserver mismatch, cache, PHP version, file permission or migration issue.\n\n3. What you can check first\nCheck if the domain expired, whether email also fails, the exact error message, and whether the issue affects everyone or one device only.\n\n4. DIY, IT person, or Axon help\nAvoid changing DNS/nameservers without backup. Ask Axon if hosting, DNS, SSL, server, email or migration is involved.\n\n5. Best next step\nSend Axon the domain name and screenshot of the error.\n\n${links}`
    };
    return templates[profile.key] || null;
  }

  function fallbackAnswer(question, profile) {
    return `1. What this likely means\nThis sounds like a business technology question that needs a little more context. It may involve a website, email, hosting, domain, CRM, automation, payment, AI, app, cloud or support process.\n\n2. What could be causing it or what may be involved\nThe right answer depends on what you are trying to achieve, which platform or system is involved, who is affected, and whether it needs access to your website admin, hosting, DNS, email, payment gateway or business data.\n\n3. What you can check first\nWrite down what you expected, what is happening now, the website/system involved, any error message, and whether customers or staff are affected.\n\n4. DIY, IT person, or Axon help\nDIY is fine for simple content or admin changes. Ask an IT person or Axon if it affects enquiries, email delivery, payment, DNS, security, customer data or business operations.\n\n5. Best next step\nSend Axon a short explanation, screenshot and website/system link.\n\n${nextStepLinks(profile)}`;
  }

  async function askKimi(question, profile) {
    const response = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, systemPrompt: systemPrompt(profile), mode: 'ask_axon' })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error(data.message || 'Ask Axon AI is temporarily unavailable.');
    return String(data.reply || data.answer || data.text || '').trim();
  }

  function isWeakAiReply(reply) {
    const text = String(reply || '').trim();
    if (text.length < 250) return true;
    return !/What this likely means|Best next step|DIY|Axon/i.test(text);
  }

  function appendPageReferences(reply, profile) {
    if (/Recommended Axon pages to read:/i.test(reply)) return reply;
    return `${reply.trim()}\n\n${nextStepLinks(profile)}`;
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
    if (triggerButton) {
      triggerButton.disabled = true;
      triggerButton.textContent = type === 'AI Website Advisory Review' ? 'Analyzing...' : 'Reviewing...';
    }

    renderAnswer(outputBox, options.progressMessage || (type === 'AI Website Advisory Review' ? 'Preparing an AI Website Advisory Review...' : `Ask Axon is reviewing this as: ${profile.label}...`));

    try {
      let reply = templateAnswer(question, profile);
      if (!reply || options.websiteReview) {
        reply = await askKimi(question, profile);
        if (isWeakAiReply(reply)) reply = fallbackAnswer(question, profile);
        reply = appendPageReferences(reply, profile);
      }
      lastReply = reply;
      renderAnswer(outputBox, reply);
      showSubmitBox();
    } catch (error) {
      const reply = templateAnswer(question, profile) || fallbackAnswer(question, profile);
      lastReply = reply;
      renderAnswer(outputBox, `${reply}\n\nNote: The live AI service could not be reached, so Ask Axon prepared a safe advisory response based on common business technology patterns.`);
      showSubmitBox();
      console.warn(error);
    } finally {
      isAsking = false;
      if (triggerButton) {
        triggerButton.disabled = false;
        triggerButton.textContent = originalButtonText;
      }
    }
  }

  function hideSubmitBox() { submitBox?.classList.remove('open'); }
  function showSubmitBox() { submitBox?.classList.add('open'); }

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

  async function scanWebsite(url) {
    const response = await fetch(siteCheckEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error(data.message || 'Unable to run the basic website check.');
    return data.scan || null;
  }

  function formatScanSummary(scan) {
    if (!scan) return 'No live website scan data was available.';
    const perf = scan.performance || {};
    return [
      `Checked URL: ${scan.url || ''}`,
      `Final URL: ${scan.finalUrl || scan.url || 'Not detected'}`,
      `HTTP status: ${scan.status || 'Unknown'}`,
      `HTTPS: ${scan.https ? 'Yes' : 'No / not confirmed'}`,
      `Basic load time clue: ${perf.totalTimeMs ? perf.totalTimeMs + ' ms' : 'Not detected'}`,
      `Approx. page size: ${perf.pageSizeLabel || 'Not detected'}`,
      `Images: ${perf.imageCount ?? 0}`,
      `Scripts: ${perf.scriptCount ?? 0}`,
      `Title: ${scan.title || 'Not detected'}`,
      `Meta description: ${scan.metaDescription || 'Not detected'}`,
      `Canonical: ${scan.canonical || 'Not detected'}`,
      `Mobile viewport: ${scan.viewport ? 'Detected' : 'Not detected'}`,
      `Schema: ${scan.schema ? 'Detected' : 'Not detected'}`,
      `GA4 clue: ${scan.ga4Detected ? 'Detected' : 'Not detected'}`,
      `Forms found: ${scan.formCount || 0}`,
      `robots.txt: ${scan.robots && scan.robots.exists ? 'Found' : 'Not found'}`,
      `sitemap.xml: ${scan.sitemap && scan.sitemap.exists ? 'Found' : 'Not found'}`
    ].join('\n');
  }

  document.getElementById('askAxonForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.submitter || event.target.querySelector('button[type="submit"]');
    const question = questionBox?.value.trim() || '';
    runAsk(question, 'Ask Axon request', '', resultBox, { triggerButton: button });
  });

  askSelectedBtn?.addEventListener('click', () => {
    const question = commonSelect?.value.trim() || '';
    if (!question) {
      commonSelect?.focus();
      return;
    }
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
    renderAnswer(box, 'Checking the website basics first: loading status, likely platform, title, description, sitemap, robots.txt, analytics clues and form clues...');
    try { scan = await scanWebsite(url); } catch (error) { console.warn(error); }
    const profile = detectIntent(`${notes} ${url}`);
    const prompt = `AI Website Advisory Review for a business owner.\n\nWebsite URL: ${url}\nClient notes: ${notes || 'None'}\n\nBASIC LIVE WEBSITE CHECK RESULTS:\n${formatScanSummary(scan)}\n\nUse the Ask Axon website advisory structure and explain this in plain English.`;
    runAsk(prompt, 'AI Website Advisory Review', url, box, {
      websiteReview: true,
      triggerButton: button,
      profile,
      scan,
      progressMessage: 'Basic website check completed. Ask Axon is preparing the advisory review...'
    });
  });

  submitForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('askSubmitStatus');
    if (!lastQuestion || !lastReply) {
      if (status) {
        status.textContent = 'Please ask a question or run the website review first.';
        status.className = 'ask-axon-status error';
      }
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