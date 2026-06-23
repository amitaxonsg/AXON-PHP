(() => {
  const AXON_GA4_ID = 'G-DZERQP400E';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${AXON_GA4_ID}"]`)) {
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${AXON_GA4_ID}`;
    document.head.appendChild(analyticsScript);
  }

  window.gtag('js', new Date());
  window.gtag('config', AXON_GA4_ID);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Click-to-zoom for software screenshots.
  const zoomButtons = document.querySelectorAll('.axon-image-zoom img');
  if (zoomButtons.length) {
    const zoomModal = document.createElement('div');
    zoomModal.className = 'axon-image-modal';
    zoomModal.setAttribute('aria-hidden', 'true');
    zoomModal.innerHTML = `
      <button class="axon-image-modal-close" type="button" aria-label="Close image zoom">&times;</button>
      <img alt="" class="axon-image-modal-img" src="">
    `;
    document.body.appendChild(zoomModal);

    const modalImage = zoomModal.querySelector('.axon-image-modal-img');
    const closeZoom = () => {
      zoomModal.classList.remove('open');
      zoomModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('axon-modal-open');
    };

    zoomButtons.forEach((image) => {
      const trigger = image.closest('.axon-image-zoom');
      trigger.addEventListener('click', () => {
        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt || 'Software screenshot';
        zoomModal.classList.add('open');
        zoomModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('axon-modal-open');
      });
    });

    zoomModal.addEventListener('click', (event) => {
      if (event.target === zoomModal || event.target.classList.contains('axon-image-modal-close')) {
        closeZoom();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && zoomModal.classList.contains('open')) {
        closeZoom();
      }
    });
  }
  
  // 1. Mobile Menu & Navigation Dropdowns Interactivity
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  function closeMobileMenu() {
    if (navMenu) {
      navMenu.classList.remove('open');
      if (menuToggle) {
        const spans = menuToggle.querySelectorAll('span');
        if (spans.length >= 3) {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      }
      // Reset mobile dropdown active states
      document.querySelectorAll('.nav-item-dropdown').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
    }
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
      } else {
        closeMobileMenu();
      }
    });

    // Close menu when clicking normal links (not dropdown toggles)
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== menuToggle) {
        closeMobileMenu();
      }
    });
  }

  // Toggle submenus on click on mobile
  const dropdownToggleLinks = document.querySelectorAll('.nav-menu .dropdown-toggle');
  dropdownToggleLinks.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = toggle.closest('.nav-item-dropdown');
        const dropdownMenu = parent.querySelector('.dropdown-menu');
        
        const isOpen = dropdownMenu.classList.contains('open');
        
        // Close all dropdowns
        dropdownToggleLinks.forEach(otherToggle => {
          const otherParent = otherToggle.closest('.nav-item-dropdown');
          const otherMenu = otherParent.querySelector('.dropdown-menu');
          otherParent.classList.remove('active');
          otherMenu.classList.remove('open');
        });
        
        if (!isOpen) {
          parent.classList.add('active');
          dropdownMenu.classList.add('open');
        }
      }
    });
  });

  // Contact Modal Setup & Core Functionality
  const contactModal = document.getElementById('contactModal');
  const contactModalClose = document.getElementById('contactModalClose');
  const contactModalOverlay = document.getElementById('contactModalOverlay');
  const messageTextarea = document.getElementById('message');
  const nameInput = document.getElementById('name');

  function setupNewsNav() {
    if (!navMenu) return;
    const currentPath = window.location.pathname.replace(/\/+$/, '').toLowerCase();

    let newsLink = navMenu.querySelector('a[href*="/trending"], a[href*="trending/"]');

    if (newsLink) {
      newsLink.textContent = 'News';
      if (currentPath.startsWith('/trending')) {
        newsLink.classList.add('active');
      }
      return;
    }

    const askAxonLink = navMenu.querySelector('a.nav-link[href*="ask-axon"]');
    let contactLink = navMenu.querySelector('.nav-link[href*="contact"]');

    if (!contactLink) {
      const allNavLinks = Array.from(navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)'));
      contactLink = allNavLinks[allNavLinks.length - 1];
    }

    newsLink = document.createElement('a');
    newsLink.className = 'nav-link';
    newsLink.href = '/trending/';
    newsLink.textContent = 'News';
    newsLink.addEventListener('click', closeMobileMenu);

    if (askAxonLink) {
      askAxonLink.insertAdjacentElement('afterend', newsLink);
    } else if (contactLink) {
      contactLink.insertAdjacentElement('afterend', newsLink);
    } else {
      navMenu.appendChild(newsLink);
    }

    if (currentPath.startsWith('/trending')) {
      newsLink.classList.add('active');
    }
  }

  function setupMobileNavActions() {
    if (!navMenu) return;

    const creditLink = navMenu.querySelector('.mobile-credit-link');
    const existingMobileLogin = navMenu.querySelector('.mobile-renewals-link');

    if (creditLink) {
      creditLink.textContent = 'Buy Credits';
      creditLink.addEventListener('click', closeMobileMenu);
    }

    if (creditLink && !existingMobileLogin) {
      const mobileLoginLink = document.createElement('a');
      mobileLoginLink.className = 'nav-link mobile-renewals-link';
      mobileLoginLink.href = 'https://1proit.com/index.php/login';
      mobileLoginLink.target = '_blank';
      mobileLoginLink.rel = 'noopener';
      mobileLoginLink.textContent = 'Login to Axon 1Pro - Renewals';
      mobileLoginLink.addEventListener('click', closeMobileMenu);
      creditLink.insertAdjacentElement('afterend', mobileLoginLink);
    }
  }

  function normalizeNavigationOrder() {
    if (!navMenu) return;

    const findDirectDropdown = (label) => {
      const normalizedLabel = label.toLowerCase();
      return Array.from(navMenu.querySelectorAll(':scope > .nav-item-dropdown'))
        .find((item) => (item.textContent || '').toLowerCase().includes(normalizedLabel));
    };

    const findDirectLink = (patterns) => {
      const links = Array.from(navMenu.querySelectorAll(':scope > a.nav-link'));
      return links.find((link) => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        const text = (link.textContent || '').trim().toLowerCase();
        return patterns.some((pattern) => href.includes(pattern) || text === pattern);
      });
    };

    const homeLink = findDirectLink(['index.html', 'home']);
    const servicesDropdown = findDirectDropdown('services');
    const useCasesLink = findDirectLink(['use-cases.html', 'use cases']);
    const aboutDropdown = findDirectDropdown('about axon');
    const contactLink = findDirectLink(['contact.html', 'contact us']);

    let askAxonLink = findDirectLink(['ask-axon.html', 'ask axon']);
    if (!askAxonLink) {
      askAxonLink = document.createElement('a');
      askAxonLink.className = 'nav-link';
      askAxonLink.href = 'ask-axon.html';
      askAxonLink.textContent = 'Ask Axon';
      askAxonLink.addEventListener('click', closeMobileMenu);
    }

    let newsLink = findDirectLink(['trending', 'news']);
    if (!newsLink) {
      newsLink = document.createElement('a');
      newsLink.className = 'nav-link';
      newsLink.href = '/trending/';
      newsLink.addEventListener('click', closeMobileMenu);
    }
    newsLink.textContent = 'News';

    const mobileCreditLink = navMenu.querySelector(':scope > a.mobile-credit-link, :scope > a.nav-link[href*="credit-top-up"]');
    if (mobileCreditLink) {
      mobileCreditLink.classList.add('mobile-credit-link');
      mobileCreditLink.textContent = 'Buy Credits';
      mobileCreditLink.addEventListener('click', closeMobileMenu);
    }

    const mobileRenewalsLink = navMenu.querySelector(':scope > a.mobile-renewals-link');

    [
      homeLink,
      servicesDropdown,
      useCasesLink,
      aboutDropdown,
      contactLink,
      askAxonLink,
      newsLink,
      mobileCreditLink,
      mobileRenewalsLink
    ].filter(Boolean).forEach((item) => {
      navMenu.appendChild(item);
    });
  }

  async function setupTrendingPage() {
    const trendingRoot = document.querySelector('[data-trending-page]');
    if (!trendingRoot) return;

    const filtersContainer = document.getElementById('trendingFilters');
    const listContainer = document.getElementById('trendingGrid');
    const titleLabel = document.getElementById('trendingPageLabel');
    const updatedLabel = document.getElementById('trendingUpdatedDate');
    if (!filtersContainer || !listContainer || !titleLabel) return;

    const trendingCategories = [
      { key: 'all', label: 'All', path: '/trending/', aliases: ['all'] },
      { key: 'ai', label: 'AI', path: '/trending/ai/', aliases: ['ai', 'artificialintelligence'] },
      { key: 'business', label: 'Business', path: '/trending/business/', aliases: ['business', 'businesstechnology', 'smetechnologytrends', 'singaporeasiabusinesstechnologynews'] },
      { key: 'automation', label: 'Automation', path: '/trending/automation/', aliases: ['automation', 'businessautomation', 'workflowautomation'] },
      { key: 'productivity', label: 'Productivity', path: '/trending/productivity/', aliases: ['productivity', 'productivitytools'] },
      { key: 'security', label: 'Cybersecurity', path: '/trending/security/', aliases: ['security', 'cybersecurity'] },
      { key: 'cloud', label: 'Cloud', path: '/trending/cloud/', aliases: ['cloud', 'cloudsolutions'] },
      { key: 'websites', label: 'Websites', path: '/trending/websites/', aliases: ['websites', 'digitalpresence'] },
      { key: 'googleworkspace', label: 'Google Workspace', path: '/trending/googleworkspace/', aliases: ['googleworkspace'] },
      { key: 'microsoft365', label: 'Microsoft 365', path: '/trending/microsoft365/', aliases: ['microsoft365'] }
    ];

    const categoryMap = new Map(trendingCategories.map((category) => [category.key, category]));

    function normalizeKey(value) {
      return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    }

    function getSelectedCategory() {
      const slugSegments = window.location.pathname
        .replace(/\/index\.html$/, '')
        .replace(/\/+/g, '/')
        .split('/')
        .filter(Boolean)
        .filter((segment) => segment.toLowerCase() !== 'index.html');
      const slug = normalizeKey(slugSegments.pop() || 'trending');
      return categoryMap.has(slug) ? slug : 'all';
    }

    function getCategoryLabel(key) {
      return categoryMap.get(key)?.label || 'All';
    }

    function formatTrendingDate(value) {
      const parts = String(value || '').split('-').map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) return value;
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      return `${weekday} ${date.getDate()}, ${month} ${date.getFullYear()}`;
    }

    function articleMatchesCategory(article, categoryKey) {
      if (categoryKey === 'all') return true;
      const category = categoryMap.get(categoryKey);
      const acceptedKeys = new Set([categoryKey, ...(category?.aliases || [])].map(normalizeKey));
      const articleKeys = [
        article.categoryKey,
        article.category,
        ...(Array.isArray(article.tags) ? article.tags : [])
      ].map(normalizeKey);

      return articleKeys.some((key) => acceptedKeys.has(key));
    }

    function appendText(parent, tagName, className, text) {
      const element = document.createElement(tagName);
      if (className) element.className = className;
      element.textContent = text || '';
      parent.appendChild(element);
      return element;
    }

    function createTagList(tags) {
      const tagList = document.createElement('div');
      tagList.className = 'trending-card-tags';
      (tags || []).forEach((tag) => {
        appendText(tagList, 'span', 'trending-card-mini-tag', `#${String(tag).replace(/^#/, '')}`);
      });
      return tagList;
    }

    function createIndustriesList(industries) {
      const list = document.createElement('ul');
      list.className = 'trending-card-industries';
      (industries || []).forEach((industry) => {
        appendText(list, 'li', '', industry);
      });
      return list;
    }

    function createSummarySection(title, copy) {
      const section = document.createElement('div');
      section.className = 'trending-card-section';
      appendText(section, 'h4', '', title);
      appendText(section, 'p', '', copy);
      return section;
    }

    function createArticleCard(article) {
      const card = document.createElement('article');
      card.className = 'trending-card';

      const header = document.createElement('div');
      header.className = 'trending-card-header';
      appendText(header, 'span', 'trending-card-tag', `#${article.category || 'Business'}`);

      const meta = document.createElement('div');
      meta.className = 'trending-card-meta';
      appendText(meta, 'span', 'trending-card-date', article.publishedDate || 'Curated Brief');
      appendText(meta, 'span', 'trending-card-time', article.readingTime || '1 Minute Read');
      header.appendChild(meta);
      card.appendChild(header);

      appendText(card, 'h3', '', article.title);

      const copy = document.createElement('div');
      copy.className = 'trending-card-copy';
      copy.appendChild(createSummarySection('What Happened', article.whatHappened));
      copy.appendChild(createSummarySection('Why It Matters', article.whyItMatters));

      const audience = document.createElement('div');
      audience.className = 'trending-card-audience';
      appendText(audience, 'h4', '', 'Who Should Care');
      audience.appendChild(createIndustriesList(article.industries));
      copy.appendChild(audience);
      card.appendChild(copy);

      card.appendChild(createTagList(article.tags));

      const sourceRow = document.createElement('div');
      sourceRow.className = 'trending-card-source-row';
      appendText(sourceRow, 'span', 'trending-card-source-name', article.sourceName || 'Original Source');
      const sourceLink = document.createElement('a');
      sourceLink.className = 'trending-card-source';
      sourceLink.href = article.sourceUrl || '#';
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = 'Read Original Source';
      sourceRow.appendChild(sourceLink);
      card.appendChild(sourceRow);

      return card;
    }

    function setPageMetadata(categoryKey) {
      const label = getCategoryLabel(categoryKey);
      const pageName = categoryKey === 'all' ? 'News' : `${label} News`;
      const canonical = document.querySelector('link[rel="canonical"]');
      document.title = `${pageName} | Axon 1ProIT`;
      if (canonical) {
        canonical.href = `https://axon.com.sg${categoryMap.get(categoryKey)?.path || '/trending/'}`;
      }
    }

    function buildFilters(activeKey) {
      filtersContainer.innerHTML = '';
      trendingCategories.forEach((category) => {
        const link = document.createElement('a');
        link.className = `trending-filter-btn${category.key === activeKey ? ' active' : ''}`;
        link.href = category.path;
        link.textContent = category.label;
        link.setAttribute('aria-current', category.key === activeKey ? 'page' : 'false');
        filtersContainer.appendChild(link);
      });
    }

    function renderTrendingArticles(categoryKey, articles) {
      const label = getCategoryLabel(categoryKey);
      const filteredArticles = articles.filter((article) => articleMatchesCategory(article, categoryKey));

      titleLabel.textContent = categoryKey === 'all'
        ? 'Explore business technology trends'
        : `${label} insights for business decision makers`;

      listContainer.innerHTML = '';
      if (!filteredArticles.length) {
        const empty = document.createElement('div');
        empty.className = 'trending-empty-state';
        empty.textContent = `No ${label} articles are available in the current brief. Please check another category.`;
        listContainer.appendChild(empty);
        return;
      }

      filteredArticles.slice(0, 12).forEach((article) => {
        listContainer.appendChild(createArticleCard(article));
      });
    }

    function renderErrorState() {
      listContainer.innerHTML = '';
      const empty = document.createElement('div');
      empty.className = 'trending-empty-state';
      empty.textContent = 'News briefs are being refreshed. Please try again shortly.';
      listContainer.appendChild(empty);
    }

    const selectedCategory = getSelectedCategory();
    buildFilters(selectedCategory);
    setPageMetadata(selectedCategory);

    try {
      const dataSource = trendingRoot.getAttribute('data-trending-source') || '/assets/data/trending.json';
      const response = await fetch(dataSource, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Trending data request failed: ${response.status}`);
      const data = await response.json();
      const articles = Array.isArray(data.articles) ? data.articles : [];
      if (updatedLabel && data.updatedDate) {
        updatedLabel.textContent = formatTrendingDate(data.updatedDate);
      }
      renderTrendingArticles(selectedCategory, articles);
    } catch (error) {
      console.warn(error);
      renderErrorState();
    }
  }

  function openContactModal(prefillText) {
    if (!contactModal) return;
    if (messageTextarea && prefillText) {
      messageTextarea.value = prefillText;
    }
    contactModal.classList.add('open');
    if (nameInput) {
      setTimeout(() => {
        nameInput.focus();
      }, 100);
    }
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    const formFeedback = document.getElementById('formFeedback');
    if (formFeedback) {
      formFeedback.classList.add('hidden');
    }
  }

  function hasNavigableHref(element) {
    const href = element.getAttribute('href');
    if (!href) return false;

    const normalizedHref = href.trim().toLowerCase();
    return normalizedHref !== '#' && !normalizedHref.startsWith('javascript:');
  }

  // Site search for services and common business problems.
  let navActions = document.querySelector('.nav-actions');
  const siteSearchPages = [
    { title: 'Ask Axon', category: 'Technology & AI Advisory', url: 'ask-axon.html', terms: 'ask axon technology ai advisor business help website advisory review plain english website issue email issue hosting issue automation issue ai question' },
    { title: 'AI Search Visibility', category: 'AI Search Services', url: 'ai-search-visibility.html', terms: 'ai search visibility chatgpt gemini copilot perplexity google ai overview business discoverability ai recommendations' },
    { title: 'AI-Ready Website', category: 'AI Search Services', url: 'ai-ready-website.html', terms: 'ai ready website ai readable website structured service pages schema faq answer content ai search visibility' },
    { title: 'LLM-Friendly Content Architecture', category: 'AI Search Services', url: 'llm-friendly-content-architecture.html', terms: 'llm friendly content architecture structured content faq service hierarchy ai readable pages chatgpt gemini copilot' },
    { title: 'Generative Engine Optimization (GEO)', category: 'AI Search Services', url: 'generative-engine-optimization.html', terms: 'geo generative engine optimization ai recommendations ai search chatgpt gemini copilot perplexity business discovery' },
    { title: 'Answer Engine Optimization (AEO)', category: 'AI Search Services', url: 'answer-engine-optimization.html', terms: 'aeo answer engine optimization faq direct answers question answer snippets voice search ai answers' },
    { title: 'SEO, SEM, GEO & AEO', category: 'AI Search Services', url: 'seo-sem-geo-aeo.html', terms: 'seo sem geo aeo search engine optimization search engine marketing generative engine optimization answer engine optimization ai search' },
    { title: 'Why Axon', category: 'About Axon', url: 'why-axon.html', terms: 'why axon about axon technology advisor ai advisor business first human first company profile experience' },
    { title: 'Buy Credits', category: 'Billing & Credits', url: 'credit-top-up.html', terms: 'buy credits ai credits top up payment checkout stripe credit balance axon credits' },
    { title: 'Google Business Profile', category: 'Business Growth', url: 'google-business-profile.html', terms: 'google business profile maps local listing reviews local visibility business profile' },
    { title: 'SEO & Local Visibility', category: 'Business Growth', url: 'seo-local-visibility.html', terms: 'seo local visibility local seo google search service pages location pages indexing' },
    { title: 'Analytics & Search Console', category: 'Business Growth', url: 'analytics-search-console.html', terms: 'google analytics ga4 search console reporting indexing enquiry tracking website data' },
    { title: 'Tracking Pixels & Landing Pages', category: 'Business Growth', url: 'tracking-pixels-landing-pages.html', terms: 'tracking pixel meta pixel google ads landing page conversion events campaign tracking' },
    { title: 'CRM & Lead Management', category: 'Business Growth', url: 'crm-lead-management.html', terms: 'crm lead management follow up pipeline website form leads sales tracking' },
    { title: 'Newsletter Setup', category: 'Business Growth', url: 'newsletter-setup.html', terms: 'newsletter email marketing signup forms audience list campaign template' },
    { title: 'Booking & Appointments', category: 'Business Operations', url: 'booking-appointments.html', terms: 'booking appointment calendar scheduling request to book reminders' },
    { title: 'Quotes & Invoice Automation', category: 'Business Operations', url: 'quotes-invoice-automation.html', terms: 'quotation invoice automation quote request approval payment request' },
    { title: 'Payment Gateway Setup', category: 'Business Operations', url: 'payment-gateway-setup.html', terms: 'payment gateway stripe checkout website payments forms payment confirmation' },
    { title: 'Review Collection', category: 'Business Operations', url: 'review-collection.html', terms: 'reviews testimonials google review collection feedback trust local seo' },
    { title: 'Support Ticketing', category: 'Business Operations', url: 'support-ticketing.html', terms: 'support ticket helpdesk issue tracking customer support workflow' },
    { title: 'Staff AI & Privacy Policy', category: 'Business Operations', url: 'staff-ai-privacy-policy.html', terms: 'staff ai policy privacy safe ai use governance training confidential data' },
    { title: 'Core Web Vitals Checks', category: 'Security, Recovery & Performance', url: 'core-web-vitals-checks.html', terms: 'core web vitals page speed mobile performance lcp cls inp website speed' },
    { title: 'WordPress Plugin Development', category: 'Websites & Digital Presence', url: 'wordpress-plugin-development.html', terms: 'wordpress plugin custom plugin business workflow calculator booking form portal automation wordpress feature marketplace plugin' },
    { title: 'Website Optimization Audit', category: 'Websites & Digital Presence', url: 'website-optimization-audit.html', terms: 'google analytics google anlyatics search console seo sem sitemap tag manager tracking conversion events indexing not found on google crawl metadata' },
    { title: 'SEO & Local Business Visibility', category: 'Business Growth', url: 'seo-local-visibility.html', terms: 'seo local seo google business profile search console ga4 analytics sitemap service pages location pages reviews testimonials core web vitals website speed indexing not found on google local business visibility singapore philippines enquiry tracking whatsapp clicks phone clicks' },
    { title: 'Wix Website Support', category: 'Websites & Digital Presence', url: 'wix-website-support.html', terms: 'wix form not sending wix domain wix seo wix mobile layout wix analytics wix redesign wix support' },
    { title: 'Shopify Store Support', category: 'Websites & Digital Presence', url: 'shopify-store-support.html', terms: 'shopify checkout payment payments shipping products collections store support domain sales analytics ecommerce e-commerce' },
    { title: 'AI Website & App Publishing', category: 'Hosting, Domains & Infrastructure', url: 'ai-website-app-publishing.html', terms: 'lovable elevelable bolt replit vercel ai builder ai created website ai built website host publish deployment app domain ssl database api email forms chatgpt recommendation non it client' },
    { title: 'WhatsApp Marketing & Automation', category: 'AI & Business Automation', url: 'whatsapp-marketing-automation.html', terms: 'whatsapp whatapp marketing automation autmaton auto reply campaign crm lead follow up templates business messages' },
    { title: 'Human-Like Website AI Chatbot', category: 'AI & Business Automation', url: 'website-ai-chatbot.html', terms: 'human like ai chatbot chat bot website assistant customer support auto answer faq lead capture live chat human handoff' },
    { title: 'AI Writing & Content Assistant', category: 'AI & Business Automation', url: 'ai-writing-content-assistant.html', terms: 'ai writing human like content assistant email proposal website copy product description social post prompt chatgpt' },
    { title: 'Business Growth and Operations Support', category: 'Business Growth', url: 'business-growth-operations-support.html', terms: 'google business profile setup local seo singapore philippines seo local visibility facebook instagram tiktok pixel tracking meta ads landing page crm lead management appointment booking automation invoice quotation automation email newsletter setup online payment gateway setup review testimonial collection customer support ticketing staff ai training pdpa privacy ai usage policy analytics search console setup website speed core web vitals' },
    { title: 'Corporate Websites', category: 'Websites & Digital Presence', url: 'corporate-websites.html', terms: 'company website business website landing page services pages credibility enquiries' },
    { title: 'Website Revamps & Modernization', category: 'Websites & Digital Presence', url: 'website-revamps-modernization.html', terms: 'redesign revamp modernize old website mobile layout ux ui content refresh' },
    { title: 'E-Commerce Solutions', category: 'Websites & Digital Presence', url: 'e-commerce-solutions.html', terms: 'online store ecommerce e-commerce cart checkout products payments sales' },
    { title: 'Customer & Member Portals', category: 'Websites & Digital Presence', url: 'customer-member-portals.html', terms: 'portal login customer member dashboard secure access' },
    { title: 'Business Applications', category: 'Websites & Digital Presence', url: 'business-applications.html', terms: 'custom app internal system forms workflow dashboard operations' },
    { title: 'Mobile App Technical Assistance', category: 'Websites & Digital Presence', url: 'mobile-app-technical-assistance.html', terms: 'mobile app android ios technical assistance publish issue app support' },
    { title: 'Website Maintenance & Support', category: 'Websites & Digital Presence', url: 'website-maintenance-support.html', terms: 'maintenance updates fixes backups content edits support broken website' },
    { title: 'Google Workspace Solutions', category: 'Cloud & Email Solutions', url: 'google-workspace-solutions.html', terms: 'gmail google workspace email drive calendar business email migration migrate email to google workspace already using google need help new google workspace setup shared drive setup google admin gmail phone setup microsoft 365 to google hosting mail to google' },
    { title: 'Microsoft 365 Solutions', category: 'Cloud & Email Solutions', url: 'microsoft-365-solutions.html', terms: 'outlook microsoft 365 office teams onedrive exchange business email migration migrate email to 365 migrate email to microsoft 365 already in 365 need help already using microsoft 365 need help new microsoft 365 setup teams setup sharepoint onedrive setup google to 365 hosting mail to 365' },
    { title: 'Business Email Solutions', category: 'Cloud & Email Solutions', url: 'business-email-solutions.html', terms: 'email smtp forms not sending spf dkim dmarc mail delivery contact form' },
    { title: 'Cloud Migration Services', category: 'Cloud & Email Solutions', url: 'cloud-migration-services.html', terms: 'migration cloud email files server move provider' },
    { title: 'Document & Collaboration Platforms', category: 'Cloud & Email Solutions', url: 'document-collaboration-platforms.html', terms: 'documents collaboration drive sharepoint files permissions' },
    { title: 'Productivity Solutions', category: 'Cloud & Email Solutions', url: 'productivity-solutions.html', terms: 'productivity tools workflow team documents email calendar' },
    { title: 'Corporate Hosting', category: 'Hosting, Domains & Infrastructure', url: 'corporate-hosting.html', terms: 'hosting cpanel whm website host 1prohost server ssl backups' },
    { title: 'Cloud Hosting Solutions', category: 'Hosting, Domains & Infrastructure', url: 'cloud-hosting-solutions.html', terms: 'cloud hosting vps server performance scalable website app' },
    { title: 'Domain Registration & Management', category: 'Hosting, Domains & Infrastructure', url: 'domain-registration-management.html', terms: 'domain dns nameserver ssl redirects www mx records' },
    { title: 'Business Email Hosting', category: 'Hosting, Domains & Infrastructure', url: 'business-email-hosting.html', terms: 'email hosting mailbox imap smtp webmail delivery' },
    { title: 'Server Setup & Deployment', category: 'Hosting, Domains & Infrastructure', url: 'server-setup-deployment.html', terms: 'server setup deployment vps linux cloud firewall' },
    { title: 'Server Management & Monitoring', category: 'Hosting, Domains & Infrastructure', url: 'server-management-monitoring.html', terms: 'server monitoring uptime alerts maintenance patches' },
    { title: 'Application Deployment', category: 'Hosting, Domains & Infrastructure', url: 'application-deployment.html', terms: 'deploy app application database backend api environment variables' },
    { title: 'Infrastructure Planning', category: 'Hosting, Domains & Infrastructure', url: 'infrastructure-planning.html', terms: 'infrastructure planning hosting email domain cloud roadmap' },
    { title: 'AI Consulting & Implementation', category: 'AI & Business Automation', url: 'ai-consulting-implementation.html', terms: 'ai consulting implementation chatgpt claude training workflow business use cases' },
    { title: 'AI Assistants for Business', category: 'AI & Business Automation', url: 'ai-assistants-for-business.html', terms: 'ai assistant staff assistant customer assistant internal chatbot' },
    { title: 'Company AI Workspaces', category: 'AI & Business Automation', url: 'company-ai-workspaces.html', terms: 'company ai workspace document search knowledge base team ai' },
    { title: 'Business Process Automation', category: 'AI & Business Automation', url: 'business-process-automation.html', terms: 'process automation operations forms email sheets crm approvals' },
    { title: 'Workflow Automation', category: 'AI & Business Automation', url: 'workflow-automation.html', terms: 'workflow automation zapier make n8n forms crm email follow up' },
    { title: 'Private AI Solutions', category: 'AI & Business Automation', url: 'private-ai-solutions.html', terms: 'private ai local ai ollama open webui privacy documents llm' },
    { title: 'Website Security', category: 'Security, Recovery & Performance', url: 'website-security.html', terms: 'security hardening malware firewall wordpress hacked protection' },
    { title: 'Website Recovery', category: 'Security, Recovery & Performance', url: 'website-recovery.html', terms: 'recovery restore broken website hacked down backup repair' },
    { title: 'Malware Removal', category: 'Security, Recovery & Performance', url: 'malware-removal.html', terms: 'malware removal virus hacked blacklist warning cleanup' },
    { title: 'Backup & Disaster Recovery', category: 'Security, Recovery & Performance', url: 'backup-disaster-recovery.html', terms: 'backup disaster recovery restore data website server' },
    { title: 'Performance Optimization', category: 'Security, Recovery & Performance', url: 'performance-optimization.html', terms: 'speed slow website core web vitals images cache performance' },
    { title: 'Website Monitoring & Health Checks', category: 'Security, Recovery & Performance', url: 'website-monitoring-health-checks.html', terms: 'monitoring health checks uptime alerts broken links website check' },
    { title: 'Technology Strategy & Planning', category: 'Technology & AI Advisory', url: 'technology-strategy-planning.html', terms: 'technology strategy planning roadmap budget priorities' },
    { title: 'AI Readiness & Adoption', category: 'Technology & AI Advisory', url: 'ai-readiness-adoption.html', terms: 'ai readiness adoption training staff policy' },
    { title: 'Digital Transformation', category: 'Technology & AI Advisory', url: 'digital-transformation.html', terms: 'digital transformation modernization business systems' },
    { title: 'Technology Assessments', category: 'Technology & AI Advisory', url: 'technology-assessments.html', terms: 'technology assessment audit review risk tools' },
    { title: 'Executive Advisory', category: 'Technology & AI Advisory', url: 'executive-advisory.html', terms: 'executive advisory leadership decision technology ai' },
    { title: 'AI Tool & Platform Selection', category: 'Technology & AI Advisory', url: 'ai-tool-platform-selection.html', terms: 'ai tool selection chatgpt claude platform compare cost' },
    { title: 'Use Cases', category: 'Business Problems', url: 'use-cases.html', terms: 'business problems use cases sme startup corporate issue solutions' },
    { title: 'News: Technology & AI Insights', category: 'News', url: 'trending/', terms: 'trending latest ai business technology news insights sme singapore asia automation productivity cybersecurity cloud google workspace microsoft 365 digital presence decision makers' },
    { title: 'News: AI Insights', category: 'News', url: 'trending/ai/', terms: 'artificial intelligence ai assistants agents chatgpt business ai adoption automation summaries' },
    { title: 'News: Business Technology', category: 'News', url: 'trending/business/', terms: 'business technology sme trends singapore asia digital adoption operations productivity ai governance' },
    { title: 'News: Automation Insights', category: 'News', url: 'trending/automation/', terms: 'automation workflow crm leads whatsapp invoices quotations approvals business process automation' },
    { title: 'News: Productivity Tools', category: 'News', url: 'trending/productivity/', terms: 'productivity tools google workspace microsoft 365 documents tasks collaboration meetings' },
    { title: 'News: Cybersecurity Briefs', category: 'News', url: 'trending/security/', terms: 'cybersecurity security ransomware advisories patching backups mfa website security cloud security' },
    { title: 'News: Websites & Digital Presence', category: 'News', url: 'trending/websites/', terms: 'websites digital presence seo analytics search console ga4 local visibility website optimization' },
    { title: 'Contact Axon', category: 'Contact', url: 'contact.html', terms: 'contact address whatsapp chat form talk to axon amit help enquiry' }
  ];

  function normalizeSearchText(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function getSiteSearchResults(query) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      return siteSearchPages.slice(0, 8);
    }

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
    return siteSearchPages
      .map((page) => {
        const title = normalizeSearchText(page.title);
        const category = normalizeSearchText(page.category);
        const url = normalizeSearchText(page.url);
        const terms = normalizeSearchText(page.terms);
        const haystack = `${title} ${category} ${url} ${terms}`;
        const tokenScore = tokens.reduce((total, token) => {
          let tokenScore = 0;
          if (title.includes(token)) tokenScore += 8;
          if (category.includes(token)) tokenScore += 4;
          if (terms.includes(token)) tokenScore += 5;
          if (url.includes(token)) tokenScore += 3;
          if (haystack.includes(token)) tokenScore += 1;
          return total + tokenScore;
        }, 0);
        const matchedTokenCount = tokens.filter((token) => haystack.includes(token)).length;
        const allTokensMatch = matchedTokenCount === tokens.length;
        let phraseScore = 0;

        if (title.includes(normalizedQuery)) phraseScore += 30;
        if (terms.includes(normalizedQuery)) phraseScore += 24;
        if (url.includes(normalizedQuery)) phraseScore += 12;
        if (category.includes(normalizedQuery)) phraseScore += 8;
        if (allTokensMatch) phraseScore += 12;

        const score = tokenScore + phraseScore + (matchedTokenCount * 2);

        return { ...page, score };
      })
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 9);
  }

  // v36: robust site search button and overlay injection for all pages.
  function setupSiteSearch() {
    if (document.getElementById('siteSearchPanel') && document.getElementById('siteSearchToggle')) return;

    if (!navActions) {
      const navContainer = document.querySelector('.nav-container');
      const menuButton = document.getElementById('menuToggle');
      navActions = document.createElement('div');
      navActions.className = 'nav-actions';

      if (menuButton && menuButton.parentElement) {
        menuButton.parentElement.insertBefore(navActions, menuButton);
        navActions.appendChild(menuButton);
      } else if (navContainer) {
        navContainer.appendChild(navActions);
      }
    }

    if (!navActions) return;

    let searchToggle = document.getElementById('siteSearchToggle');
    if (!searchToggle) {
      searchToggle = document.createElement('button');
      searchToggle.className = 'site-search-toggle';
      searchToggle.type = 'button';
      searchToggle.id = 'siteSearchToggle';
      searchToggle.setAttribute('aria-label', 'Search site');
      searchToggle.setAttribute('title', 'Search');
      searchToggle.innerHTML = `
        <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-3.5-3.5"></path>
        </svg>
      `;

      const menuButton = document.getElementById('menuToggle');
      if (menuButton && navActions.contains(menuButton)) {
        navActions.insertBefore(searchToggle, menuButton);
      } else if (menuButton && menuButton.parentElement) {
        menuButton.parentElement.insertBefore(searchToggle, menuButton);
      } else {
        navActions.appendChild(searchToggle);
      }
    }

    let searchPanel = document.getElementById('siteSearchPanel');
    if (!searchPanel) {
      searchPanel = document.createElement('div');
      searchPanel.className = 'site-search-panel';
      searchPanel.id = 'siteSearchPanel';
      searchPanel.setAttribute('aria-hidden', 'true');
      searchPanel.innerHTML = `
        <div class="site-search-dialog" role="dialog" aria-modal="true" aria-label="Search site">
          <div class="site-search-head">
            <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.5-3.5"></path>
            </svg>
            <input class="site-search-input" id="siteSearchInput" type="search" placeholder="Search business problem or service" autocomplete="off">
            <button class="site-search-close" type="button" aria-label="Close search">&times;</button>
          </div>
          <div class="site-search-results" id="siteSearchResults"></div>
        </div>
      `;
      document.body.appendChild(searchPanel);
    }

    const searchInput = document.getElementById('siteSearchInput');
    const searchResults = document.getElementById('siteSearchResults');
    const searchClose = searchPanel.querySelector('.site-search-close');

    if (!searchInput || !searchResults || !searchClose) return;

    function renderSiteSearchResults() {
      const results = getSiteSearchResults(searchInput.value);
      searchResults.innerHTML = '';

      if (!results.length) {
        const empty = document.createElement('div');
        empty.className = 'site-search-empty';
        empty.textContent = 'No matching page found. Try website, email, WhatsApp, AI, hosting or SEO.';
        searchResults.appendChild(empty);
        return;
      }

      results.forEach((page) => {
        const result = document.createElement('a');
        result.className = 'site-search-result';
        result.href = page.url;

        const title = document.createElement('strong');
        title.textContent = page.title;
        const category = document.createElement('span');
        category.textContent = page.category;
        const terms = document.createElement('small');
        terms.textContent = page.url.replace('.html', '').replace(/-/g, ' ');

        result.append(title, category, terms);
        result.addEventListener('click', () => {
          closeMobileMenu();
        });
        searchResults.appendChild(result);
      });
    }

    function openSiteSearch() {
      closeMobileMenu();
      searchPanel.classList.add('open');
      searchPanel.setAttribute('aria-hidden', 'false');
      document.body.classList.add('site-search-open');
      renderSiteSearchResults();
      setTimeout(() => searchInput.focus(), 50);
    }

    function closeSiteSearch() {
      searchPanel.classList.remove('open');
      searchPanel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('site-search-open');
    }

    if (!searchToggle.dataset.axonSearchReady) {
      searchToggle.addEventListener('click', openSiteSearch);
      searchToggle.dataset.axonSearchReady = '1';
    }

    if (!searchClose.dataset.axonSearchReady) {
      searchClose.addEventListener('click', closeSiteSearch);
      searchClose.dataset.axonSearchReady = '1';
    }

    if (!searchInput.dataset.axonSearchReady) {
      searchInput.addEventListener('input', renderSiteSearchResults);
      searchInput.dataset.axonSearchReady = '1';
    }

    if (!searchPanel.dataset.axonSearchReady) {
      searchPanel.addEventListener('click', (event) => {
        if (event.target === searchPanel) {
          closeSiteSearch();
        }
      });
      searchPanel.dataset.axonSearchReady = '1';
    }

    if (!document.body.dataset.axonSearchKeysReady) {
      document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable
        );

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          openSiteSearch();
        } else if (event.key === '/' && !isTyping) {
          event.preventDefault();
          openSiteSearch();
        } else if (event.key === 'Escape' && searchPanel.classList.contains('open')) {
          closeSiteSearch();
        }
      });
      document.body.dataset.axonSearchKeysReady = '1';
    }
  }

  setupMobileNavActions();
  setupNewsNav();
  normalizeNavigationOrder();
  setupSiteSearch();
  setupTrendingPage();

  if (contactModalClose) {
    contactModalClose.addEventListener('click', closeContactModal);
  }
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', closeContactModal);
  }

  // Handle Product and Use Case dropdown item clicks to open prefilled inquiries
  const serviceDropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
  serviceDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      // If it is an external link (like cPanel hosting), let it navigate naturally
      if (href && href !== 'javascript:void(0)') {
        closeMobileMenu();
        return;
      }
      
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      const targetUseCase = item.getAttribute('data-usecase');
      let prefillText = '';

      if (targetTab === 'webdev') {
        prefillText = `Hi Axon team,\n\nI am interested in your Websites, Portals & Web Application development services.\n\nPlease let me know how you can help.`;
      } else if (targetTab === 'ai') {
        prefillText = `Hi Axon team,\n\nI would like to explore AI & Automation solutions (ChatGPT integration, local LLMs, automated workflows) for my business.`;
      } else if (targetTab === 'support') {
        prefillText = `Hi Axon team,\n\nI need assistance with Website Security, Recovery, Malware Cleanup, or Speed Optimization.`;
      } else if (targetUseCase === 'corporate') {
        prefillText = `Hi Axon team,\n\nI would like to discuss technology advisory and digital transformation options for my corporate business.`;
      } else if (targetUseCase === 'startups') {
        prefillText = `Hi Axon team,\n\nI am looking for cost-effective website revamp and AI integration solutions for my SME/startup.`;
      } else if (targetUseCase === 'ai-enablement') {
        prefillText = `Hi Axon team,\n\nI am interested in AI training, coaching, or private knowledge base deployment for my team.`;
      }

      if (prefillText) {
        openContactModal(prefillText);
      }
      closeMobileMenu();
    });
  });

  // Locations dropdown item close helper & About Axon page link actions
  const locationDropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item-simple');
  locationDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      // If it is an external link or has action classes, let it function normally
      if ((href && href !== 'javascript:void(0)') || item.classList.contains('btn-consultation') || item.classList.contains('btn-contact-support')) {
        closeMobileMenu();
        return;
      }
      
      e.preventDefault();
      const sectionName = item.textContent.trim();
      openContactModal(`Hi Axon team,\n\nI would like to learn more about the About Axon section: "${sectionName}".`);
      closeMobileMenu();
    });
  });

  // Services mega-menu link clicks to open modal pre-filled
  const megaMenuLinks = document.querySelectorAll('.mega-menu-link');
  megaMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (hasNavigableHref(link)) {
        closeMobileMenu();
        return;
      }

      e.preventDefault();
      const serviceName = link.textContent.trim();
      openContactModal(`Hi Axon team,\n\nI am interested in learning more about your services for:\n"${serviceName}"\n\nPlease let me know how we can proceed.`);
      closeMobileMenu();
    });
  });

  // Bind click listeners to all consultation, pricing, support, clients, contact and blog buttons
  const consultationButtons = document.querySelectorAll('.btn-consultation');
  consultationButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(`Hi Axon team,\n\nI would like to schedule a free technology & AI consultation for my business.\n\nPlease let me know your availability.`);
      closeMobileMenu();
    });
  });

  const pricingButtons = document.querySelectorAll('.btn-pricing');
  pricingButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(`Hi Axon team,\n\nI am interested in learning more about your pricing plans and subscription options.\n\nPlease share your detailed pricing guide.`);
      closeMobileMenu();
    });
  });

  const supportButtons = document.querySelectorAll('.btn-contact-support');
  supportButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(`Hi Axon team,\n\nI need technical support with my website, hosting, or current setup.\n\nHere are details of my request:`);
      closeMobileMenu();
    });
  });

  const blogButtons = document.querySelectorAll('.btn-blog');
  blogButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(`Hi Axon team,\n\nI would like to subscribe to the Axon Blog and receive regular updates on technology, AI strategies, and digital transformation.`);
      closeMobileMenu();
    });
  });

  const clientsButtons = document.querySelectorAll('.btn-clients');
  clientsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (hasNavigableHref(btn)) {
        closeMobileMenu();
        return;
      }

      e.preventDefault();
      openContactModal(`Hi Axon team,\n\nI would like to know more about your Clients & Success Stories, past experience, and projects.`);
      closeMobileMenu();
    });
  });

  const contactButtons = document.querySelectorAll('.btn-contact');
  contactButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(`Hi Axon team,\n\nI would like to get in touch with you to discuss our business needs.`);
      closeMobileMenu();
    });
  });


  // 3. Contact Form Submission Logic (Interactive Demo)
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Put button in submitting state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Request...';
      formFeedback.classList.add('hidden');
      formFeedback.className = 'form-feedback';

      // Gather input data
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const website = document.getElementById('website').value.trim();
      const message = document.getElementById('message').value.trim();

      // Simulate API request (1 second delay)
      setTimeout(() => {
        if (!name || !email || !message) {
          // Failure State
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          formFeedback.textContent = 'Please fill out all required fields.';
          formFeedback.classList.add('error');
          formFeedback.classList.remove('hidden');
        } else {
          // Success State
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          
          formFeedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your redesign mockup request has been received. Amit will contact you at <strong>${email}</strong> within 24 hours.`;
          formFeedback.classList.add('success');
          formFeedback.classList.remove('hidden');
          
          // Clear form
          contactForm.reset();

          // Auto close contact modal after 3.5 seconds
          setTimeout(() => {
            const modal = document.getElementById('contactModal');
            if (modal) {
              modal.classList.remove('open');
            }
            formFeedback.classList.add('hidden');
          }, 3500);
        }
      }, 1000);
    });
  }

  // Contact Page Form Submission Logic
  const contactPageForm = document.getElementById('contactPageForm');
  const pageFormFeedback = document.getElementById('pageFormFeedback');

  if (contactPageForm && pageFormFeedback) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactPageForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Preparing Email...';
      pageFormFeedback.classList.add('hidden');
      pageFormFeedback.className = 'form-feedback';

      const name = document.getElementById('c_name').value.trim();
      const email = document.getElementById('c_email').value.trim();
      const phone = document.getElementById('c_phone').value.trim();
      const website = document.getElementById('c_website').value.trim();
      const message = document.getElementById('c_message').value.trim();

      if (!name || !email || !phone || !message) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        pageFormFeedback.textContent = 'Please fill out all required fields.';
        pageFormFeedback.classList.add('error');
        pageFormFeedback.classList.remove('hidden');
        return;
      }

      const subject = `Axon contact request from ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Contact Number: ${phone}`,
        website ? `Website / Platform: ${website}` : 'Website / Platform: Not provided',
        '',
        message
      ].join('\n');
      const mailtoUrl = `mailto:amit@axon.com.sg?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      pageFormFeedback.innerHTML = `<strong>Email prepared.</strong> Your email app should open with the request ready to send to Amit.`;
      pageFormFeedback.classList.add('success');
      pageFormFeedback.classList.remove('hidden');
      window.location.href = mailtoUrl;
    });
  }

  // Contact page local chat helper.
  const axonAgentForm = document.getElementById('axonAgentForm');
  const axonAgentInput = document.getElementById('axonAgentInput');
  const axonAgentMessages = document.getElementById('axonAgentMessages');
  const axonAgentSuggestionButtons = document.querySelectorAll('[data-agent-question]');

  function getAxonAgentEndpoint() {
    if (!window.kimiConfig) return '';
    const endpoint = typeof window.kimiConfig.backendUrl === 'string' ? window.kimiConfig.backendUrl.trim() : '';
    return endpoint && endpoint !== '/api/axon-agent' ? endpoint : '';
  }

  const axonAgentEndpoint = getAxonAgentEndpoint();

  function appendAxonAgentMessage(role, text) {
    if (!axonAgentMessages) return null;
    const message = document.createElement('div');
    message.className = `axon-agent-message ${role}`;
    const speaker = document.createElement('strong');
    speaker.textContent = role === 'user' ? 'You' : 'Axon Agent';
    const body = document.createElement('p');
    body.textContent = text;
    message.append(speaker, body);
    axonAgentMessages.appendChild(message);
    axonAgentMessages.scrollTop = axonAgentMessages.scrollHeight;
    return message;
  }

  const axonAgentSystemPrompt = `You are Axon AI Agent, a practical website, hosting, forms, Wix, AI chatbot, AI app builder, AI-ready website and business technology support advisor for business owners.

Answer in plain English and in useful detail. Do not be too brief. Always answer the user's actual question, even if the wording is informal or has typos.

Important interpretation rule:
If the user asks anything like "how easy to do app on AI", "can AI make app", "build app with AI", "AI app", "Lovable", "Bolt", "Replit", "website to app", "customer portal", "booking app", "internal app", "dashboard", or "SaaS", treat it as a question about building an app using AI tools. Explain that AI tools can create a prototype quickly, but a proper business app still needs clear requirements, database, login, payments, forms, hosting, security, backups, testing and support.

For every answer, use this structure:

1. What this likely means
Explain the user's issue or idea in simple business language.

2. What could be involved or causing it
List the likely causes or requirements. Mention website design, hosting, DNS, SSL, cache, email routing, form settings, Wix settings, plugins, mobile performance, AI-readiness, AI app builders, database, login, payment, API, security or analytics only where relevant.

3. What you can check first
Ask whether they have already checked the obvious items, then give safe steps they can try. Avoid risky server, DNS or admin changes unless you advise using an IT person.

4. DIY or Axon help
Clearly say what is safe to do yourself, what needs an IT person, and when Axon should review, plan or implement it.

5. Next step
End with a helpful action: If you want Axon to assist, submit the form on this page or use WhatsApp for immediate support.`;

  async function requestKimiAgentReply(question) {
    if (!axonAgentEndpoint) {
      return null;
    }

    try {
      const response = await fetch(axonAgentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          systemPrompt: axonAgentSystemPrompt,
          mode: 'contact_agent'
        })
      });

      if (!response.ok) {
        throw new Error(`Axon agent request failed: ${response.status}`);
      }

      const data = await response.json();
      const candidate = data?.reply || data?.answer || data?.text;
      return typeof candidate === 'string' ? candidate.trim() : JSON.stringify(candidate);
    } catch (error) {
      console.warn('Axon agent request failed:', error);
      return null;
    }
  }


  function isAiAppQuestion(question) {
    const text = question.toLowerCase();
    return (
      /\bapp\b/.test(text) ||
      text.includes('application') ||
      text.includes('ai builder') ||
      text.includes('ai tools') ||
      text.includes('lovable') ||
      text.includes('bolt') ||
      text.includes('replit') ||
      text.includes('build with ai') ||
      text.includes('make with ai') ||
      text.includes('saas') ||
      text.includes('portal') ||
      text.includes('dashboard')
    ) && (
      text.includes('ai') ||
      text.includes('easy') ||
      text.includes('build') ||
      text.includes('make') ||
      text.includes('do') ||
      text.includes('create') ||
      text.includes('develop')
    );
  }

  function isWeakAgentReply(question, reply) {
    if (!reply || reply.length < 450) return true;
    const q = question.toLowerCase();
    const r = reply.toLowerCase();
    if (isAiAppQuestion(q)) {
      return !(
        r.includes('app') ||
        r.includes('application') ||
        r.includes('prototype') ||
        r.includes('database') ||
        r.includes('login') ||
        r.includes('hosting') ||
        r.includes('publish')
      );
    }
    return false;
  }

  function getAxonAgentFallbackReply(question) {
    const text = question.toLowerCase();

    if (isAiAppQuestion(question)) {
      return `1. What this likely means
You are asking whether it is easy to create an app using AI. The answer is: it can be quite easy to create a first prototype, but a proper business app still needs planning, testing and technical setup before it should be used by real customers or staff.

2. What could be involved
AI tools can help create screens, forms, dashboards, simple databases and basic workflows quickly. However, a real app may still need user login, database structure, payment gateway, email notifications, file upload, admin panel, mobile layout, hosting, domain, SSL, backups, security, privacy rules and ongoing support.

3. What you can check first
Have you already written down what the app should do, who will use it, what data it must store, and whether it needs login or payment? Start with a simple scope: one main purpose, three to five screens, the fields you need to collect, and the action after submission. Avoid connecting real payment, customer data or business-critical workflows until someone checks the setup properly.

4. DIY or Axon help
DIY is suitable if you only want to test an idea or create a clickable prototype. Ask your IT person if the app needs database, login, payment, hosting, DNS, API or security setup. Engage Axon if you want to turn the AI-created app into a stable business tool, publish it on your domain, connect forms/email/payment, or check whether the app is safe and scalable.

5. Next step
If you want Axon to assist, submit the form on this page with your app idea, or use WhatsApp for immediate support. Axon can help review the idea, prepare the feature list, advise whether AI tools are enough, and guide the safest way to build or publish it.`;
    }

    if (text.includes('slow') || text.includes('speed') || text.includes('loading')) {
      return `1. What this likely means
Your website is taking too long to load, especially for visitors on mobile or slower internet. This can reduce enquiries and affect Google visibility.

2. What could be causing it
Common causes include large images, too many scripts, weak hosting, no caching, heavy plugins, slow third-party tools, or a page design that loads too much at once.

3. What you can check first
Have you checked the site on mobile data, not only office Wi-Fi? Try opening the homepage and contact page in an incognito browser. Note which page is slow, whether images appear late, and whether the issue happens on phone, laptop, or both. Do not randomly remove plugins or change hosting settings without backup.

4. When to ask Axon
Ask Axon to review it if the site is business-critical, slow on mobile, built in WordPress/Wix/Shopify, or if you are unsure whether the issue is design, hosting, image size, cache or code. If you want Axon to assist, fill in the form on this page or use WhatsApp for immediate support.`;
    }
    if (text.includes('form') || text.includes('email') || text.includes('mail')) {
      return `1. What this likely means
Your website form may be accepting the enquiry but the email is not reaching you, or the form may not be submitting correctly.

2. What could be causing it
Likely causes include wrong recipient email, spam filtering, missing SMTP setup, domain email authentication issues, form plugin error, Wix form notification settings, or the website sending from an address your email provider does not trust.

3. What you can check first
Have you checked spam/junk and tested with another email address? Try submitting the form and note the exact time, page URL, and whether a success message appears. Check where the form is supposed to send and whether your email is Google Workspace, Microsoft 365, hosting mail or Wix mail.

4. When to ask Axon
Ask Axon if enquiries are important, if several users are affected, or if you need SMTP, DNS, SPF, DKIM, DMARC or form settings checked. If you want Axon to assist, fill in the form on this page or use WhatsApp for immediate support.`;
    }
    if (text.includes('wix')) {
      return `1. What this likely means
You may need help with a Wix website issue such as forms, mobile layout, SEO settings, domain connection, speed, or content update.

2. What could be causing it
Wix issues often come from page layout differences between desktop and mobile, form notification settings, domain/DNS connection, app settings, image size, or SEO basics not being completed.

3. What you can check first
Have you checked both desktop and mobile editor views? Prepare the Wix site URL, the affected page, what you expected to happen, and screenshots of the problem. Avoid changing DNS unless you are sure, because that can affect email or the live site.

4. When to ask Axon
Ask Axon if you need Wix forms, SEO, mobile layout, domain, Google Analytics, Search Console or redesign advice. If you want Axon to assist, fill in the form on this page or use WhatsApp for immediate support.`;
    }
    if (text.includes('ai ready') || text.includes('chatgpt') || text.includes('gemini') || text.includes('ai search')) {
      return `1. What this likely means
You want to know whether your website is easy for Google, ChatGPT, Gemini and other AI tools to understand and recommend.

2. What could be causing weak AI readiness
Common gaps include unclear service pages, thin content, missing FAQ sections, weak page titles, no structured service hierarchy, poor internal links, missing schema, weak trust signals, or content that sounds too generic.

3. What you can check first
Have you checked if each service has its own clear page? Can a new visitor understand what you do, who you help, where you operate, and how to contact you within a few seconds? Also check if your sitemap, robots.txt and Search Console are active.

4. When to ask Axon
Ask Axon if you want an AI-ready website review, GEO/AEO improvement, service page restructuring or llms.txt guidance. If you want Axon to assist, fill in the form on this page or use WhatsApp for immediate support.`;
    }
    if (text.includes('ai chatbot') || text.includes('chatbot') || text.includes('automation')) {
      return `1. What this likely means
You are considering an AI chatbot or automation for your website or business process.

2. What could be involved
The chatbot may need your service information, FAQs, contact rules, handover process, privacy boundaries, lead capture fields, and a clear decision on what it should and should not answer.

3. What you can check first
Have you prepared your service list, common questions, pricing rules, and escalation process? Decide whether the chatbot should only guide visitors, collect leads, or connect to business systems.

4. When to ask Axon
Ask Axon if the chatbot needs to support enquiries, website content, WhatsApp follow-up, forms, automation or AI-ready knowledge. If you want Axon to assist, fill in the form on this page or use WhatsApp for immediate support.`;
    }

    return `1. What this likely means
This sounds like a website, hosting, form, platform, support or AI-related issue that needs a clearer look before deciding the right solution.

2. What could be causing it
Possible causes may include website setup, hosting performance, domain/DNS, email routing, form settings, platform limits, outdated design, missing tracking, or unclear content structure.

3. What you can check first
Have you checked which page or platform is affected, when it started, and whether the issue happens on mobile, desktop, or both? Prepare the website URL, screenshots, error messages and what you expected to happen.

4. When to ask Axon
Ask Axon if the issue affects enquiries, website trust, email delivery, speed, SEO, AI readiness, hosting or business operations. If you want Axon to assist, fill in the form on this page or use WhatsApp for immediate support.`;
  }

  async function askAxonAgent(question) {
    const cleanedQuestion = question.trim();
    if (!cleanedQuestion) return;

    appendAxonAgentMessage('user', cleanedQuestion);
    const pendingMessage = appendAxonAgentMessage('agent', 'Thinking...');

    const kimReply = await requestKimiAgentReply(cleanedQuestion);
    const reply = isWeakAgentReply(cleanedQuestion, kimReply) ? getAxonAgentFallbackReply(cleanedQuestion) : kimReply;

    if (pendingMessage) {
      const body = pendingMessage.querySelector('p');
      if (body) {
        body.textContent = reply;
      }
    }
  }

  if (axonAgentForm && axonAgentInput && axonAgentMessages) {
    axonAgentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      askAxonAgent(axonAgentInput.value);
      axonAgentInput.value = '';
    });

    axonAgentSuggestionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        askAxonAgent(button.getAttribute('data-agent-question') || button.textContent);
      });
    });
  }

  // 4. Canvas Particle Animation Engine (Futuristic Holographic Circuit Grid & Interactive HUD)
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX, mouseY;
    
    // Shuffled array of sampled coordinates from logo.png
    let logoPoints = [];
    
    // Load and sample the logo image for the logo morph target
    const logoImg = new Image();
    logoImg.src = 'logo.png';
    logoImg.onload = () => {
      const sampleCanvas = document.createElement('canvas');
      const sampleCtx = sampleCanvas.getContext('2d');
      
      const sWidth = 160;
      const sHeight = Math.round((logoImg.height / logoImg.width) * sWidth);
      sampleCanvas.width = sWidth;
      sampleCanvas.height = sHeight;
      
      sampleCtx.drawImage(logoImg, 0, 0, sWidth, sHeight);
      try {
        const imgData = sampleCtx.getImageData(0, 0, sWidth, sHeight).data;
        const tempPoints = [];
        
        for (let y = 0; y < sHeight; y += 4) {
          for (let x = 0; x < sWidth; x += 4) {
            const idx = (y * sWidth + x) * 4;
            const alpha = imgData[idx + 3];
            if (alpha > 120) {
              tempPoints.push({
                x: (x - sWidth / 2) / sWidth,
                y: (y - sHeight / 2) / sWidth // preserve aspect ratio scale
              });
            }
          }
        }
        logoPoints = tempPoints.sort(() => Math.random() - 0.5);
      } catch (err) {
        console.error('Error sampling logo.png:', err);
      }
    };

    const gridSize = 65;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    // Setup active trace paths on circuit board
    const traceCount = 14;
    const activeTraces = [];
    
    class CircuitTrace {
      constructor() {
        this.reset();
      }
      
      reset() {
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);
        this.col = Math.floor(Math.random() * (cols - 2)) + 1;
        this.row = Math.floor(Math.random() * (rows - 2)) + 1;
        this.nodes = [{ col: this.col, row: this.row }];
        
        let dirX = Math.random() < 0.5 ? (Math.random() < 0.5 ? 1 : -1) : 0;
        let dirY = dirX === 0 ? (Math.random() < 0.5 ? 1 : -1) : 0;
        
        const length = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < length; i++) {
          if (i > 0 && Math.random() < 0.4) {
            const temp = dirX;
            dirX = dirY;
            dirY = -temp;
          }
          this.col += dirX;
          this.row += dirY;
          if (this.col < 0 || this.col >= cols || this.row < 0 || this.row >= rows) break;
          this.nodes.push({ col: this.col, row: this.row });
        }
        
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.25 + 0.08;
        this.state = 'FADE_IN';
        this.life = Math.random() * 300 + 150;
      }
      
      update() {
        if (this.state === 'FADE_IN') {
          this.opacity += 0.005;
          if (this.opacity >= this.maxOpacity) {
            this.opacity = this.maxOpacity;
            this.state = 'ACTIVE';
          }
        } else if (this.state === 'ACTIVE') {
          this.life--;
          if (this.life <= 0) this.state = 'FADE_OUT';
        } else if (this.state === 'FADE_OUT') {
          this.opacity -= 0.005;
          if (this.opacity <= 0) this.reset();
        }
      }
      
      draw() {
        if (this.nodes.length < 2) return;
        ctx.strokeStyle = `rgba(0, 48, 135, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.nodes[0].col * gridSize, this.nodes[0].row * gridSize);
        for (let i = 1; i < this.nodes.length; i++) {
          ctx.lineTo(this.nodes[i].col * gridSize, this.nodes[i].row * gridSize);
        }
        ctx.stroke();
      }
    }

    for (let i = 0; i < traceCount; i++) {
      activeTraces.push(new CircuitTrace());
    }

    // Nodes (particles) that travel along the board and morph into blueprint shapes
    const particleCount = 120;
    const particles = [];
    const colors = [
      { h: 220, s: 90, l: 60 }, // Royal Blue
      { h: 260, s: 90, l: 65 }, // Violet/Indigo
      { h: 300, s: 90, l: 60 }, // Magenta/Purple
      { h: 0,   s: 90, l: 60 }, // Red
      { h: 25,  s: 95, l: 60 }, // Orange
      { h: 45,  s: 95, l: 55 }  // Yellow
    ];

    class Particle {
      constructor(id) {
        this.id = id;
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.state = 'FLOAT'; // 'FLOAT' or 'MORPH'
        this.currentShape = 'float';
        
        // Circuit traveling variables
        this.trace = activeTraces[this.id % activeTraces.length];
        this.nodeIndex = 0;
        this.speed = Math.random() * 1.5 + 1.0;
        
        this.size = Math.random() * 2.5 + 1.0;
        this.color = colors[this.id % colors.length];
        
        this.trail = [];
        this.maxTrail = 6;
        
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.4 + 0.15;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
      }

      morphTo(shapeName) {
        this.currentShape = shapeName;
        if (shapeName === 'float') {
          this.state = 'FLOAT';
          // Re-attach to nearest trace
          this.trace = activeTraces[Math.floor(Math.random() * activeTraces.length)];
          this.nodeIndex = 0;
        } else {
          this.state = 'MORPH';
        }
      }

      update(time) {
        if (this.alpha < this.maxAlpha) {
          this.alpha += this.fadeSpeed;
        }

        // Maintain movement trails
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
          this.trail.shift();
        }

        if (this.state === 'FLOAT') {
          // Flow along circuit traces
          if (this.trace && this.trace.nodes.length >= 2) {
            const nextNode = this.trace.nodes[this.nodeIndex + 1];
            if (!nextNode) {
              // Reached end of path, bind to another active path
              this.trace = activeTraces[Math.floor(Math.random() * activeTraces.length)];
              this.nodeIndex = 0;
            } else {
              const targetX = nextNode.col * gridSize;
              const targetY = nextNode.row * gridSize;
              
              const dx = targetX - this.x;
              const dy = targetY - this.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist <= this.speed) {
                this.x = targetX;
                this.y = targetY;
                this.nodeIndex++;
              } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
              }
            }
          } else {
            // Fallback: simple floating
            this.x += this.speed;
            if (this.x > width) this.x = 0;
          }

          // Mouse push/repel effect
          if (mouseX !== undefined && mouseY !== undefined) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const force = (120 - dist) / 120;
              this.x += (dx / dist) * force * 5;
              this.y += (dy / dist) * force * 5;
            }
          }
        } 
        else if (this.state === 'MORPH') {
          let shapeCoord = { x: 0, y: 0 };
          const minDim = Math.min(width, height);
          
          if (this.currentShape === 'circle') {
            const theta = (this.id / particleCount) * Math.PI * 2 + (time * 0.0003);
            const radius = minDim * 0.22;
            shapeCoord.x = width / 2 + Math.cos(theta) * radius;
            shapeCoord.y = height / 2 + Math.sin(theta) * radius;
          } 
          else if (this.currentShape === 'wave') {
            const theta = (this.id / particleCount) * Math.PI * 2 + (time * 0.0004);
            const scale = minDim * 0.28;
            const denom = 1 + Math.sin(theta) * Math.sin(theta);
            shapeCoord.x = width / 2 + (scale * Math.cos(theta)) / denom;
            shapeCoord.y = height / 2 + (scale * Math.sin(theta) * Math.cos(theta)) / denom;
          } 
          else if (this.currentShape === 'grid') {
            const cols = Math.ceil(Math.sqrt(particleCount));
            const col = this.id % cols;
            const row = Math.floor(this.id / cols);
            const gridSpacingX = minDim * 0.055;
            const gridSpacingY = minDim * 0.045;
            const totalWidth = cols * gridSpacingX;
            const totalHeight = Math.ceil(particleCount / cols) * gridSpacingY;
            const waveOffset = Math.sin((time * 0.003) + col) * 8;
            
            shapeCoord.x = (width / 2 - totalWidth / 2) + col * gridSpacingX;
            shapeCoord.y = (height / 2 - totalHeight / 2) + row * gridSpacingY + waveOffset;
          } 
          else if (this.currentShape === 'cross') {
            const segment = Math.floor(this.id / (particleCount / 4));
            const subIdx = this.id % Math.floor(particleCount / 4);
            const subTotal = Math.floor(particleCount / 4);
            const t = (subIdx / subTotal - 0.5) * (minDim * 0.4);
            
            if (segment === 0) {
              shapeCoord.x = width / 2 + t;
              shapeCoord.y = height / 2;
            } else if (segment === 1) {
              shapeCoord.x = width / 2;
              shapeCoord.y = height / 2 + t;
            } else {
              const theta = (this.id / particleCount) * Math.PI * 2 + (time * 0.0005);
              shapeCoord.x = width / 2 + Math.cos(theta) * (minDim * 0.28);
              shapeCoord.y = height / 2 + Math.sin(theta) * (minDim * 0.28);
            }
          } 
          else if (this.currentShape === 'logo' && logoPoints.length > 0) {
            const pIdx = this.id % logoPoints.length;
            const logoScale = minDim * 2.2;
            shapeCoord.x = width / 2 + logoPoints[pIdx].x * logoScale;
            shapeCoord.y = height / 2 + logoPoints[pIdx].y * logoScale;
          }
          else {
            shapeCoord.x = width / 2;
            shapeCoord.y = height / 2;
          }

          // Smooth interpolation
          this.x += (shapeCoord.x - this.x) * 0.06;
          this.y += (shapeCoord.y - this.y) * 0.06;
        }
      }

      draw() {
        // Draw path trail
        for (let i = 0; i < this.trail.length; i++) {
          const ratio = i / this.trail.length;
          const factor = this.state === 'FLOAT' ? (this.trace ? this.trace.opacity : 0.1) : 0.3;
          ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${ratio * this.alpha * factor * 2.5})`;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, this.size * ratio, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node head
        const factor = this.state === 'FLOAT' ? (this.trace ? this.trace.opacity : 0.1) : 0.4;
        ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${this.alpha * factor * 3.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Spawn nodes
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(i));
    }

    // Trigger shape changes
    let morphTimeout = null;
    function triggerMorph(shapeName) {
      if (morphTimeout) clearTimeout(morphTimeout);
      particles.forEach(p => p.morphTo(shapeName));
      if (shapeName !== 'float' && shapeName !== 'logo') {
        morphTimeout = setTimeout(() => {
          particles.forEach(p => p.morphTo('float'));
        }, 2500);
      }
    }

    // Setup tabs listeners
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        if (targetTab === 'webdev') triggerMorph('circle');
        else if (targetTab === 'ai') triggerMorph('wave');
        else if (targetTab === 'hosting') triggerMorph('grid');
        else if (targetTab === 'support') triggerMorph('cross');
      });
    });

    // Dropdown listeners
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        if (targetTab === 'webdev') triggerMorph('circle');
        else if (targetTab === 'ai') triggerMorph('wave');
        else if (targetTab === 'hosting') triggerMorph('grid');
        else if (targetTab === 'support') triggerMorph('cross');
      });
    });

    // Hover triggers
    const hoverMorphSelectors = [
      '.navbar .logo', 
      '.footer .logo', 
      '.btn-hero-pill-primary', 
      '.btn-hero-pill-secondary',
      '.btn-nav-pill'
    ];
    hoverMorphSelectors.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) {
        el.addEventListener('mouseenter', () => triggerMorph('logo'));
        el.addEventListener('mouseleave', () => triggerMorph('float'));
      }
    });

    // Track mouse coordinates
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) {
      heroSec.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      heroSec.addEventListener('mouseleave', () => {
        mouseX = undefined;
        mouseY = undefined;
      });
    }

    let animationFrameId;
    let isAnimating = true;
    let startTime = Date.now();

    function loop() {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, width, height);

      const elapsed = Date.now() - startTime;
      
      const cols = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);

      // 1. Draw coordinate crosshair grid watermark
      ctx.strokeStyle = 'rgba(0, 48, 135, 0.04)';
      ctx.lineWidth = 0.8;
      for (let c = 1; c < cols; c++) {
        for (let r = 1; r < rows; r++) {
          const x = c * gridSize;
          const y = r * gridSize;
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }

      // 2. Update and draw circuit traces
      activeTraces.forEach(t => {
        t.update();
        t.draw();
      });

      // 3. Update and draw nodes (particles)
      particles.forEach(p => {
        p.update(elapsed);
        p.draw();
      });

      // 4. In MORPH mode, draw vector blueprint lines connecting nearby nodes
      let inMorph = particles.some(p => p.state === 'MORPH');
      if (inMorph) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Connect only within blueprint cluster radius
            if (dist < 42) {
              const lineAlpha = (1 - (dist / 42)) * 0.18;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 48, 135, ${lineAlpha * p1.alpha * p2.alpha * 3.5})`;
              ctx.stroke();
            }
          }
        }
      }

      // 5. Draw cursor sweep radar HUD
      if (mouseX !== undefined && mouseY !== undefined) {
        // Draw radar sweep circle
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.16)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 160, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(16, 185, 129, 0.005)';
        ctx.fill();
        
        // Draw coordinate details for junctions inside scanner radius
        for (let c = 1; c < cols; c++) {
          for (let r = 1; r < rows; r++) {
            const x = c * gridSize;
            const y = r * gridSize;
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 160) {
              const ratio = 1 - (dist / 160);
              
              // Node ring
              ctx.strokeStyle = `rgba(16, 185, 129, ${ratio * 0.35})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.arc(x, y, 5 + ratio * 3, 0, Math.PI * 2);
              ctx.stroke();
              
              // Coordinates text label
              ctx.fillStyle = `rgba(16, 185, 129, ${ratio * 0.45})`;
              ctx.font = '7px monospace';
              ctx.fillText(`c${c}.r${r}`, x + 6, y - 4);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isAnimating = true;
          loop();
        } else {
          isAnimating = false;
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(heroSec);
  }

  // 3. Rotating Hero Titles Interactivity
  const heroTitles = [
    [
      "Every day brings a new technology trend.",
      "Axon helps you focus on the ones that actually matter."
    ],
    [
      "Focus on running your business.",
      "Let Axon review, plan and support the technology, web and AI decisions behind it."
    ],
    [
      "Too many technology and AI choices?",
      "Axon helps you make sense of it, plan wisely, and implement what truly matters."
    ],
    [
      "Technology and AI are evolving faster than ever.",
      "Axon helps your business navigate the noise and focus on results."
    ],
    [
      "Confused by the endless stream of AI and technology tools?",
      "Axon helps you choose the right solutions and avoid costly mistakes."
    ],
    [
      "Don't let technology overwhelm your business.",
      "Let Axon simplify, plan and execute your digital journey."
    ],
    [
      "The challenge isn't technology. It's knowing what to do next.",
      "Axon helps businesses turn complexity into opportunity."
    ],
    [
      "AI is changing how business works.",
      "Axon helps you understand it, adopt it, and benefit from it."
    ],
    [
      "Technology, websites, cloud, cybersecurity, AI. Where do you start?",
      "Start with Axon. We help you plan, implement and grow with confidence."
    ]
  ];

  const titleEl = document.getElementById('heroTitle');
  const line1El = document.getElementById('heroTitleLine1');
  const line2El = document.getElementById('heroTitleLine2');
  const container1El = document.getElementById('heroTitleLineContainer1');
  const container2El = document.getElementById('heroTitleLineContainer2');

  function checkAndSetupMarquee(lineEl, containerEl, lineNumber) {
    if (!lineEl || !containerEl) return;
    
    lineEl.classList.remove('scroll-active-1', 'scroll-active-2');
    lineEl.style.removeProperty('--scroll-dist');
    containerEl.style.justifyContent = 'center';
    
    void lineEl.offsetHeight; // Force reflow
    
    const containerWidth = containerEl.clientWidth;
    const textWidth = lineEl.scrollWidth;
    
    if (textWidth > containerWidth) {
      const overflow = textWidth - containerWidth + 24; // extra breathing room
      containerEl.style.justifyContent = 'flex-start';
      lineEl.style.setProperty('--scroll-dist', `-${overflow}px`);
      lineEl.classList.add(`scroll-active-${lineNumber}`);
    } else {
      containerEl.style.justifyContent = 'center';
    }
  }

  if (titleEl && line1El && line2El && container1El && container2El) {
    let currentIndex = 0;
    const intervalTime = 11000; // 11 seconds cycle time (comfortable scroll and read duration)
    let rotationInterval = null;
    let line2Timeout = null;

    // Helper to reveal Line 2 after a delay
    function revealLine2() {
      container2El.classList.add('line-hidden');
      if (line2Timeout) clearTimeout(line2Timeout);
      
      line2Timeout = setTimeout(() => {
        container2El.classList.remove('line-hidden');
        // Check for horizontal scroll requirements on Line 2 once it enters
        checkAndSetupMarquee(line2El, container2El, 2);
      }, 2500); // 2.5 seconds delay (reveals after Line 1 is read)
    }

    // Navigation function
    function navigateTitle(direction) {
      titleEl.classList.add('fade-out');
      
      setTimeout(() => {
        currentIndex = (currentIndex + direction + heroTitles.length) % heroTitles.length;
        line1El.textContent = heroTitles[currentIndex][0];
        line2El.textContent = heroTitles[currentIndex][1];
        
        // Reset Line 2 visibility for the next tagline
        container2El.classList.add('line-hidden');
        
        titleEl.classList.remove('fade-out');
        titleEl.classList.add('fade-in-prep');
        
        // Force DOM reflow
        void titleEl.offsetHeight;
        
        titleEl.classList.remove('fade-in-prep');
        
        // Check Line 1 marquee immediately
        checkAndSetupMarquee(line1El, container1El, 1);
        
        // Reveal Line 2 after delay
        revealLine2();
      }, 500);
    }

    // Auto rotation management
    function startAutoRotation() {
      if (rotationInterval) clearInterval(rotationInterval);
      rotationInterval = setInterval(() => {
        navigateTitle(1);
      }, intervalTime);
    }

    // Initial setup
    checkAndSetupMarquee(line1El, container1El, 1);
    revealLine2();
    startAutoRotation();

    // Bind Arrow Buttons manual controls
    const prevBtn = document.getElementById('prevTitle');
    const nextBtn = document.getElementById('nextTitle');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        navigateTitle(-1);
        startAutoRotation(); // reset auto-rotation timer
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        navigateTitle(1);
        startAutoRotation(); // reset auto-rotation timer
      });
    }
    
    // Handle viewport resize dynamically
    window.addEventListener('resize', () => {
      checkAndSetupMarquee(line1El, container1El, 1);
      checkAndSetupMarquee(line2El, container2El, 2);
    });
  }

  // 4. Static Category Tagline Rotation & Click Modal Binding
  const categoryTaglines = {
    "Technology & AI Advisory": "Helping business leaders navigate technology and AI with confidence.",
    "Websites & Digital Presence": "Professional websites, portals and online solutions that support business growth.",
    "AI & Business Automation": "Practical AI solutions that improve productivity and reduce manual work.",
    "Cloud & Email Solutions": "Modern workplace solutions that help teams work smarter.",
    "Hosting, Domains & Infrastructure": "Reliable digital infrastructure that keeps your business running.",
    "Security, Recovery & Performance": "Protecting your business and ensuring continuity."
  };
  const categoryList = Object.keys(categoryTaglines);

  const activeCategoryEl = document.getElementById('activeCategory');
  const activeCategorySpan = activeCategoryEl ? activeCategoryEl.querySelector('span') : null;
  const tickerDropdown = document.getElementById('tickerDropdown');
  const dropdownItems = document.querySelectorAll('.ticker-dropdown-item');
  const tickerDescription = document.getElementById('tickerDescription');

  let activeCategoryFilter = 'all'; // 'all' or specific category name
  let currentRotationIndex = 0;
  let rotationInterval = null;
  const ROTATION_TIME = 6000; // 6 seconds per category

  // Smooth fade transition helper
  function updateTickerText(taglineText) {
    if (!tickerDescription) return;
    tickerDescription.classList.add('fade-out');
    setTimeout(() => {
      tickerDescription.textContent = taglineText;
      tickerDescription.classList.remove('fade-out');
    }, 300);
  }

  // Start category tagline rotation
  function startRotation() {
    if (rotationInterval) clearInterval(rotationInterval);
    
    rotationInterval = setInterval(() => {
      if (activeCategoryFilter !== 'all') return;
      
      currentRotationIndex = (currentRotationIndex + 1) % categoryList.length;
      const nextCat = categoryList[currentRotationIndex];
      
      if (activeCategorySpan) {
        activeCategorySpan.textContent = nextCat;
      }
      updateTickerText(categoryTaglines[nextCat]);
    }, ROTATION_TIME);
  }

  // Stop category tagline rotation
  function stopRotation() {
    if (rotationInterval) {
      clearInterval(rotationInterval);
      rotationInterval = null;
    }
  }

  // Bind click listener for tagline itself (to open modal)
  if (tickerDescription) {
    tickerDescription.addEventListener('click', () => {
      const currentCat = activeCategorySpan ? activeCategorySpan.textContent : 'Services';
      const currentTagline = tickerDescription.textContent.trim();
      openContactModal(`Hi Axon team,\n\nI am interested in learning more about your services under "${currentCat}":\n"${currentTagline}"\n\nPlease let me know how we can proceed.`);
    });
  }

  // 5. Category Dropdown & Manual Select Lock Logic
  if (activeCategoryEl && tickerDropdown) {
    // Click red badge -> Toggle dropdown
    activeCategoryEl.addEventListener('click', (e) => {
      activeCategoryEl.classList.toggle('open');
      tickerDropdown.classList.toggle('open');
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (activeCategoryEl && !activeCategoryEl.contains(e.target)) {
        activeCategoryEl.classList.remove('open');
        tickerDropdown.classList.remove('open');
      }
    });

    // Handle dropdown category selection
    dropdownItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent re-triggering parent click handler
        
        const selectedCat = btn.getAttribute('data-cat');
        activeCategoryFilter = selectedCat;

        // Toggle active class on dropdown buttons
        dropdownItems.forEach(item => item.classList.remove('active'));
        btn.classList.add('active');

        // Close dropdown
        activeCategoryEl.classList.remove('open');
        tickerDropdown.classList.remove('open');

        if (selectedCat === 'all') {
          // Reset to default and resume auto-rotation
          if (activeCategorySpan) activeCategorySpan.textContent = 'Technology & AI Advisory';
          currentRotationIndex = 0;
          updateTickerText(categoryTaglines['Technology & AI Advisory']);
          startRotation();
        } else {
          // Lock to specific category and stop rotation
          stopRotation();
          const decodedCat = selectedCat.replace(/&amp;/g, '&');
          if (activeCategorySpan) activeCategorySpan.textContent = decodedCat;
          updateTickerText(categoryTaglines[decodedCat] || '');
        }
      });
    });
  }

  // Initial loop startup
  if (tickerDescription && activeCategorySpan) {
    activeCategorySpan.textContent = 'Technology & AI Advisory';
    tickerDescription.textContent = categoryTaglines['Technology & AI Advisory'];
    startRotation();
  }
});






