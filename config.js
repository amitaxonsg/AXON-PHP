window.kimiConfig = { backendUrl: '/axon-agent.php' };

document.addEventListener('DOMContentLoaded', () => {
  const contactPageForm = document.getElementById('contactPageForm');
  const pageFormFeedback = document.getElementById('pageFormFeedback');
  if (!contactPageForm || !pageFormFeedback) return;

  contactPageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const submitBtn = contactPageForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending Request...'; }
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
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      pageFormFeedback.textContent = 'Please fill out all required fields.';
      pageFormFeedback.classList.add('error');
      pageFormFeedback.classList.remove('hidden');
      return;
    }
    try {
      const response = await fetch('contact-submit.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
    }
  }, true);
});

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
    crm: 'crm-lead-management.html',
    businessApps: 'business-applications.html'
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
    crm: 'crm-lead-management.html',
    businessApps: 'business-applications.html'
  };

  const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim();
  const includesAny = (text, words) => words.some((word) => text.includes(word));
  const isCrm = (text) => includesAny(text, ['crm', 'lead management', 'lead tracking', 'sales pipeline', 'customer database', 'customer relationship', 'follow up', 'followup', 'leads', 'manage leads', 'client management', 'customer management', 'enquiry management']);

  function addMessage(role, text, actions = []) {
    const message = document.createElement('div');
    message.className = `axon-agent-message ${role}`;
    const speaker = document.createElement('strong');
    speaker.textContent = role === 'user' ? 'You' : 'Axon AI Advisor';
    const body = document.createElement('p');
    body.textContent = text;
    message.append(speaker, body);
    if (actions.length) {
      const readActions = actions.filter((action) => action.label.toLowerCase().startsWith('read'));
      if (role === 'agent' && readActions.length) {
        const title = document.createElement('p');
        title.className = 'axon-agent-reference-title';
        title.textContent = 'Recommended Axon pages to read:';
        message.appendChild(title);
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
  }

  function prefillForm(question, topic) {
    if (!contactMessage || contactMessage.value.trim()) return;
    contactMessage.value = `I need help with ${topic}.\n\nMy issue / requirement:\n${question}\n\nPlease advise the safest next step.`;
  }

  function addCommonActions(actions) {
    actions.push({ label: 'WhatsApp Axon', href: whatsappUrl, external: true });
    actions.push({ label: 'Submit Contact Form', href: contactUrl, external: false });
    return actions;
  }

  function topicActions(question) {
    const text = normalize(question);
    const actions = [];
    if (isCrm(text)) {
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
    } else if (includesAny(text, ['seo', 'sem', 'aeo', 'geo', 'not found on google', 'not showing on google', 'google ranking', 'ai search', 'search console', 'analytics', 'ga4'])) {
      actions.push({ label: 'Read: Website Not Showing on Google', href: pageLinks.googleVisibility });
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
    } else if (includesAny(text, ['form not working', 'form', 'email not sending', 'smtp', 'contact form', 'enquiry not received'])) {
      actions.push({ label: 'Read: Website Form Not Sending Email', href: pageLinks.formEmail });
      actions.push({ label: 'Read: Business Email Migration Help', href: pageLinks.emailHelp });
    } else if (includesAny(text, ['ai', 'chatgpt', 'chatbot', 'automation', 'assistant'])) {
      actions.push({ label: 'Read: AI Advisory', href: pageLinks.aiAdvisory });
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
    } else {
      actions.push({ label: 'Read: Business Technology Help', href: pageLinks.businessHelp });
      actions.push({ label: 'Read: Website Support', href: pageLinks.websiteSupport });
    }
    return addCommonActions(actions);
  }

  function answer(title, meaning, involved, check, axon, next) {
    return `1. What this likely means\n${meaning}\n\n2. What could be involved\n${involved}\n\n3. What you can check first\n${check}\n\n4. DIY or Axon help\n${axon}\n\n5. Best next step\n${next}`;
  }

  function buildAnswer(question) {
    const text = normalize(question);
    if (isCrm(text)) {
      prefillForm(question, 'CRM and lead management setup');
      return answer('CRM', 'CRM means a system to manage enquiries, customers, follow-ups and sales opportunities. For many SMEs, the real issue is making sure enquiries and staff follow-ups do not get missed.', 'A CRM setup may include enquiry forms, customer records, lead stages, reminders, quotation follow-up, email handover, staff access, dashboards and reports. It can be a ready-made CRM, a lightweight lead tracker, or a custom workflow depending on business size.', 'Check where leads come from today: website, Facebook, phone calls, referrals, email or walk-ins. Also check who follows up, how leads are recorded, and where leads get lost.', 'DIY is okay if you only need a spreadsheet or very basic tracker. Ask Axon to help if leads come from multiple channels, staff need shared access, reminders are needed, or you want forms, email and CRM to work together.', 'Send Axon your website URL, current enquiry sources and how your team follows up today. Axon can recommend a simple CRM or lead-management setup before you spend money on the wrong platform.');
    }
    if (includesAny(text, ['payment gateway', 'payment', 'stripe', 'paynow', 'paypal', 'checkout', 'credit card', 'online payment', 'pay online', 'gcash'])) {
      prefillForm(question, 'payment gateway integration');
      return answer('Payment', 'You want customers to pay online from your website, form, booking page, invoice, shop or portal.', 'The right setup depends on your platform, country, currency and payment provider. It may involve Stripe, PayPal, PayNow, GCash, WooCommerce, Shopify, booking payments, invoice links, SSL and email confirmations.', 'Check what people are paying for, what payment method you prefer and whether payment must connect to a form, invoice, booking or online store.', 'DIY is okay for very simple payment links. Ask Axon to assist when payment is connected to your website, customer emails, forms, invoices, booking flow, WooCommerce, Shopify or custom app.', 'Send Axon your website URL, payment provider preference and what customers are paying for.');
    }
    if (includesAny(text, ['google to 365', 'google workspace to microsoft', 'gmail to outlook', 'gmail to 365', 'move to 365', 'migrate to 365'])) {
      prefillForm(question, 'Google Workspace to Microsoft 365 email migration');
      return answer('Migration', 'You want to move company email from Gmail or Google Workspace into Microsoft 365 / Outlook.', 'The migration may include users, mailboxes, old emails, DNS records, MX, SPF, DKIM, DMARC, Outlook setup, mobile setup, shared mailboxes and cutover timing.', 'Prepare the domain name, number of users, current Google admin access and whether old email history must be migrated.', 'DIY is risky if the company depends on email daily. Axon can plan the cutover, check DNS, migrate mailboxes and support users after the move.', 'Send Axon the domain and approximate number of mailboxes.');
    }
    if (includesAny(text, ['365 to google', 'microsoft 365 to google', 'outlook to gmail', 'office 365 to gmail', 'move to google workspace', 'migrate to google'])) {
      prefillForm(question, 'Microsoft 365 to Google Workspace email migration');
      return answer('Migration', 'You want to move company email from Microsoft 365 / Outlook into Google Workspace / Gmail.', 'This may include mailboxes, old emails, calendars, contacts, aliases, groups, DNS records, Gmail setup, phone setup and user support after cutover.', 'Confirm how many users are moving, whether you need old mail, and who controls the domain DNS.', 'DIY may be okay for one mailbox. Company migration should be planned to reduce downtime and protect mail history.', 'Send Axon your domain, number of mailboxes and current email provider details.');
    }
    if (includesAny(text, ['seo', 'sem', 'aeo', 'geo', 'not found on google', 'not showing on google', 'google ranking', 'ai search', 'search console', 'analytics', 'ga4'])) {
      prefillForm(question, 'SEO, SEM, GEO and AEO visibility review');
      return answer('Visibility', 'You want more people to find your business through Google, Google Ads, AI search tools or answer engines.', 'SEO covers organic visibility. SEM covers ads. GEO helps AI tools understand your business. AEO helps your pages answer real questions clearly.', 'Search your business name, main service and location. Check if the right page appears and whether your contact button is easy to find.', 'DIY is okay for simple content edits. Ask Axon for a proper audit, tracking setup, service-page strategy and AI-ready content.', 'Send Axon the website URL and target search terms.');
    }
    if (includesAny(text, ['form not working', 'form', 'email not sending', 'smtp', 'contact form', 'enquiry not received'])) {
      prefillForm(question, 'website form or email delivery issue');
      return answer('Form', 'Your website form may submit, but the message may not reach your inbox.', 'Common causes include SMTP settings, wrong recipient email, plugin settings, spam filtering, SPF/DKIM/DMARC or website hosting mail restrictions.', 'Test once, note the exact time, check spam/junk and record the page URL.', 'DIY is okay for checking spam and recipient settings. Ask Axon if enquiries are important, because this may require SMTP and DNS checks.', 'Send Axon your website URL, form page and receiving email address.');
    }
    if (includesAny(text, ['ai', 'chatgpt', 'chatbot', 'automation', 'assistant'])) {
      prefillForm(question, 'AI advisory or automation help');
      return answer('AI', 'You want to use AI, a chatbot, automation or an assistant to reduce manual work or answer customers better.', 'This may include website chatbot, internal AI assistant, content support, workflow automation, company knowledge, privacy rules and staff usage guidelines.', 'List the repetitive questions or tasks you want AI to handle.', 'DIY is okay for trying ChatGPT. Ask Axon if AI must connect to your business process, website, documents, team workflow or customer enquiries.', 'Send Axon the task you want to automate.');
    }
    return answer('General', 'This sounds like a website, email, hosting, AI, automation or business technology matter that needs a clearer look before choosing the right solution.', 'It may involve your website platform, hosting, domain, email, forms, payment, SEO, analytics, AI chatbot, automation or business workflow.', 'Prepare the website URL, what you expected to happen, what actually happened, screenshots and whether the issue affects customers, staff or only you.', 'Simple content changes may be DIY. Ask Axon to assist if the issue affects enquiries, payment, email, Google visibility, AI readiness or business operations.', 'Submit the form on this page or use the WhatsApp Axon button below. The related Axon pages below are recommended starting points.');
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
