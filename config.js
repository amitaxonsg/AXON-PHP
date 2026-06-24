window.kimiConfig = {
  // Keep API keys server-side. This PHP endpoint reads MOONSHOT_API_KEY from .env.local.
  backendUrl: '/axon-agent.php'
};

// Contact page: send form through server-side Resend handler.
// API keys must stay in .env.local on the server, never in browser JavaScript.
document.addEventListener('DOMContentLoaded', () => {
  const contactPageForm = document.getElementById('contactPageForm');
  const pageFormFeedback = document.getElementById('pageFormFeedback');

  if (!contactPageForm || !pageFormFeedback) return;

  contactPageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const submitBtn = contactPageForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Request...';
    }

    pageFormFeedback.className = 'form-feedback hidden';
    pageFormFeedback.textContent = '';

    const payload = {
      name: document.getElementById('c_name')?.value.trim() || '',
      email: document.getElementById('c_email')?.value.trim() || '',
      phone: document.getElementById('c_phone')?.value.trim() || '',
      website: document.getElementById('c_website')?.value.trim() || '',
      message: document.getElementById('c_message')?.value.trim() || '',
      source: 'Axon contact page'
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
      pageFormFeedback.textContent = 'Please fill out all required fields.';
      pageFormFeedback.classList.add('error');
      pageFormFeedback.classList.remove('hidden');
      return;
    }

    try {
      const response = await fetch('contact-submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send your request right now.');
      }

      pageFormFeedback.innerHTML = '<strong>Thank you.</strong> Your request has been sent successfully. We will revert back as soon as possible.';
      pageFormFeedback.classList.add('success');
      pageFormFeedback.classList.remove('hidden');
      contactPageForm.reset();
    } catch (error) {
      pageFormFeedback.textContent = error.message || 'Unable to send your request right now. Please use WhatsApp or email support@axon.com.sg.';
      pageFormFeedback.classList.add('error');
      pageFormFeedback.classList.remove('hidden');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  }, true);
});

// Contact page: smarter plain-English AI helper for business owners.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('axonAgentForm');
  const input = document.getElementById('axonAgentInput');
  const messages = document.getElementById('axonAgentMessages');
  const contactMessage = document.getElementById('c_message');
  if (!form || !input || !messages) return;

  const whatsappUrl = 'https://wa.me/639614044560';
  const contactUrl = 'contact.html';
  const isPhilippines = window.location.hostname.includes('philippines');

  const pageLinks = isPhilippines ? {
    businessHelp: 'business-technology-help-philippines.html',
    emailHelp: 'business-email-migration-philippines.html',
    googleTo365: 'google-workspace-to-microsoft-365-migration.html',
    microsoftToGoogle: 'microsoft-365-to-google-workspace-migration.html',
    payment: 'payment-gateway-help-philippines.html',
    websiteSupport: 'website-support-clark-pampanga.html',
    googleVisibility: 'website-not-showing-on-google-philippines.html',
    formEmail: 'website-form-not-sending-email-philippines.html',
    hacked: 'website-hacked-help-philippines.html',
    aiAdvisory: 'ai-advisory-philippines.html',
    remoteSupport: 'remote-it-support-philippines.html',
    itSupport: 'it-support-clark-pampanga.html',
    aiSearch: 'ai-search-visibility.html',
    analytics: 'analytics-search-console.html',
    performance: 'performance-optimization.html',
    coreVitals: 'core-web-vitals-checks.html',
    appDeploy: 'ai-website-app-publishing.html',
    businessApps: 'business-applications.html',
    domain: 'domain-registration-management.html',
    hosting: 'corporate-hosting.html'
  } : {
    businessHelp: 'business-technology-help.html',
    emailHelp: 'business-email-migration-help.html',
    googleTo365: 'google-workspace-to-microsoft-365-migration.html',
    microsoftToGoogle: 'microsoft-365-to-google-workspace-migration.html',
    payment: 'payment-gateway-help.html',
    websiteSupport: 'website-maintenance-support.html',
    googleVisibility: 'website-not-showing-on-google.html',
    formEmail: 'website-form-not-sending-email.html',
    hacked: 'website-hacked-help.html',
    aiAdvisory: 'ai-advisory-for-business-owners.html',
    remoteSupport: 'remote-it-support-worldwide.html',
    itSupport: 'it-support-singapore.html',
    aiSearch: 'ai-search-visibility.html',
    analytics: 'analytics-search-console.html',
    performance: 'performance-optimization.html',
    coreVitals: 'core-web-vitals-checks.html',
    appDeploy: 'ai-website-app-publishing.html',
    businessApps: 'business-applications.html',
    domain: 'domain-registration-management.html',
    hosting: 'corporate-hosting.html'
  };

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim();
  }

  function includesAny(text, words) {
    return words.some((word) => text.includes(word));
  }

  function addMessage(role, text, actions = []) {
    const message = document.createElement('div');
    message.className = `axon-agent-message ${role}`;

    const speaker = document.createElement('strong');
    speaker.textContent = role === 'user' ? 'You' : 'Axon AI Advisor';

    const body = document.createElement('p');
    body.textContent = text;

    message.append(speaker, body);

    if (actions.length) {
      const referenceActions = actions.filter((action) => action.label.toLowerCase().startsWith('read'));
      if (role === 'agent' && referenceActions.length) {
        const referenceTitle = document.createElement('p');
        referenceTitle.className = 'axon-agent-reference-title';
        referenceTitle.textContent = 'Recommended Axon pages to read:';
        message.appendChild(referenceTitle);
      }

      const actionWrap = document.createElement('div');
      actionWrap.className = 'axon-agent-actions';
      actions.forEach((action) => {
        const link = document.createElement('a');
        link.href = action.href;
        link.textContent = action.label;
        link.target = action.external ? '_blank' : '_self';
        link.rel = action.external ? 'noopener' : '';
        link.className = 'axon-agent-action-link';
        actionWrap.appendChild(link);
      });
      message.appendChild(actionWrap);
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function prefillForm(question, topic) {
    if (!contactMessage) return;
    const existing = contactMessage.value.trim();
    if (existing) return;
    contactMessage.value = `I need help with ${topic}.\n\nMy issue / requirement:\n${question}\n\nPlease advise the safest next step.`;
  }

  function topicActions(question) {
    const text = normalize(question);
    const actions = [];

    if (includesAny(text, ['payment gateway', 'payment', 'stripe', 'paynow', 'paypal', 'checkout', 'credit card', 'online payment', 'pay online'])) {
      actions.push({ label: 'Read: Payment Gateway Help', href: pageLinks.payment });
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
    } else if (includesAny(text, ['google to 365', 'google workspace to microsoft', 'gmail to outlook', 'gmail to 365', 'move to 365', 'migrate to 365'])) {
      actions.push({ label: 'Read: Google to Microsoft 365 Migration', href: pageLinks.googleTo365 });
      actions.push({ label: 'Read: Business Email Migration Help', href: pageLinks.emailHelp });
    } else if (includesAny(text, ['365 to google', 'microsoft 365 to google', 'outlook to gmail', 'office 365 to gmail', 'move to google workspace', 'migrate to google'])) {
      actions.push({ label: 'Read: Microsoft 365 to Google Migration', href: pageLinks.microsoftToGoogle });
      actions.push({ label: 'Read: Business Email Migration Help', href: pageLinks.emailHelp });
    } else if (includesAny(text, ['seo', 'sem', 'aeo', 'geo', 'not found on google', 'not showing on google', 'google ranking', 'ai search', 'chatgpt find', 'google ads', 'search console', 'analytics', 'ga4', 'tag manager'])) {
      actions.push({ label: 'Read: Website Not Showing on Google', href: pageLinks.googleVisibility });
      actions.push({ label: 'Read: AI Search Visibility', href: pageLinks.aiSearch });
      actions.push({ label: 'Read: Analytics & Search Console', href: pageLinks.analytics });
    } else if (includesAny(text, ['form not working', 'form', 'email not sending', 'mail not sending', 'smtp', 'contact form', 'enquiry not received', 'not receiving email'])) {
      actions.push({ label: 'Read: Website Form Not Sending Email', href: pageLinks.formEmail });
      actions.push({ label: 'Read: Business Email Migration Help', href: pageLinks.emailHelp });
    } else if (includesAny(text, ['slow', 'speed', 'loading', 'mobile slow', 'page speed', 'core web vitals'])) {
      actions.push({ label: 'Read: Performance Optimization', href: pageLinks.performance });
      actions.push({ label: 'Read: Core Web Vitals', href: pageLinks.coreVitals });
    } else if (includesAny(text, ['hacked', 'malware', 'virus', 'blacklist', 'redirect', 'warning', 'suspicious'])) {
      actions.push({ label: 'Read: Website Hacked Help', href: pageLinks.hacked });
      actions.push({ label: 'Read: Website Support', href: pageLinks.websiteSupport });
    } else if (includesAny(text, ['app', 'application', 'lovable', 'bolt', 'replit', 'portal', 'dashboard', 'saas', 'ai builder'])) {
      actions.push({ label: 'Read: AI Website & App Publishing', href: pageLinks.appDeploy });
      actions.push({ label: 'Read: Business Applications', href: pageLinks.businessApps });
    } else if (includesAny(text, ['domain', 'dns', 'ssl', 'hosting', 'cpanel', 'server', 'website down', 'not loading', 'renewal'])) {
      actions.push({ label: 'Read: Domain Management', href: pageLinks.domain });
      actions.push({ label: 'Read: Corporate Hosting', href: pageLinks.hosting });
    } else if (includesAny(text, ['ai', 'chatgpt', 'chatbot', 'automation', 'assistant'])) {
      actions.push({ label: 'Read: AI Advisory', href: pageLinks.aiAdvisory });
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
    } else {
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
      actions.push({ label: 'Read: Website Support', href: pageLinks.websiteSupport });
    }

    actions.push({ label: 'WhatsApp Axon', href: whatsappUrl, external: true });
    actions.push({ label: 'Submit Contact Form', href: contactUrl, external: false });
    return actions;
  }

  function buildAnswer(question) {
    const text = normalize(question);

    if (includesAny(text, ['payment gateway', 'payment', 'stripe', 'paynow', 'paypal', 'checkout', 'credit card', 'online payment', 'pay online'])) {
      prefillForm(question, 'payment gateway integration');
      return `1. What this likely means\nYou want customers to pay online from your website, form, booking page, invoice, shop or portal. In simple terms, your website must safely collect an order or request, send the customer to a trusted payment provider, then confirm the payment result.\n\n2. What could be involved\nThe right setup depends on your platform. A normal business website may need Stripe, PayPal, PayNow instructions, invoice payment links, WooCommerce, Shopify checkout, a booking payment flow, or a custom payment page. A proper setup also needs SSL, correct currency, email confirmations, admin notifications, success/failure pages, spam protection, privacy wording and testing before going live.\n\n3. What you can check first\nCheck what you want people to pay for: product, deposit, service fee, booking, subscription or invoice. Also check which payment method you want, whether you already have a merchant account, and whether the payment should connect to an invoice, booking, form or online store.\n\n4. DIY or Axon help\nDIY is okay for very simple payment links. Ask Axon to assist if the payment must be connected to your website, forms, customer emails, invoices, booking flow, WooCommerce, Shopify or custom app. Payment setup should be tested carefully because wrong settings can affect customer trust and money collection.\n\n5. Best next step\nSend Axon your website URL, payment provider preference and what customers are paying for. Axon can recommend the simplest safe setup and implement it. The related Axon pages below can help you understand the service before contacting us.`;
    }

    if (includesAny(text, ['google to 365', 'google workspace to microsoft', 'gmail to outlook', 'gmail to 365', 'move to 365', 'migrate to 365'])) {
      prefillForm(question, 'Google Workspace to Microsoft 365 email migration');
      return `1. What this likely means\nYou want to move company email from Gmail or Google Workspace into Microsoft 365 / Outlook. This is usually done when a business wants Outlook, Exchange Online, Teams, OneDrive or Microsoft licensing under one platform.\n\n2. What could be involved\nThe migration may include users, mailboxes, old emails, DNS records, MX records, SPF, DKIM, DMARC, Outlook setup, mobile email setup, shared mailboxes and cutover timing. The important part is avoiding email downtime and making sure old messages are not lost.\n\n3. What you can check first\nPrepare the domain name, number of users, current Google admin access, Microsoft tenant access if already created, and whether you need old email history migrated. Also note whether users are on laptops, Outlook, phones or webmail.\n\n4. DIY or Axon help\nDIY is risky if the company depends on email daily. Axon can plan the cutover, check DNS, migrate mailboxes and support users after the move.\n\n5. Best next step\nSend Axon the domain name and approximate number of mailboxes. Axon can advise the safest migration path. The related Axon pages below explain the migration direction in more detail.`;
    }

    if (includesAny(text, ['365 to google', 'microsoft 365 to google', 'outlook to gmail', 'office 365 to gmail', 'move to google workspace', 'migrate to google'])) {
      prefillForm(question, 'Microsoft 365 to Google Workspace email migration');
      return `1. What this likely means\nYou want to move company email from Microsoft 365 / Outlook into Google Workspace / Gmail. This is common when a business prefers Gmail, Google Drive, Google Calendar and simpler browser-based collaboration.\n\n2. What could be involved\nThe migration may include mailboxes, old emails, calendars, contacts, aliases, groups, DNS records, MX, SPF, DKIM, DMARC, Gmail setup, phone setup and user support after cutover.\n\n3. What you can check first\nConfirm how many users are moving, whether you need historical emails, and whether users currently use Outlook desktop, webmail or mobile phones. Also check who controls the domain DNS.\n\n4. DIY or Axon help\nDIY may be okay for one mailbox, but company migration should be planned. Axon can help reduce downtime, protect mail history and make sure mail flow is correct.\n\n5. Best next step\nSend Axon your domain, number of mailboxes and current email provider access details. The related Axon pages below explain the migration direction in more detail.`;
    }

    if (includesAny(text, ['seo', 'sem', 'aeo', 'geo', 'not found on google', 'not showing on google', 'google ranking', 'ai search', 'chatgpt find', 'google ads', 'search console', 'analytics', 'ga4', 'tag manager'])) {
      prefillForm(question, 'SEO, SEM, GEO and AEO visibility review');
      return `1. What this likely means\nYou want more people to find your business through Google, ads, AI search tools or answer engines. This is not only about keywords. Your website must clearly explain your services, locations, proof, FAQs and next steps.\n\n2. What could be involved\nSEO covers organic Google visibility. SEM covers paid search campaigns. GEO helps AI tools understand and recommend your business. AEO helps your pages answer real questions clearly. The setup may include service pages, page titles, descriptions, schema, FAQ content, sitemap, robots.txt, Search Console, GA4, conversion tracking and landing pages.\n\n3. What you can check first\nSearch your business name, main service and location. Check if the right page appears, whether your title makes sense, and whether your contact button is easy to find. Also confirm Search Console and GA4 are installed correctly.\n\n4. DIY or Axon help\nDIY is okay for updating simple content. Ask Axon to assist if you need a proper audit, service-page strategy, Google tracking, AI-ready content or landing pages for ads.\n\n5. Best next step\nSend Axon the website URL and the search terms you want to target. The related Axon pages below explain the visibility topics.`;
    }

    if (includesAny(text, ['form not working', 'form', 'email not sending', 'mail not sending', 'smtp', 'contact form', 'enquiry not received', 'not receiving email'])) {
      prefillForm(question, 'website form or email delivery issue');
      return `1. What this likely means\nYour website form may be working on the page, but the message may not be reaching your inbox. Sometimes the form submits successfully but email is blocked, sent to spam, or sent from an address your mail provider does not trust.\n\n2. What could be involved\nCommon causes include SMTP not configured, wrong recipient address, plugin settings, Wix or WordPress form notification settings, Google Workspace or Microsoft 365 spam filtering, SPF/DKIM/DMARC issues, or the website host blocking mail.\n\n3. What you can check first\nTest the form once and note the exact time. Check spam/junk. Try a different email address. Note the page URL and whether the form shows a success message. Do not change DNS records unless you are sure.\n\n4. DIY or Axon help\nDIY is okay for checking spam and form recipient settings. Ask Axon to assist if this affects enquiries, because email delivery may need SMTP and DNS checks.\n\n5. Best next step\nSend Axon your website URL, the form page and the email address that should receive enquiries. The related Axon pages below may help.`;
    }

    if (includesAny(text, ['slow', 'speed', 'loading', 'mobile slow', 'page speed', 'core web vitals'])) {
      prefillForm(question, 'website speed and performance issue');
      return `1. What this likely means\nYour website may be slow for visitors, especially on mobile. This can reduce enquiries and affect Google visibility.\n\n2. What could be involved\nCommon causes include large images, heavy scripts, too many plugins, weak hosting, no caching, slow third-party tools, video loading, unoptimized fonts or old code.\n\n3. What you can check first\nOpen the site on mobile data, not only office Wi-Fi. Check which page is slow, whether images appear late, and whether the issue happens on phone, laptop or both.\n\n4. DIY or Axon help\nDIY is okay for reducing very large images. Ask Axon to assist if the issue may involve hosting, code, plugins, cache, Core Web Vitals or business-critical pages.\n\n5. Best next step\nSend Axon the slow page URL and what device you tested on. The related Axon pages below explain performance topics.`;
    }

    if (includesAny(text, ['hacked', 'malware', 'virus', 'blacklist', 'redirect', 'warning', 'suspicious'])) {
      prefillForm(question, 'website security or malware issue');
      return `1. What this likely means\nYour website may have a security issue, malware infection, suspicious redirect, browser warning or blacklist problem. This should be treated carefully because it can affect visitors, search visibility and email trust.\n\n2. What could be involved\nThe issue may come from outdated WordPress plugins, weak passwords, infected files, hidden admin users, unsafe themes, bad redirects, compromised hosting or missing security updates.\n\n3. What you can check first\nTake screenshots of the warning and note the affected URL. Avoid deleting random files unless there is a backup. If the site is actively redirecting visitors, treat it as urgent.\n\n4. DIY or Axon help\nThis is usually not a DIY task. Axon should review the site, clean infected files, check backups, update software and harden the site after recovery.\n\n5. Best next step\nUse the WhatsApp Axon button below for urgent help and send the website URL plus screenshots. The related Axon pages below explain recovery topics.`;
    }

    if (includesAny(text, ['app', 'application', 'lovable', 'bolt', 'replit', 'portal', 'dashboard', 'saas', 'ai builder'])) {
      prefillForm(question, 'AI app or business application planning');
      return `1. What this likely means\nYou want to build an app, portal, dashboard or system, possibly using AI tools. AI can create a prototype quickly, but a proper business app still needs planning and safe deployment.\n\n2. What could be involved\nA real app may need login, database, forms, file upload, admin panel, payment gateway, email notifications, user permissions, hosting, domain, SSL, backups, privacy rules, testing and support.\n\n3. What you can check first\nWrite down who will use the app, what data it stores, what screens are needed and what action happens after submission. Keep the first version small.\n\n4. DIY or Axon help\nDIY is okay for testing an idea. Ask Axon to help if you need to publish it properly, connect payment/email, protect data, or turn it into a stable business tool.\n\n5. Best next step\nSend Axon the app idea and the top three features you need first. The related Axon pages below explain app and publishing support.`;
    }

    if (includesAny(text, ['domain', 'dns', 'ssl', 'hosting', 'cpanel', 'server', 'website down', 'not loading', 'renewal'])) {
      prefillForm(question, 'domain, hosting or website availability issue');
      return `1. What this likely means\nThis may be related to your domain, hosting, SSL certificate, DNS, server, renewal or website availability. These areas are connected, so one wrong setting can affect the website or email.\n\n2. What could be involved\nPossible causes include expired domain, hosting suspension, DNS change, SSL issue, server error, wrong nameservers, cache, website files, database error or renewal problem.\n\n3. What you can check first\nCheck whether the domain is expired, whether only your office cannot access it, and whether email is also affected. Prepare any error screenshot.\n\n4. DIY or Axon help\nAvoid changing DNS or server settings if business email is active. Ask Axon to check the safest path.\n\n5. Best next step\nSend Axon the domain name, screenshot and whether email is also affected. The related Axon pages below explain domain and hosting areas.`;
    }

    return `1. What this likely means\nThis sounds like a website, email, hosting, AI, automation or business technology matter that needs a clearer look before choosing the right solution.\n\n2. What could be involved\nIt may involve your website platform, hosting, domain, email, forms, payment, SEO, analytics, AI chatbot, automation, security or business workflow.\n\n3. What you can check first\nPrepare the website URL, what you expected to happen, what actually happened, screenshots and whether the issue affects customers, staff or only you.\n\n4. DIY or Axon help\nSimple content changes may be DIY. Ask Axon to assist if the issue affects enquiries, payment, email, security, Google visibility, AI readiness or business operations.\n\n5. Best next step\nSubmit the form on this page or use the WhatsApp Axon button below for faster support. Axon can review and recommend the practical next step in plain English. The related Axon pages below are recommended starting points.`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const question = input.value.trim();
    if (!question) return;

    addMessage('user', question);
    addMessage('agent', buildAnswer(question), topicActions(question));

    input.value = '';
  }, true);
});
