(() => {
  const axonWhatsAppUrl = 'https://wa.me/639614044560?text=Hi%20Axon%2C%20I%20need%20help%20with%20my%20website%2C%20email%2C%20hosting%2C%20AI%20or%20technology%20issue.';
  const axonEmailUrl = 'mailto:amit@axon.com.sg?subject=Ask%20Axon%20Support%20Request';

  const commonQuestions = [
    'My website is slow. What should I check first?',
    'My website contact form is not sending emails.',
    'My business email is going to spam. What should I check first?',
    'I want to build an app using AI. How easy is it?',
    'I need a payment gateway on my website.',
    'I want an AI chatbot on my website. What do I need to prepare?',
    'Is my website AI-ready for ChatGPT, Gemini and AI search?',
    'My website is not showing properly on Google.',
    'I need help with my Wix website.',
    'I need help with my Shopify store.',
    'I need help with my WordPress website.',
    'My domain or hosting renewal is due. What should I check?',
    'My website is hacked or showing a warning.',
    'I want to migrate email to Google Workspace.',
    'I want to migrate email to Microsoft 365.',
    'I need a booking or appointment system.',
    'I want to automate follow-ups from website enquiries.',
    'I need CRM or lead management for website leads.',
    'I want to redesign my old website.',
    'I need SEO and Google Business Profile help.',
    'My website is not mobile-friendly.',
    'My website loads but enquiries are low.',
    'I need help publishing an AI-created website or app.',
    'I need online payment, invoices or quotation automation.',
    'I need a customer portal or member login area.',
    'I want to know whether this is DIY or needs professional help.',
    'My SSL or website security warning is showing.',
    'My Outlook or Gmail is not working properly.',
    'I need backup and website recovery support.',
    'I am not sure what technology solution my business needs.'
  ];

  const axonIntentProfiles = [
    { key: 'urgent', label: 'Urgent Business Support', service: 'Website / Email / Security Support', urgency: 'high', keywords: ['website down', 'site down', 'email down', 'hacked', 'malware', 'blacklist', 'payment not working', 'domain expired', 'ssl warning', 'cannot login', 'urgent'], pages: [['Website Recovery', 'https://axon.com.sg/website-recovery.html'], ['Website Security', 'https://axon.com.sg/website-security.html'], ['Business Email Solutions', 'https://axon.com.sg/business-email-solutions.html']] },
    { key: 'ai_app', label: 'AI App / AI Website Publishing', service: 'AI Website & App Publishing', urgency: 'normal', keywords: ['ai app', 'app on ai', 'ai build app', 'build app using ai', 'make app with ai', 'lovable', 'bolt', 'replit', 'saas', 'portal', 'dashboard', 'business app', 'app publishing', 'ai-created app', 'ai created app'], pages: [['AI Website & App Publishing', 'https://axon.com.sg/ai-website-app-publishing.html'], ['Business Applications', 'https://axon.com.sg/business-applications.html'], ['AI Consulting & Implementation', 'https://axon.com.sg/ai-consulting-implementation.html']] },
    { key: 'payment', label: 'Payment Gateway / Online Payment', service: 'Payment Gateway Setup', urgency: 'normal', keywords: ['payment gateway', 'online payment', 'payment link', 'checkout', 'stripe', 'paynow', 'credit card', 'card payment', 'paypal', 'xendit', 'hitpay', 'payment'], pages: [['Payment Gateway Setup', 'https://axon.com.sg/payment-gateway-setup.html'], ['Quotes & Invoice Automation', 'https://axon.com.sg/quotes-invoice-automation.html'], ['E-Commerce Solutions', 'https://axon.com.sg/e-commerce-solutions.html']] },
    { key: 'forms', label: 'Website Form / Email Delivery', service: 'Business Email Solutions', urgency: 'normal', keywords: ['form not sending', 'forms not working', 'contact form', 'enquiry form', 'form email', 'smtp', 'not receiving enquiry', 'mail not sending'], pages: [['Business Email Solutions', 'https://axon.com.sg/business-email-solutions.html'], ['Website Maintenance & Support', 'https://axon.com.sg/website-maintenance-support.html'], ['Website Monitoring & Health Checks', 'https://axon.com.sg/website-monitoring-health-checks.html']] },
    { key: 'website_speed', label: 'Website Speed / Performance', service: 'Performance Optimization', urgency: 'normal', keywords: ['website slow', 'site slow', 'loading slow', 'load slow', 'speed', 'performance', 'core web vitals'], pages: [['Performance Optimization', 'https://axon.com.sg/performance-optimization.html'], ['Core Web Vitals Checks', 'https://axon.com.sg/core-web-vitals-checks.html'], ['Website Optimization Audit', 'https://axon.com.sg/website-optimization-audit.html']] },
    { key: 'email', label: 'Business Email / Spam / Delivery', service: 'Business Email Solutions', urgency: 'normal', keywords: ['email', 'spam', 'gmail', 'outlook', 'mailbox', 'mx', 'spf', 'dkim', 'dmarc', 'mail delivery'], pages: [['Business Email Solutions', 'https://axon.com.sg/business-email-solutions.html'], ['Google Workspace Solutions', 'https://axon.com.sg/google-workspace-solutions.html'], ['Microsoft 365 Solutions', 'https://axon.com.sg/microsoft-365-solutions.html']] },
    { key: 'wix', label: 'Wix Website Support', service: 'Wix Website Support', urgency: 'normal', keywords: ['wix'], pages: [['Wix Website Support', 'https://axon.com.sg/wix-website-support.html'], ['Website Revamps & Modernization', 'https://axon.com.sg/website-revamps-modernization.html'], ['SEO & Local Visibility', 'https://axon.com.sg/seo-local-visibility.html']] },
    { key: 'shopify', label: 'Shopify Store Support', service: 'Shopify Store Support', urgency: 'normal', keywords: ['shopify', 'online store', 'ecommerce', 'e-commerce', 'products', 'shipping'], pages: [['Shopify Store Support', 'https://axon.com.sg/shopify-store-support.html'], ['E-Commerce Solutions', 'https://axon.com.sg/e-commerce-solutions.html'], ['Payment Gateway Setup', 'https://axon.com.sg/payment-gateway-setup.html']] },
    { key: 'wordpress', label: 'WordPress Support', service: 'Website Maintenance & Support', urgency: 'normal', keywords: ['wordpress', 'plugin', 'woocommerce', 'wp '], pages: [['Website Maintenance & Support', 'https://axon.com.sg/website-maintenance-support.html'], ['WordPress Plugin Development', 'https://axon.com.sg/wordpress-plugin-development.html'], ['Website Security', 'https://axon.com.sg/website-security.html']] },
    { key: 'ai_search', label: 'AI Search / AI-Ready Website', service: 'AI Search Visibility', urgency: 'normal', keywords: ['ai ready', 'ai-ready', 'chatgpt', 'gemini', 'copilot', 'perplexity', 'ai search', 'geo', 'aeo', 'llms.txt'], pages: [['AI-Ready Website', 'https://axon.com.sg/ai-ready-website.html'], ['AI Search Visibility', 'https://axon.com.sg/ai-search-visibility.html'], ['Generative Engine Optimization', 'https://axon.com.sg/generative-engine-optimization.html']] },
    { key: 'seo', label: 'SEO / Google Visibility', service: 'SEO & Local Visibility', urgency: 'normal', keywords: ['seo', 'google', 'not showing on google', 'ranking', 'search console', 'analytics', 'business profile', 'maps', 'visibility'], pages: [['SEO & Local Visibility', 'https://axon.com.sg/seo-local-visibility.html'], ['Google Business Profile', 'https://axon.com.sg/google-business-profile.html'], ['Analytics & Search Console', 'https://axon.com.sg/analytics-search-console.html']] },
    { key: 'chatbot', label: 'AI Chatbot / Automation', service: 'Website AI Chatbot', urgency: 'normal', keywords: ['chatbot', 'chat bot', 'ai assistant', 'automation', 'automate', 'workflow', 'follow up', 'crm', 'lead management'], pages: [['Website AI Chatbot', 'https://axon.com.sg/website-ai-chatbot.html'], ['Business Process Automation', 'https://axon.com.sg/business-process-automation.html'], ['CRM & Lead Management', 'https://axon.com.sg/crm-lead-management.html']] },
    { key: 'hosting_domain', label: 'Hosting / Domain / DNS', service: 'Hosting, Domains & Infrastructure', urgency: 'normal', keywords: ['hosting', 'domain', 'dns', 'nameserver', 'ssl', 'server', 'cpanel', 'migration', 'vps'], pages: [['Corporate Hosting', 'https://axon.com.sg/corporate-hosting.html'], ['Domain Registration & Management', 'https://axon.com.sg/domain-registration-management.html'], ['Server Management & Monitoring', 'https://axon.com.sg/server-management-monitoring.html']] },
    { key: 'workspace', label: 'Google Workspace / Microsoft 365', service: 'Cloud & Email Solutions', urgency: 'normal', keywords: ['google workspace', 'microsoft 365', 'office 365', 'teams', 'onedrive', 'sharepoint'], pages: [['Google Workspace Solutions', 'https://axon.com.sg/google-workspace-solutions.html'], ['Microsoft 365 Solutions', 'https://axon.com.sg/microsoft-365-solutions.html'], ['Document & Collaboration Platforms', 'https://axon.com.sg/document-collaboration-platforms.html']] },
    { key: 'security', label: 'Security / Backup / Recovery', service: 'Security, Recovery & Performance', urgency: 'high', keywords: ['security', 'backup', 'restore', 'recovery', 'virus'], pages: [['Website Security', 'https://axon.com.sg/website-security.html'], ['Backup & Disaster Recovery', 'https://axon.com.sg/backup-disaster-recovery.html'], ['Website Recovery', 'https://axon.com.sg/website-recovery.html']] },
    { key: 'general', label: 'General Technology Advisory', service: 'Technology & AI Advisory', urgency: 'normal', keywords: [], pages: [['Ask Axon', 'https://axon.com.sg/ask-axon.html'], ['Technology Assessments', 'https://axon.com.sg/technology-assessments.html'], ['Executive Advisory', 'https://axon.com.sg/executive-advisory.html']] }
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

  function serviceLinks(profile) {
    return profile.pages.map(([label, url]) => `- [${label}](${url})`).join('\n');
  }


  function yesNo(value) {
    return value ? 'Yes' : 'No';
  }

  function humanMetric(value, fallback = 'Not detected') {
    if (value === null || value === undefined || value === '') return fallback;
    return String(value);
  }

  function formatScanSummary(scan) {
    if (!scan) return 'No live website scan was available. Provide a preliminary advisory only.';
    const platform = scan.platform && scan.platform.detected ? scan.platform.detected.join(', ') : 'Unable to determine';
    const confidence = scan.platform && scan.platform.confidence ? scan.platform.confidence : 'low';
    const perf = scan.performance || {};
    return [
      `Website checked: ${scan.url || ''}`,
      `Final URL after redirect: ${scan.finalUrl || scan.url || ''}`,
      `HTTP status: ${scan.status || 'Unknown'}`,
      `Loads during basic check: ${yesNo(scan.loads)}`,
      `HTTPS detected: ${yesNo(scan.https)}`,
      `Redirect count: ${humanMetric(perf.redirectCount, '0')}`,
      `Basic server-side load time: ${perf.totalTimeMs ? perf.totalTimeMs + ' ms' : 'Not detected'}`,
      `Server first response / TTFB clue: ${perf.ttfbMs ? perf.ttfbMs + ' ms' : 'Not detected'}`,
      `Approximate downloaded page size: ${perf.pageSizeLabel || 'Not detected'}`,
      `Images found on checked page: ${humanMetric(perf.imageCount, '0')}`,
      `Script tags found: ${humanMetric(perf.scriptCount, '0')}`,
      `External script files found: ${humanMetric(perf.externalScriptCount, '0')}`,
      `CSS / style items found: ${humanMetric(perf.cssCount, '0')}`,
      `Iframe/video embed clues: ${humanMetric((Number(perf.iframeCount || 0) + Number(perf.videoEmbedCount || 0)), '0')}`,
      `Cache-Control header: ${perf.cacheControl || 'Not detected'}`,
      `Compression header: ${perf.contentEncoding || 'Not detected'}`,
      `Server header clue: ${perf.serverHeader || 'Not detected'}`,
      `Powered-by clue: ${perf.xPoweredBy || 'Not detected'}`,
      `CDN/cache clue: ${perf.cdnClue || 'Not detected'}`,
      `Likely platform / build type: ${platform}`,
      `Platform confidence: ${confidence}`,
      `Page title: ${scan.title || 'Not detected'}`,
      `Meta description: ${scan.metaDescription || 'Not detected'}`,
      `Canonical URL: ${scan.canonical || 'Not detected'}`,
      `Mobile viewport tag: ${yesNo(scan.viewport)}`,
      `Open Graph tags: ${yesNo(scan.openGraph)}`,
      `Twitter card tags: ${yesNo(scan.twitterCard)}`,
      `Schema / structured data: ${yesNo(scan.schema)}`,
      `Google Analytics GA4 clue: ${yesNo(scan.ga4Detected)}`,
      `Google Tag / Tag Manager clue: ${yesNo(scan.googleTagDetected)}`,
      `Forms found on checked page: ${scan.formCount || 0}`,
      `Email link found: ${yesNo(scan.mailtoDetected)}`,
      `WhatsApp clue found: ${yesNo(scan.whatsappDetected)}`,
      `robots.txt: ${scan.robots && scan.robots.exists ? 'Found' : 'Not found during basic check'}`,
      `sitemap.xml: ${scan.sitemap && scan.sitemap.exists ? 'Found' : 'Not found during basic check'}`,
      `Scan limitation: this is a basic single-page server-side check. It does not replace full speed, mobile, SEO, DNS, hosting, form delivery, security or backend audit.`
    ].join('\n');
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

  function systemPrompt(profile) {
    return `You are Ask Axon, Axon 1ProIT's practical Technology and AI Advisor for business owners.

You are not a general chatbot. Always answer in the context of Axon services: websites, website revamps, hosting, domains, DNS, email delivery, Google Workspace, Microsoft 365, Wix, WordPress, Shopify, forms, SEO, Google visibility, AI search, AI-ready websites, AI chatbots, business automation, AI app publishing, business applications, security, backup and support.

Detected client intent: ${profile.label}
Suggested Axon service: ${profile.service}
Urgency level: ${profile.urgency}
Relevant Axon pages:
${serviceLinks(profile)}

Rules:
- Answer the user's actual question, even if the wording is informal, incomplete or has spelling mistakes.
- Use plain English and useful detail. Do not be brief.
- Do not pretend you checked their website, server, email, DNS or payment gateway unless the user message includes a section called BASIC LIVE WEBSITE CHECK RESULTS. If those results are included, use them carefully and say it was a basic single-page check, not a full audit.
- If the question is a short phrase like payment gateway, website slow, form not working, email, hosting, domain, SEO, chatbot or AI-ready, treat it as a request for explanation, possible causes/setup items, safe checks and Axon next steps.
- If the question is about AI building an app, explain prototype vs proper business app, including requirements, database, login, payment, hosting, security, testing and support.
- If the question is about payment gateway, explain setup versus troubleshooting: Stripe/PayNow/card payments, checkout page, forms, receipts, notifications/webhooks, business verification, test payments and website integration.
- If the question is a website advisory review with BASIC LIVE WEBSITE CHECK RESULTS, mention likely platform/build type only with confidence language such as 'appears to be', 'likely', or 'not clearly detected'. Explain title, meta description, mobile viewport, sitemap, robots, GA4, Open Graph and forms where relevant.
- Give safe checks only. Avoid risky DNS, server, payment or security changes unless handled by an IT person.
- Include relevant page links in markdown format using the relevant Axon pages above.
- End by suggesting the user submit the form on this page or use [WhatsApp](${axonWhatsAppUrl}) for faster support.

For normal Ask Axon answers, use this structure:
1. What this likely means
2. What could be causing it or what may be involved
3. What you can check first
4. DIY, IT person, or Axon help
5. Best next step

For website advisory reviews with BASIC LIVE WEBSITE CHECK RESULTS, use this structure:
1. What you asked
2. Your specific concern
3. Basic live check found
4. Likely platform / build type
5. What may be causing the issue
6. What you can check first
7. What needs Axon or IT review
8. Recommended next step`;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderAnswer(element, text) {
    if (!element) return;
    let html = escapeHtml(text);
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.replace(/\n/g, '<br>');
    element.innerHTML = html;
  }

  function weak(reply, profile, options = {}) {
    const text = String(reply || '').trim();
    if (text.length < 850) return true;
    if (options.websiteReview) {
      const required = ['What you asked', 'Your specific concern', 'Basic live check found', 'Likely platform', 'What may be causing', 'Recommended next step'];
      if (required.some((h) => !text.toLowerCase().includes(h.toLowerCase()))) return true;
      if (options.notes && options.notes.trim() && !text.toLowerCase().includes(options.notes.trim().split(/\s+/)[0].toLowerCase())) {
        // If the answer ignores the first word of the user's note, it may still be valid, so only treat short/generic answers as weak.
        if (/plain-english AI Website Advisory Review|generic service pages|weak calls-to-action/i.test(text)) return true;
      }
      return false;
    }
    const required = ['What this likely means', 'What could be causing', 'What you can check first', 'DIY', 'Best next step'];
    if (required.some((h) => !text.toLowerCase().includes(h.toLowerCase()))) return true;
    if (profile.key !== 'general' && /business technology, website, hosting, email, platform, AI or support request/i.test(text)) return true;
    return false;
  }


  function scanPlatform(scan) {
    return scan && scan.platform && scan.platform.detected ? scan.platform.detected.join(', ') : 'Not clearly detected';
  }

  function scanConfidence(scan) {
    return scan && scan.platform && scan.platform.confidence ? scan.platform.confidence : 'low';
  }

  function performanceFactLine(scan) {
    const perf = scan && scan.performance ? scan.performance : {};
    const parts = [];
    if (perf.totalTimeMs) parts.push(`basic server-side load time around ${perf.totalTimeMs} ms`);
    if (perf.ttfbMs) parts.push(`first response/TTFB around ${perf.ttfbMs} ms`);
    if (perf.pageSizeLabel) parts.push(`downloaded page size about ${perf.pageSizeLabel}`);
    if (perf.imageCount !== undefined) parts.push(`${perf.imageCount} image(s) found`);
    if (perf.scriptCount !== undefined) parts.push(`${perf.scriptCount} script tag(s) found`);
    if (perf.cssCount !== undefined) parts.push(`${perf.cssCount} CSS/style item(s) found`);
    if (perf.redirectCount !== undefined) parts.push(`${perf.redirectCount} redirect(s)`);
    if (perf.cacheControl) parts.push(`Cache-Control: ${perf.cacheControl}`);
    if (perf.contentEncoding) parts.push(`compression: ${perf.contentEncoding}`);
    if (perf.cdnClue) parts.push(perf.cdnClue);
    return parts.length ? parts.join('; ') : 'No detailed performance clues were available from the basic check.';
  }


  function optionsNotesFromQuestion(question) {
    const match = String(question || '').match(/Client notes:\s*([\s\S]*?)(?:\n\nBASIC LIVE WEBSITE CHECK RESULTS:|$)/i);
    if (!match) return '';
    const value = String(match[1] || '').trim();
    return value === 'None' ? '' : value;
  }

  function websiteConcernBlock(notes, profile, scan) {
    const cleanNotes = String(notes || '').trim();
    const concernLead = cleanNotes ? `You mentioned: "${cleanNotes}". ` : '';
    const perfLine = performanceFactLine(scan);
    const platform = scanPlatform(scan);

    const blocks = {
      website_speed: `${concernLead}This is a website speed/performance concern. Based on the basic crawl, useful clues include: ${perfLine}. If visitors feel the site is slow, the common causes are large images, heavy scripts, weak caching, slow hosting response, too many plugins/apps, redirects, third-party tracking tools, video/banner embeds, or mobile layout issues. The basic check can point to clues, but a proper speed audit is still needed before confirming the exact cause.`,
      forms: `${concernLead}This is a website enquiry/form concern. The basic crawl found ${scan && scan.formCount ? scan.formCount : 0} form(s) on the checked page. Form issues are usually caused by SMTP settings, spam filtering, wrong recipient address, plugin/app settings, captcha errors, hosting mail limits, DNS email records, or the form not being tested after a website change.`,
      ai_search: `${concernLead}This is an AI-readiness / Google visibility concern. The important things to check are whether the site has clear service pages, good title and meta description, sitemap and robots.txt, schema, Open Graph, helpful FAQs, and business wording that AI answer engines can understand.`,
      seo: `${concernLead}This is a Google visibility / SEO concern. The basic crawl can check public signals like title, meta description, sitemap, robots.txt, canonical, schema and analytics clues. Ranking problems still need Search Console, content, local SEO and competitor review.`,
      payment: `${concernLead}This is a payment/checkout concern. A website payment issue normally needs review of the payment provider, checkout page, SSL, forms, product/service amount, receipt email, webhook/notification settings and test payments.`,
      hosting_domain: `${concernLead}This may involve hosting, domain, SSL, DNS or server setup. The basic crawl can check whether the public website loads, but a proper review needs hosting panel, DNS, SSL and server access.`,
      security: `${concernLead}This may involve website security or recovery. The public crawl can detect some obvious signals, but malware, hacked files, blacklists, backups and server-level issues need proper secure access review.`,
      general: `${concernLead}This looks like a general website advisory request. The basic crawl gives public clues, but the best next step depends on whether your main concern is speed, enquiries, Google visibility, design clarity, AI readiness, forms, hosting or security.`
    };

    return blocks[profile.key] || blocks.general;
  }

  function websiteIssueCauseBlock(profile, scan) {
    const platform = scanPlatform(scan);
    const perf = scan && scan.performance ? scan.performance : {};
    if (profile.key === 'website_speed') {
      return `Because the site appears to be ${platform}, the next checks should include page weight, image sizes, script count, caching, server response time, redirects, mobile performance and whether the platform/theme/plugins/apps are adding heavy files. Public clues from the crawl: ${performanceFactLine(scan)}.`;
    }
    if (profile.key === 'forms') {
      return `If enquiries are not reaching you, the issue may be form configuration, website SMTP, spam filtering, recipient email, captcha, plugin/app settings, hosting mail limits, or DNS records such as SPF/DKIM/DMARC. The public check can detect forms, but it cannot confirm delivery without a test submission and email/server access.`;
    }
    if (profile.key === 'ai_search' || profile.key === 'seo') {
      return `The issue may be unclear service wording, thin pages, weak titles/descriptions, missing schema, missing sitemap submission, poor internal links, weak FAQs, or content that is not easy for Google and AI answer engines to understand.`;
    }
    if (profile.key === 'payment') {
      return `The issue may involve payment provider setup, checkout integration, API keys, webhooks, SSL, confirmation emails, business verification, currency/payment method settings, or test/live mode mismatch.`;
    }
    return `The issue may involve content clarity, mobile layout, hosting, platform setup, forms, analytics, SEO, AI-readiness, security or backend configuration. The exact cause depends on the website platform and access to backend tools.`;
  }

  function scanTechnicalSummary(scan) {
    if (!scan) return 'No live website scan data was available.';
    const perf = scan.performance || {};
    return [
      `Checked URL: ${scan.url || ''}`,
      `Final URL: ${scan.finalUrl || scan.url || 'Not detected'}`,
      `Load status: ${scan.loads ? 'Loaded during the basic check' : 'Did not load successfully during the basic check'}${scan.status ? ` (HTTP ${scan.status})` : ''}`,
      `Likely platform/build type: ${scanPlatform(scan)} (${scanConfidence(scan)} confidence)`,
      `HTTPS: ${scan.https ? 'Yes' : 'No / not confirmed'}`,
      `Redirect count: ${perf.redirectCount ?? 'Not detected'}`,
      `Basic server-side load time: ${perf.totalTimeMs ? perf.totalTimeMs + ' ms' : 'Not detected'}`,
      `First response / TTFB clue: ${perf.ttfbMs ? perf.ttfbMs + ' ms' : 'Not detected'}`,
      `Approx. page download size: ${perf.pageSizeLabel || 'Not detected'}`,
      `Images: ${perf.imageCount ?? 0}`,
      `Scripts: ${perf.scriptCount ?? 0} total / ${perf.externalScriptCount ?? 0} external`,
      `CSS/style items: ${perf.cssCount ?? 0}`,
      `Iframe/video embed clues: ${(Number(perf.iframeCount || 0) + Number(perf.videoEmbedCount || 0))}`,
      `Cache-Control: ${perf.cacheControl || 'Not detected'}`,
      `Compression: ${perf.contentEncoding || 'Not detected'}`,
      `Server clue: ${perf.serverHeader || 'Not detected'}`,
      `CDN/cache clue: ${perf.cdnClue || 'Not detected'}`,
      `Title tag: ${scan.title || 'Not detected'}`,
      `Meta description: ${scan.metaDescription || 'Not detected'}`,
      `Canonical URL: ${scan.canonical || 'Not detected'}`,
      `Mobile viewport: ${scan.viewport ? 'Detected' : 'Not detected'}`,
      `Open Graph: ${scan.openGraph ? 'Detected' : 'Not detected'}`,
      `Twitter card: ${scan.twitterCard ? 'Detected' : 'Not detected'}`,
      `Schema / structured data: ${scan.schema ? 'Detected' : 'Not detected'}`,
      `GA4 clue: ${scan.ga4Detected ? 'Detected' : 'Not detected on the checked page'}`,
      `Google Tag clue: ${scan.googleTagDetected ? 'Detected' : 'Not detected on the checked page'}`,
      `Forms found on checked page: ${scan.formCount || 0}`,
      `Email link: ${scan.mailtoDetected ? 'Detected' : 'Not detected'}`,
      `WhatsApp clue: ${scan.whatsappDetected ? 'Detected' : 'Not detected'}`,
      `robots.txt: ${scan.robots && scan.robots.exists ? 'Found' : 'Not found during the basic check'}`,
      `sitemap.xml: ${scan.sitemap && scan.sitemap.exists ? 'Found' : 'Not found during the basic check'}`
    ].join('\n');
  }

  function fallback(question, profile, websiteReview = false, scan = null) {
    const links = serviceLinks(profile);
    const nextStep = `If you want Axon to assist, submit the form on this page or use [WhatsApp](${axonWhatsAppUrl}) for faster support.`;
    if (websiteReview) {
      const notes = optionsNotesFromQuestion(question);
      if (scan) {
        const platform = scanPlatform(scan);
        const confidence = scanConfidence(scan);
        const technicalSummary = scanTechnicalSummary(scan);
        const concernBlock = websiteConcernBlock(notes, profile, scan);
        const causeBlock = websiteIssueCauseBlock(profile, scan);

        return `1. What you asked\nYou asked for a basic live website advisory review for ${scan.url || question}${notes ? `, with this specific concern: "${notes}"` : ''}. This is not a full technical audit, but it gives useful public clues before a deeper review.\n\n2. Your specific concern\n${concernBlock}\n\n3. Basic live check found\n${technicalSummary}\n\n4. Likely platform / build type\nThe website appears to be ${platform}. This is based only on public page clues, so treat it as ${confidence} confidence, not a final confirmation. If the site is WordPress, Wix, Shopify, HTML/PHP or a custom app, the troubleshooting path will be different.\n\n5. What may be causing the issue\n${causeBlock}\n\n6. What you can check first\nCheck the website on mobile and desktop. Note which pages feel slow or unclear, whether the issue happens for all users, whether forms send successfully, whether analytics is receiving data, whether the sitemap is submitted in Search Console, and whether key service pages have clear titles, descriptions and contact paths. For speed concerns, check page size, image size, scripts, cache, hosting response time and mobile Core Web Vitals. For forms/payment/security, avoid changing live settings without a backup or test mode.\n\n7. What needs Axon or IT review\nAsk your IT person or Axon to review items that need access: hosting, DNS, SSL, CMS/admin backend, WordPress/Wix/Shopify settings, form delivery, SMTP, analytics/Search Console, payment gateway, security, backups and server performance. Public crawl data is useful, but it cannot confirm backend, email delivery, payment or security issues by itself.\n\n8. Recommended next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`;
      }

      return `1. What you asked\nYou asked for a plain-English AI Website Advisory Review${notes ? ` about: "${notes}"` : ''}. The basic live website check could not return detailed scan data, so this answer is preliminary only.\n\n2. Your specific concern\n${websiteConcernBlock(notes, profile, null)}\n\n3. Basic live check found\nNo detailed scan data was returned. This can happen if the site blocks server-side checks, has DNS/SSL restrictions, redirects unusually, or the checker could not reach the page at that moment.\n\n4. Likely platform / build type\nNot clearly detected.\n\n5. What may be causing the issue\n${websiteIssueCauseBlock(profile, null)}\n\n6. What you can check first\nCheck the homepage, key service pages, mobile view, contact path, form delivery, sitemap.xml, robots.txt, title tags, meta descriptions, GA4 and Search Console setup.\n\n7. What needs Axon or IT review\nHosting, DNS, SSL, CMS/backend, forms, payment, analytics, Search Console and security need proper access and should not be guessed from outside.\n\n8. Recommended next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`;
    }

    const templates = {
      ai_app: `1. What this likely means\nYou are asking whether it is easy to create an app using AI. The simple answer is: AI tools can help create a prototype quickly, but a proper business app still needs planning, testing and technical setup before real staff or customers use it.\n\n2. What could be causing it or what may be involved\nAI builders can help create screens, forms, dashboards and simple workflows. A real app may still need user login, database structure, admin panel, email notifications, payment gateway, file uploads, hosting, domain, SSL, backups, privacy rules, security checks and ongoing support.\n\n3. What you can check first\nWrite down what the app should do, who will use it, what data it must store, and whether it needs login, payment or approval flow. Start with one main purpose, three to five screens, and the exact fields/actions needed. Do not connect real customer data or payment until the setup is checked properly.\n\n4. DIY, IT person, or Axon help\nDIY is suitable for idea testing or a simple prototype. Ask an IT person if it needs database, login, payment, hosting, API, security or custom domain setup. Engage Axon if you want to publish it properly, connect forms/email/payment, or turn the AI-created app into a stable business tool.\n\n5. Best next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`,
      payment: `1. What this likely means\nYou may be asking about setting up or fixing an online payment gateway. This is the part of a website, app or form that lets customers pay online by card, PayNow, Stripe, payment link or another supported method.\n\n2. What could be causing it or what may be involved\nA payment gateway project can involve payment provider approval, checkout page, payment buttons, form integration, products/services, invoices, receipts, webhook notifications, confirmation emails, test payments, security and refund process. If it is not working, the issue may be API keys, plugin settings, unsupported currency, failed verification, webhook error, SSL issue or checkout configuration.\n\n3. What you can check first\nConfirm whether you need new setup or troubleshooting. If it is new setup, decide what customers are paying for, amount type, receipt requirement and whether payment must connect to a form, booking or invoice. If payment is failing, note the exact error message, affected page, amount, date/time and whether it happens for all customers. Do not change live payment settings without a backup or test mode.\n\n4. DIY, IT person, or Axon help\nDIY is okay for creating a simple payment link inside a payment provider account. Ask an IT person if the website needs checkout integration, webhooks, plugin setup, API keys, confirmation emails, invoices or testing. Ask Axon if payment affects customer orders, bookings, subscriptions, deposits or business operations.\n\n5. Best next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`,
      forms: `1. What this likely means\nYour website form may be submitted by visitors, but the email is not reaching you or the form itself may be failing. This can affect enquiries and should be checked carefully.\n\n2. What could be causing it or what may be involved\nCommon causes include wrong recipient email, website SMTP not configured, spam filtering, SPF/DKIM/DMARC issues, hosting mail limits, plugin errors, captcha errors, form validation problems or email routing changes after a migration.\n\n3. What you can check first\nTest the form using a different email address, check spam/junk, capture the exact page URL and screenshot, and note whether a success message appears. Do not change DNS or mail records unless you know where email is hosted.\n\n4. DIY, IT person, or Axon help\nDIY is fine for checking spam and testing the form. Ask your IT person or Axon if SMTP, DNS, website backend, hosting mail, Google Workspace or Microsoft 365 settings need review.\n\n5. Best next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`,
      website_speed: `1. What this likely means\nYour website may be loading slowly for visitors. This can affect enquiries, trust, mobile users and Google performance.\n\n2. What could be causing it or what may be involved\nCommon causes include large images, heavy scripts, slow hosting, too many plugins, poor caching, old theme code, weak mobile optimization, database issues or third-party tracking scripts.\n\n3. What you can check first\nTest the website on mobile and desktop, note the slow pages, and check whether it is slow for everyone or only from one location/device. Avoid deleting plugins or changing hosting settings without a backup.\n\n4. DIY, IT person, or Axon help\nDIY is fine for compressing images or removing unused content. Ask Axon if the issue involves hosting, WordPress plugins, Core Web Vitals, caching, CDN, server resources or conversion problems.\n\n5. Best next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`,
      email: `1. What this likely means\nYou may have an email delivery, spam, mailbox, Outlook/Gmail or domain email configuration issue.\n\n2. What could be causing it or what may be involved\nPossible causes include wrong DNS/MX records, missing SPF/DKIM/DMARC, mailbox quota, forwarding rules, Outlook configuration, domain reputation, shared hosting mail limits or website forms sending email incorrectly.\n\n3. What you can check first\nCheck whether webmail works, whether only one user is affected, whether emails are in spam, and whether the issue started after DNS, hosting or Microsoft/Google changes.\n\n4. DIY, IT person, or Axon help\nDIY is fine for checking password and spam folder. Ask Axon if DNS, MX, SPF, DKIM, DMARC, migration, Outlook setup or form email delivery needs review.\n\n5. Best next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`,
      general: `1. What this likely means\nYour question needs a clearer look because it may relate to website, hosting, email, cloud, AI, automation, payment, security or business systems.\n\n2. What could be causing it or what may be involved\nThe right solution depends on what you are trying to achieve, what platform you use, whether it affects clients, and whether it needs access to hosting, email, website admin, DNS, payment or business data.\n\n3. What you can check first\nWrite down what you expected, what is happening now, which website/platform/email/system is involved, who is affected, and any screenshots or error messages.\n\n4. DIY, IT person, or Axon help\nDIY is suitable for simple wording, content or basic admin changes. Ask an IT person if it needs hosting, email, DNS, payment, security or backend access. Ask Axon if it affects enquiries, website trust, email delivery, AI readiness, automation or business operations.\n\n5. Best next step\nRelevant Axon pages:\n${links}\n\n${nextStep}`
    };

    return templates[profile.key] || templates.general;
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
      let reply = await askKimi(question, profile);
      if (weak(reply, profile, options)) reply = fallback(question, profile, Boolean(options.websiteReview), options.scan || null);
      lastReply = reply;
      renderAnswer(outputBox, reply);
      showSubmitBox();
    } catch (error) {
      const reply = fallback(question, profile, Boolean(options.websiteReview), options.scan || null);
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

    let profile = detectIntent(`${notes} ${url}`);
    if (!notes && profile.key === 'general') {
      profile = axonIntentProfiles.find((item) => item.key === 'ai_search') || profile;
    }
    renderAnswer(box, 'Checking the website basics first: loading status, likely platform, title, description, sitemap, robots.txt, analytics clues and form clues...');

    let scan = null;
    try {
      scan = await scanWebsite(url);
    } catch (error) {
      console.warn(error);
    }

    const scanSummary = formatScanSummary(scan);
    const prompt = `AI Website Advisory Review for a business owner.

Website URL: ${url}
Client notes: ${notes || 'None'}

BASIC LIVE WEBSITE CHECK RESULTS:
${scanSummary}

Instructions:
First answer the client's optional notes/specific concern directly. Do not only list scan facts. Use the required website advisory structure:
1. What you asked
2. Your specific concern
3. Basic live check found
4. Likely platform / build type
5. What may be causing the issue
6. What you can check first
7. What needs Axon or IT review
8. Recommended next step

Use the live check results carefully. Mention the likely platform/build type if detected, but do not overclaim. Explain that this is a basic single-page check, not a full technical audit. If the concern is speed, discuss response time, page size, images, scripts, CSS, caching, compression, CDN clues, redirects, hosting and mobile performance. If the concern is forms, discuss form delivery and email/DNS/SMTP. If the concern is SEO or AI readiness, discuss title, description, sitemap, robots, schema, Open Graph, service clarity and Search Console. Recommend Axon help when deeper review, hosting, CMS, DNS, form delivery, speed, security or AI-ready content structure is needed.`;

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
    resultBox.textContent = 'No technical knowledge needed. Type your issue in your own words, or choose a common question above. Ask Axon will explain what it likely means, what to check first, and when Axon should assist.';
  }
  hideSubmitBox();
})();
