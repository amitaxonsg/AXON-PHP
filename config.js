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
        headers: {
          'Content-Type': 'application/json'
        },
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
