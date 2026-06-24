window.kimiConfig = {
  // Keep API keys server-side. This PHP endpoint reads MOONSHOT_API_KEY from .env.local.
  backendUrl: '/axon-agent.php'
};

// Contact page: send form through server-side Resend handler.
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
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to send your request right now.');
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

// Contact page: plain-English AI helper for non-IT business owners.
// Flow: known Axon template first; if no template matches, ask server-side Kimi AI; if AI is unavailable, use safe fallback.
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
    crm: 'crm-lead-management.html',
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
    crm: 'crm-lead-management.html',
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

  function hasCrmIntent(text) {
    return includesAny(text, ['crm', 'lead management', 'lead tracking', 'sales pipeline', 'customer database', 'customer relationship', 'follow up', 'followup', 'leads', 'manage leads', 'whatsapp crm', 'client management', 'customer management', 'enquiry management']);
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

    if (hasCrmIntent(text)) {
      actions.push({ label: 'Read: CRM & Lead Management', href: pageLinks.crm });
      actions.push({ label: 'Read: Business Applications', href: pageLinks.businessApps });
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
    } else if (includesAny(text, ['payment gateway', 'payment', 'stripe', 'paynow', 'paypal', 'checkout', 'credit card', 'online payment', 'pay online', 'gcash'])) {
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

  function genericFallbackAnswer(question) {
    prefillForm(question, 'business technology question');
    return `1. What this likely means\nThis may be a website, email, hosting, AI, automation, security, payment, CRM, cloud, analytics or business technology matter. The exact solution depends on what you are trying to achieve and what system you use today.\n\n2. What could be involved\nIt may involve your website platform, domain, hosting, email, forms, payment flow, customer enquiries, staff workflow, search visibility, AI chatbot, automation or data/security setup.\n\n3. What you can check first\nPrepare your website URL, the tool or platform involved, what you expected to happen, what actually happened, screenshots and whether customers or staff are affected.\n\n4. DIY or Axon help\nDIY is okay for very simple checks. Ask Axon to assist if the matter affects enquiries, email, payment, security, search visibility, automation, customer data or business operations.\n\n5. Best next step\nSubmit the form on this page or use the WhatsApp Axon button below. Axon can review the situation and suggest the safest practical next step.`;
  }

  function buildTemplateAnswer(question) {
    const text = normalize(question);

    if (hasCrmIntent(text)) {
      prefillForm(question, 'CRM and lead management setup');
      return `1. What this likely means\nCRM means a simple system to manage enquiries, customers, follow-ups and sales opportunities. For many SMEs, the real issue is not only software. It is making sure website forms, WhatsApp enquiries, email enquiries and staff follow-ups do not get missed.\n\n2. What could be involved\nA CRM setup may include enquiry forms, customer records, lead stages, reminders, quotation follow-up, WhatsApp or email handover, staff access, simple dashboards and reports. It can be a ready-made CRM, a lightweight lead tracker, or a custom workflow depending on the business size.\n\n3. What you can check first\nCheck where leads come from today: website, WhatsApp, Facebook, phone calls, referrals, email or walk-ins. Also check who follows up, how leads are recorded, and where leads get lost.\n\n4. DIY or Axon help\nDIY is okay if you only need a spreadsheet or very basic tracker. Ask Axon to help if leads come from multiple channels, staff need shared access, reminders are needed, or you want forms, WhatsApp, email and CRM to work together.\n\n5. Best next step\nSend Axon your website URL, current enquiry sources and how your team follows up today. Axon can recommend a simple CRM or lead-management setup before you spend money on the wrong platform. The related Axon pages below explain the options.`;
    }

    if (includesAny(text, ['payment gateway', 'payment', 'stripe', 'paynow', 'paypal', 'checkout', 'credit card', 'online payment', 'pay online', 'gcash'])) {
      prefillForm(question, 'payment gateway integration');
      return `1. What this likely means\nYou want customers to pay online from your website, form, booking page, invoice, shop or portal.\n\n2. What could be involved\nThe right setup depends on your platform. It may involve Stripe, PayPal, PayNow, GCash, WooCommerce, Shopify, booking payments, invoice links, SSL, success pages, failed payment handling and email confirmations.\n\n3. What you can check first\nCheck what people are paying for, what country/currency you need, which payment provider you prefer and whether payment must connect to a form, invoice, booking or online store.\n\n4. DIY or Axon help\nDIY is okay for very simple payment links. Ask Axon to assist when payment is connected to your website, customer emails, forms, invoices, booking flow, WooCommerce, Shopify or custom app.\n\n5. Best next step\nSend Axon your website URL, payment provider preference and what customers are paying for. The related Axon pages below can help you understand the service before contacting us.`;
    }

    if (includesAny(text, ['google to 365', 'google workspace to microsoft', 'gmail to outlook', 'gmail to 365', 'move to 365', 'migrate to 365'])) {
      prefillForm(question, 'Google Workspace to Microsoft 365 email migration');
      return `1. What this likely means\nYou want to move company email from Gmail or Google Workspace into Microsoft 365 / Outlook.\n\n2. What could be involved\nThe migration may include users, mailboxes, old emails, DNS records, MX, SPF, DKIM, DMARC, Outlook setup, mobile setup, shared mailboxes and cutover timing. The main goal is to avoid downtime and lost mail.\n\n3. What you can check first\nPrepare the domain name, number of users, current Google admin access and whether old email history must be migrated.\n\n4. DIY or Axon help\nDIY is risky if the company depends on email daily. Axon can plan the cutover, check DNS, migrate mailboxes and support users after the move.\n\n5. Best next step\nSend Axon the domain and approximate number of mailboxes. The related Axon pages below explain the migration direction.`;
    }

    if (includesAny(text, ['365 to google', 'microsoft 365 to google', 'outlook to gmail', 'office 365 to gmail', 'move to google workspace', 'migrate to google'])) {
      prefillForm(question, 'Microsoft 365 to Google Workspace email migration');
      return `1. What this likely means\nYou want to move company email from Microsoft 365 / Outlook into Google Workspace / Gmail.\n\n2. What could be involved\nThis may include mailboxes, old emails, calendars, contacts, aliases, groups, DNS records, Gmail setup, phone setup and user support after cutover.\n\n3. What you can check first\nConfirm how many users are moving, whether you need old mail, and who controls the domain DNS.\n\n4. DIY or Axon help\nDIY may be okay for one mailbox. Company migration should be planned to reduce downtime and protect mail history.\n\n5. Best next step\nSend Axon your domain, number of mailboxes and current email provider details. The related Axon pages below explain the migration direction.`;
    }

    if (includesAny(text, ['seo', 'sem', 'aeo', 'geo', 'not found on google', 'not showing on google', 'google ranking', 'ai search', 'chatgpt find', 'google ads', 'search console', 'analytics', 'ga4', 'tag manager'])) {
      prefillForm(question, 'SEO, SEM, GEO and AEO visibility review');
      return `1. What this likely means\nYou want more people to find your business through Google, Google Ads, AI search tools or answer engines.\n\n2. What could be involved\nSEO covers organic Google visibility. SEM covers ads. GEO helps AI tools understand your business. AEO helps your pages answer real questions clearly. Setup may include service pages, schema, FAQs, sitemap, robots.txt, Search Console, GA4 and conversion tracking.\n\n3. What you can check first\nSearch your business name, main service and location. Check if the right page appears and whether your contact button is easy to find.\n\n4. DIY or Axon help\nDIY is okay for simple content edits. Ask Axon for a proper audit, tracking setup, service-page strategy and AI-ready content.\n\n5. Best next step\nSend Axon the website URL and target search terms. The related Axon pages below explain visibility topics.`;
    }

    if (includesAny(text, ['form not working', 'form', 'email not sending', 'mail not sending', 'smtp', 'contact form', 'enquiry not received', 'not receiving email'])) {
      prefillForm(question, 'website form or email delivery issue');
      return `1. What this likely means\nYour website form may submit, but the message may not reach your inbox.\n\n2. What could be involved\nCommon causes include SMTP settings, wrong recipient email, plugin settings, spam filtering, SPF/DKIM/DMARC or website hosting mail restrictions.\n\n3. What you can check first\nTest once, note the exact time, check spam/junk and record the page URL.\n\n4. DIY or Axon help\nDIY is okay for checking spam and recipient settings. Ask Axon if enquiries are important, because this may require SMTP and DNS checks.\n\n5. Best next step\nSend Axon your website URL, form page and receiving email address. The related Axon pages below may help.`;
    }

    if (includesAny(text, ['slow', 'speed', 'loading', 'mobile slow', 'page speed', 'core web vitals'])) {
      prefillForm(question, 'website speed and performance issue');
      return `1. What this likely means\nYour website may be slow for visitors, especially on mobile.\n\n2. What could be involved\nCommon causes include large images, heavy scripts, plugins, hosting, cache, third-party tools, videos, fonts or old code.\n\n3. What you can check first\nOpen the page on mobile data and note which page is slow.\n\n4. DIY or Axon help\nDIY is okay for reducing large images. Ask Axon if hosting, code, plugins, cache or Core Web Vitals are involved.\n\n5. Best next step\nSend Axon the slow page URL and device used. The related Axon pages below explain performance topics.`;
    }

    if (includesAny(text, ['hacked', 'malware', 'virus', 'blacklist', 'redirect', 'warning', 'suspicious'])) {
      prefillForm(question, 'website security or malware issue');
      return `1. What this likely means\nYour website may have a security issue, malware infection, suspicious redirect, browser warning or blacklist problem.\n\n2. What could be involved\nThis may involve outdated plugins, weak passwords, infected files, hidden users, unsafe themes, redirects or compromised hosting.\n\n3. What you can check first\nTake screenshots of the warning and affected URL. Avoid deleting random files unless there is a backup.\n\n4. DIY or Axon help\nThis is usually not a DIY task. Axon should review, clean, update and harden the site after recovery.\n\n5. Best next step\nUse the WhatsApp Axon button below for urgent help. The related Axon pages below explain recovery topics.`;
    }

    if (includesAny(text, ['app', 'application', 'lovable', 'bolt', 'replit', 'portal', 'dashboard', 'saas', 'ai builder'])) {
      prefillForm(question, 'AI app or business application planning');
      return `1. What this likely means\nYou want to build an app, portal, dashboard or system, possibly using AI tools.\n\n2. What could be involved\nA real app may need login, database, forms, file upload, admin panel, payment gateway, email notifications, user permissions, hosting, SSL, backups and testing.\n\n3. What you can check first\nWrite down who will use it, what data it stores and the top three features needed first.\n\n4. DIY or Axon help\nDIY is okay for testing an idea. Ask Axon if you need to publish it properly, connect payment/email, protect data or turn it into a stable business tool.\n\n5. Best next step\nSend Axon the app idea and the top three features. The related Axon pages below explain app and publishing support.`;
    }

    if (includesAny(text, ['domain', 'dns', 'ssl', 'hosting', 'cpanel', 'server', 'website down', 'not loading', 'renewal'])) {
      prefillForm(question, 'domain, hosting or website availability issue');
      return `1. What this likely means\nThis may be related to your domain, hosting, SSL, DNS, server, renewal or website availability.\n\n2. What could be involved\nPossible causes include expired domain, hosting suspension, DNS change, SSL issue, server error, nameservers, cache, website files or database errors.\n\n3. What you can check first\nCheck whether the domain expired, whether email is also affected and prepare any screenshot.\n\n4. DIY or Axon help\nAvoid changing DNS or server settings if business email is active. Ask Axon to check the safest path.\n\n5. Best next step\nSend Axon the domain name, screenshot and whether email is also affected. The related Axon pages below explain domain and hosting areas.`;
    }

    if (includesAny(text, ['ai', 'chatgpt', 'chatbot', 'automation', 'assistant'])) {
      prefillForm(question, 'AI advisory or automation help');
      return `1. What this likely means\nYou want to use AI, a chatbot, automation or an assistant to reduce manual work or answer customers better.\n\n2. What could be involved\nThis may include website chatbot, internal AI assistant, content support, workflow automation, company knowledge, privacy rules and staff usage guidelines.\n\n3. What you can check first\nList the repetitive questions or tasks you want AI to handle.\n\n4. DIY or Axon help\nDIY is okay for trying ChatGPT. Ask Axon if AI must connect to your business process, website, documents, team workflow or customer enquiries.\n\n5. Best next step\nSend Axon the task you want to automate. The related Axon pages below explain AI advisory and business help.`;
    }

    return null;
  }

  async function askAxonAiFallback(question) {
    const backendUrl = window.kimiConfig?.backendUrl || '/axon-agent.php';
    const marketContext = isPhilippines
      ? 'Philippines, Clark, Pampanga, Angeles City, Baguio and remote support clients'
      : 'Singapore business owners and remote support clients';

    const systemPrompt = `You are Axon AI Advisor for ${marketContext}. The visitor may type any short business or technology phrase that does not match a fixed template. Answer in plain English for non-IT business owners. Use exactly these five numbered sections: 1. What this likely means 2. What could be involved 3. What you can check first 4. DIY or Axon help 5. Best next step. Keep the tone helpful, practical and business-focused. Relate the answer to Axon services where relevant: websites, hosting, domains, DNS, email, Google Workspace, Microsoft 365, CRM, payment gateway, forms, SEO, SEM, GEO, AEO, AI search, AI chatbot, automation, app publishing, security, backup, cloud, analytics and business technology advisory. Do not claim a full audit was done. Do not include markdown links because the website displays recommended page buttons separately. Do not provide instructions for hacking, bypassing security, malware creation or unsafe actions. If the question is outside Axon's scope, say so politely and suggest what information the visitor should send to Axon for practical advice. Always end by recommending the visitor submit the contact form or use WhatsApp Axon if they want help.`;

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mode: 'contact_ai_fallback',
          systemPrompt
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.reply) throw new Error(data.message || 'AI fallback unavailable.');
      return String(data.reply).trim();
    } catch (error) {
      console.warn('Axon AI fallback unavailable:', error);
      return genericFallbackAnswer(question);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const question = input.value.trim();
    if (!question) return;

    addMessage('user', question);
    input.value = '';

    const actions = topicActions(question);
    const templateAnswer = buildTemplateAnswer(question);

    if (templateAnswer) {
      addMessage('agent', templateAnswer, actions);
      return;
    }

    prefillForm(question, 'business technology question');
    const thinkingMessage = addMessage('agent', 'Axon AI is reviewing your question and preparing a plain-English answer...');
    const aiAnswer = await askAxonAiFallback(question);
    thinkingMessage.remove();
    addMessage('agent', aiAnswer || genericFallbackAnswer(question), actions);
  }, true);
});
