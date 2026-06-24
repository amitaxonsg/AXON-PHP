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
    emailSolutions: 'business-email-solutions.html',
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
    emailSolutions: 'business-email-solutions.html',
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

  function hasEmailSetupIntent(text) {
    return includesAny(text, ['imap', 'pop3', 'pop ', 'smtp', 'mail server', 'incoming mail', 'outgoing mail', 'mail client', 'email client', 'outlook setup', 'gmail setup', 'thunderbird', 'email setup', 'email configuration', 'email config', 'mail settings', 'mx record', 'spf', 'dkim', 'dmarc', 'business email', 'email not working']);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function replyAlreadyHasReferences(value) {
    return /Recommended Axon pages to read:?|\[Read:|\[WhatsApp Axon\]|\[Submit Contact Form\]/i.test(String(value || ''));
  }

  function formatText(value) {
    let html = escapeHtml(value);
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
    return html.replace(/\n/g, '<br>');
  }

  function addMessage(role, text, actions = []) {
    const message = document.createElement('div');
    message.className = `axon-agent-message ${role}`;

    const speaker = document.createElement('strong');
    speaker.textContent = role === 'user' ? 'You' : 'Axon AI Advisor';

    const body = document.createElement('p');
    body.innerHTML = formatText(text);
    message.append(speaker, body);

    if (actions.length && role === 'agent' && !replyAlreadyHasReferences(text)) {
      const referenceActions = actions.filter((action) => action.label.toLowerCase().startsWith('read'));
      const contactActions = actions.filter((action) => !action.label.toLowerCase().startsWith('read'));

      if (referenceActions.length) {
        const referenceTitle = document.createElement('p');
        referenceTitle.className = 'axon-agent-reference-title';
        referenceTitle.textContent = 'Recommended Axon pages to read:';
        referenceTitle.style.marginTop = '14px';
        referenceTitle.style.marginBottom = '6px';
        message.appendChild(referenceTitle);

        const referenceWrap = document.createElement('div');
        referenceWrap.className = 'axon-agent-reference-links';
        referenceActions.forEach((action) => {
          const link = document.createElement('a');
          link.href = action.href;
          link.textContent = action.label;
          link.target = action.external ? '_blank' : '_self';
          link.rel = action.external ? 'noopener' : '';
          link.className = 'axon-agent-reference-link';
          link.style.display = 'block';
          link.style.fontWeight = '700';
          link.style.textDecoration = 'underline';
          link.style.margin = '5px 0';
          referenceWrap.appendChild(link);
        });
        message.appendChild(referenceWrap);
      }

      if (contactActions.length) {
        const actionWrap = document.createElement('div');
        actionWrap.className = 'axon-agent-actions';
        actionWrap.style.marginTop = '10px';
        contactActions.forEach((action) => {
          const link = document.createElement('a');
          link.href = action.href;
          link.textContent = action.label;
          link.target = action.external ? '_blank' : '_self';
          link.rel = action.external ? 'noopener' : '';
          link.className = 'axon-agent-action-link';
          link.style.display = 'inline-block';
          link.style.marginRight = '14px';
          actionWrap.appendChild(link);
        });
        message.appendChild(actionWrap);
      }
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
    } else if (hasEmailSetupIntent(text)) {
      actions.push({ label: 'Read: Business Email Solutions', href: pageLinks.emailSolutions });
      actions.push({ label: 'Read: Business Email Migration Help', href: pageLinks.emailHelp });
      actions.push({ label: 'Read: Domain Management', href: pageLinks.domain });
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
    } else if (includesAny(text, ['form not working', 'form', 'email not sending', 'mail not sending', 'contact form', 'enquiry not received', 'not receiving email'])) {
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
      return `1. What this likely means\nCRM means a simple system to manage enquiries, customers, follow-ups and sales opportunities. For many SMEs, the real issue is not only software. It is making sure website forms, WhatsApp enquiries, email enquiries and staff follow-ups do not get missed.\n\n2. What could be involved\nA CRM setup may include enquiry forms, customer records, lead stages, reminders, quotation follow-up, WhatsApp or email handover, staff access, simple dashboards and reports. It can be a ready-made CRM, a lightweight lead tracker, or a custom workflow depending on the business size.\n\n3. What you can check first\nCheck where leads come from today: website, WhatsApp, Facebook, phone calls, referrals, email or walk-ins. Also check who follows up, how leads are recorded, and where leads get lost.\n\n4. DIY or Axon help\nDIY is okay if you only need a spreadsheet or very basic tracker. Ask Axon to help if leads come from multiple channels, staff need shared access, reminders are needed, or you want forms, WhatsApp, email and CRM to work together.\n\n5. Best next step\nSend Axon your website URL, current enquiry sources and how your team follows up today. Axon can recommend a simple CRM or lead-management setup before you spend money on the wrong platform.`;
    }

    if (hasEmailSetupIntent(text)) {
      prefillForm(question, 'business email setup or IMAP/SMTP support');
      return `1. What this likely means\nIMAP, POP3 and SMTP are email settings used by Outlook, Gmail app, Apple Mail, Thunderbird and mobile phones to connect to a business mailbox. IMAP usually receives and syncs mail, while SMTP sends mail.\n\n2. What could be involved\nThe issue may involve incoming server, outgoing server, username, password, ports, SSL/TLS, DNS records, mailbox quota, cPanel email, Google Workspace, Microsoft 365, SPF, DKIM or DMARC. A wrong setting can stop sending, receiving or syncing email.\n\n3. What you can check first\nConfirm the email address, email provider, device/app used, error message, incoming server, outgoing server, port numbers and whether webmail works. Do not keep retrying many wrong passwords because the account or IP may get blocked.\n\n4. DIY or Axon help\nDIY is okay if you have the correct settings from your provider. Ask Axon to assist if email affects staff, customers, forms, invoices, domain DNS, migration, Google Workspace, Microsoft 365 or cPanel hosting.\n\n5. Best next step\nSend Axon the email domain, device/app used and screenshot of the error. Axon can check whether this is a settings issue, DNS issue, mailbox issue or migration problem.`;
    }

    if (includesAny(text, ['payment gateway', 'payment', 'stripe', 'paynow', 'paypal', 'checkout', 'credit card', 'online payment', 'pay online', 'gcash'])) {
      prefillForm(question, 'payment gateway integration');
      return `1. What this likely means\nYou want customers to pay online from your website, form, booking page, invoice, shop or portal.\n\n2. What could be involved\nThe right setup depends on your platform. It may involve Stripe, PayPal, PayNow, GCash, WooCommerce, Shopify, booking payments, invoice links, SSL, success pages, failed payment handling and email confirmations.\n\n3. What you can check first\nCheck what people are paying for, what country/currency you need, which payment provider you prefer and whether payment must connect to a form, invoice, booking or online store.\n\n4. DIY or Axon help\nDIY is okay for very simple payment links. Ask Axon to assist when payment is connected to your website, customer emails, forms, invoices, booking flow, WooCommerce, Shopify or custom app.\n\n5. Best next step\nSend Axon your website URL, payment provider preference and what customers are paying for.`;
    }

    if (includesAny(text, ['google to 365', 'google workspace to microsoft', 'gmail to outlook', 'gmail to 365', 'move to 365', 'migrate to 365'])) {
      prefillForm(question, 'Google Workspace to Microsoft 365 email migration');
      return `1. What this likely means\nYou want to move company email from Gmail or Google Workspace into Microsoft 365 / Outlook.\n\n2. What could be involved\nThe migration may include users, mailboxes, old emails, DNS records, MX, SPF, DKIM, DMARC, Outlook setup, mobile setup, shared mailboxes and cutover timing. The main goal is to avoid downtime and lost mail.\n\n3. What you can check first\nPrepare the domain name, number of users, current Google admin access and whether old email history must be migrated.\n\n4. DIY or Axon help\nDIY is risky if the company depends on email daily. Axon can plan the cutover, check DNS, migrate mailboxes and support users after the move.\n\n5. Best next step\nSend Axon the domain and approximate number of mailboxes.`;
    }

    if (includesAny(text, ['365 to google', 'microsoft 365 to google', 'outlook to gmail', 'office 365 to gmail', 'move to google workspace', 'migrate to google'])) {
      prefillForm(question, 'Microsoft 365 to Google Workspace email migration');
      return `1. What this likely means\nYou want to move company email from Microsoft 365 / Outlook into Google Workspace / Gmail.\n\n2. What could be involved\nThis may include mailboxes, old emails, calendars, contacts, aliases, groups, DNS records, Gmail setup, phone setup and user support after cutover.\n\n3. What you can check first\nConfirm how many users are moving, whether you need old mail, and who controls the domain DNS.\n\n4. DIY or Axon help\nDIY may be okay for one mailbox. Company migration should be planned to reduce downtime and protect mail history.\n\n5. Best next step\nSend Axon your domain, number of mailboxes and current email provider details.`;
    }

    return null;
  }

  async function askKimiFallback(question) {
    const endpoint = window.kimiConfig?.backendUrl || '/axon-agent.php';
    const systemPrompt = `You are Axon AI Advisor for Axon 1ProIT. Reply in plain English for a non-IT business owner. Do not be too brief. Use five numbered sections: 1. What this likely means, 2. What could be involved, 3. What you can check first, 4. DIY or Axon help, 5. Best next step. Recommend Axon when the issue involves website, hosting, email, cloud, Microsoft 365, Google Workspace, CRM, payment gateway, AI, automation, SEO, security, app, portal or business technology. Do not invent prices. Ask for useful details such as website URL, platform, screenshots, email domain, number of users or current workflow.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'contact_ai_fallback',
        question,
        message: question,
        prompt: question,
        systemPrompt
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'AI fallback unavailable');
    const answer = data.answer || data.reply || data.text || data.content || data.message;
    if (!answer || typeof answer !== 'string') throw new Error('AI fallback returned no answer');
    return answer.trim();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
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

    const loadingMessage = addMessage('agent', 'Axon AI is reviewing your question and preparing a plain-English answer...');
    try {
      const aiAnswer = await askKimiFallback(question);
      loadingMessage.remove();
      prefillForm(question, 'business technology question');
      addMessage('agent', aiAnswer, replyAlreadyHasReferences(aiAnswer) ? [] : actions);
    } catch (error) {
      loadingMessage.remove();
      addMessage('agent', genericFallbackAnswer(question), actions);
    }
  });
});