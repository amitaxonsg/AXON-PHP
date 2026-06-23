#!/usr/bin/env python3
"""Update Axon service pages with topic-specific questions, help links, SEO/GEO/AEO metadata, social sharing tags and selected visual fixes.

This script is deterministic and does not call any AI API.
It is designed for static HTML service pages in the repository root.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://axon.com.sg"
DEFAULT_SOCIAL_IMAGE = f"{SITE}/dashboard_preview.png"

COMMON_KEYWORDS = [
    "Axon 1ProIT",
    "Singapore technology consultant",
    "Philippines IT consultant",
    "SME technology advisory",
    "business technology support",
    "AI-ready website",
    "Generative Engine Optimization",
    "Answer Engine Optimization",
    "AI search visibility",
]

SERVICE_PAGES = [
    "technology-strategy-planning.html", "ai-readiness-adoption.html", "digital-transformation.html",
    "technology-assessments.html", "executive-advisory.html", "ai-tool-platform-selection.html",
    "corporate-websites.html", "website-optimization-audit.html", "website-revamps-modernization.html",
    "wix-website-support.html", "e-commerce-solutions.html", "shopify-store-support.html",
    "customer-member-portals.html", "business-applications.html", "mobile-app-technical-assistance.html",
    "website-maintenance-support.html", "ai-website-app-publishing.html", "website-ai-chatbot.html",
    "google-workspace-solutions.html", "microsoft-365-solutions.html", "business-email-solutions.html",
    "cloud-migration-services.html", "document-collaboration-platforms.html", "productivity-solutions.html",
    "corporate-hosting.html", "cloud-hosting-solutions.html", "domain-registration-management.html",
    "business-email-hosting.html", "server-setup-deployment.html", "server-management-monitoring.html",
    "application-deployment.html", "infrastructure-planning.html",
    "ai-consulting-implementation.html", "ai-assistants-for-business.html", "company-ai-workspaces.html",
    "ai-writing-content-assistant.html", "business-process-automation.html", "workflow-automation.html",
    "whatsapp-marketing-automation.html", "private-ai-solutions.html",
    "website-security.html", "website-recovery.html", "malware-removal.html", "backup-disaster-recovery.html",
    "performance-optimization.html", "website-monitoring-health-checks.html",
    "business-growth-operations-support.html", "seo-local-business-visibility.html",
]

AI_SEARCH_PAGES = [
    "ai-search-visibility.html",
    "ai-ready-website.html",
    "llm-friendly-content-architecture.html",
    "generative-engine-optimization.html",
    "answer-engine-optimization.html",
    "seo-sem-geo-aeo.html",
]

CORE_PAGES_FOR_SOCIAL = [
    "index.html", "contact.html", "credit-top-up.html", "credit-success.html",
    "company-profile.html", "why-axon.html", "our-approach.html", "our-clients.html",
    "testimonials.html", "experience.html", "infrastructure.html", "use-cases.html",
    "trending/index.html",
]

GROUPS = {
    "advisory": ["technology-strategy-planning.html", "ai-readiness-adoption.html", "digital-transformation.html", "technology-assessments.html", "executive-advisory.html", "ai-tool-platform-selection.html"],
    "website": ["corporate-websites.html", "website-optimization-audit.html", "website-revamps-modernization.html", "wix-website-support.html", "e-commerce-solutions.html", "shopify-store-support.html", "customer-member-portals.html", "business-applications.html", "mobile-app-technical-assistance.html", "website-maintenance-support.html", "ai-website-app-publishing.html", "website-ai-chatbot.html"],
    "cloud_email": ["google-workspace-solutions.html", "microsoft-365-solutions.html", "business-email-solutions.html", "cloud-migration-services.html", "document-collaboration-platforms.html", "productivity-solutions.html"],
    "hosting": ["corporate-hosting.html", "cloud-hosting-solutions.html", "domain-registration-management.html", "business-email-hosting.html", "server-setup-deployment.html", "server-management-monitoring.html", "application-deployment.html", "infrastructure-planning.html"],
    "automation_ai": ["ai-consulting-implementation.html", "ai-assistants-for-business.html", "company-ai-workspaces.html", "ai-writing-content-assistant.html", "business-process-automation.html", "workflow-automation.html", "whatsapp-marketing-automation.html", "private-ai-solutions.html"],
    "security": ["website-security.html", "website-recovery.html", "malware-removal.html", "backup-disaster-recovery.html", "performance-optimization.html", "website-monitoring-health-checks.html"],
    "growth": ["business-growth-operations-support.html", "seo-local-business-visibility.html"],
}

HELP = {
    "advisory": [("Technology roadmap", "technology-strategy-planning.html"), ("AI readiness review", "ai-readiness-adoption.html"), ("Digital transformation", "digital-transformation.html"), ("Technology assessment", "technology-assessments.html"), ("Executive advisory", "executive-advisory.html"), ("AI platform selection", "ai-tool-platform-selection.html")],
    "website": [("AI-ready website", "ai-ready-website.html"), ("Website revamp", "website-revamps-modernization.html"), ("Website audit", "website-optimization-audit.html"), ("GEO content structure", "generative-engine-optimization.html"), ("AEO questions", "answer-engine-optimization.html"), ("Website AI chatbot", "website-ai-chatbot.html"), ("Website maintenance", "website-maintenance-support.html")],
    "cloud_email": [("Google Workspace setup", "google-workspace-solutions.html"), ("Microsoft 365 migration", "microsoft-365-solutions.html"), ("Business email issue", "business-email-solutions.html"), ("Email hosting", "business-email-hosting.html"), ("Cloud migration", "cloud-migration-services.html"), ("Document sharing", "document-collaboration-platforms.html")],
    "hosting": [("Corporate hosting", "corporate-hosting.html"), ("Cloud hosting", "cloud-hosting-solutions.html"), ("Domain and DNS", "domain-registration-management.html"), ("Business email hosting", "business-email-hosting.html"), ("Server deployment", "server-setup-deployment.html"), ("Monitoring", "server-management-monitoring.html")],
    "automation_ai": [("AI consulting", "ai-consulting-implementation.html"), ("AI assistants", "ai-assistants-for-business.html"), ("Website AI chatbot", "website-ai-chatbot.html"), ("Company AI workspace", "company-ai-workspaces.html"), ("Business automation", "business-process-automation.html"), ("Workflow automation", "workflow-automation.html")],
    "security": [("Website security", "website-security.html"), ("Website recovery", "website-recovery.html"), ("Malware removal", "malware-removal.html"), ("Backup recovery", "backup-disaster-recovery.html"), ("Speed optimization", "performance-optimization.html"), ("Website monitoring", "website-monitoring-health-checks.html")],
    "growth": [("SEO and local visibility", "seo-local-business-visibility.html"), ("SEO SEM GEO AEO", "seo-sem-geo-aeo.html"), ("Google Business Profile", "business-growth-operations-support.html#google-business-profile"), ("Analytics setup", "business-growth-operations-support.html#analytics-search-console"), ("CRM lead tracking", "business-growth-operations-support.html#crm-leads"), ("Payment gateway", "business-growth-operations-support.html#payment-gateway")],
}

SPECIAL_TERMS = {
    "corporate-websites.html": ["AI-ready website", "corporate website Singapore", "LLM-friendly service pages", "business website development", "conversion-focused UX"],
    "website-revamps-modernization.html": ["website revamp", "website modernization", "Generative Engine Optimization", "Answer Engine Optimization", "AI search visibility"],
    "website-optimization-audit.html": ["website speed optimization", "SEO audit", "AI search audit", "Core Web Vitals", "website not found on Google"],
    "website-ai-chatbot.html": ["AI chatbot for business website", "lead capture chatbot", "website AI assistant", "Kimi API chatbot", "human handoff"],
    "google-workspace-solutions.html": ["Google Workspace setup Singapore", "Gmail business email", "Google Drive migration", "Google Admin support"],
    "microsoft-365-solutions.html": ["migrate email to Microsoft 365", "Exchange Online migration", "Outlook business email", "SharePoint support"],
    "business-email-solutions.html": ["website not sending emails", "SPF DKIM DMARC", "email going to spam", "contact form email issue"],
    "business-email-hosting.html": ["business email hosting", "cPanel email hosting", "webmail support", "SMTP IMAP setup", "SPF DKIM DMARC"],
    "website-security.html": ["website hacked cleanup", "WordPress security", "website hardening", "malware prevention"],
    "malware-removal.html": ["website hacked cleanup", "malware removal", "blacklist warning", "suspicious redirects"],
    "performance-optimization.html": ["website speed optimization", "slow website fix", "Core Web Vitals", "image optimization"],
    "business-process-automation.html": ["business process automation", "approval workflow", "manual task automation", "CRM automation"],
    "workflow-automation.html": ["workflow automation", "n8n automation", "Zapier automation", "email follow-up automation"],
    "seo-local-business-visibility.html": ["SEO", "local SEO", "Google Business Profile", "AI search visibility", "AEO"],
}

AI_READY_SECTION = '''<div class="axon-standard-section" data-ai-ready-section="true"><div class="axon-standard-section-head"><span class="axon-standard-kicker">AI Search Era</span><h2>Built for Google, AI search and business conversion</h2></div><div class="axon-standard-card-grid"><article class="axon-standard-card"><span>AI-ready</span><h3>LLM-friendly content architecture</h3><p>Axon structures service pages so customers, Google and AI assistants can understand what you offer, who you help and why your company should be trusted.</p></article><article class="axon-standard-card"><span>GEO</span><h3>Generative Engine Optimization</h3><p>We organize clear service explanations, proof points and internal links so AI-generated answers have better context when describing your business.</p></article><article class="axon-standard-card"><span>AEO</span><h3>Answer Engine Optimization</h3><p>We add direct, topic-specific questions and answers so visitors and AI answer engines can understand your services without technical confusion.</p></article></div></div>'''

AI_NAV_INSERTION = '''<a class="mega-menu-link" href="seo-local-business-visibility.html">SEO &amp; Local Visibility</a>
<a class="mega-menu-link" href="ai-search-visibility.html">AI Search Visibility <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#003087;color:#fff;font-size:10px;letter-spacing:.06em;">NEW</span></a>
<a class="mega-menu-link" href="ai-ready-website.html">AI-Ready Website <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#003087;color:#fff;font-size:10px;letter-spacing:.06em;">NEW</span></a>
<a class="mega-menu-link" href="llm-friendly-content-architecture.html">LLM-Friendly Content Architecture <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#003087;color:#fff;font-size:10px;letter-spacing:.06em;">NEW</span></a>
<a class="mega-menu-link" href="generative-engine-optimization.html">Generative Engine Optimization (GEO) <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#003087;color:#fff;font-size:10px;letter-spacing:.06em;">NEW</span></a>
<a class="mega-menu-link" href="answer-engine-optimization.html">Answer Engine Optimization (AEO) <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#003087;color:#fff;font-size:10px;letter-spacing:.06em;">NEW</span></a>
<a class="mega-menu-link" href="seo-sem-geo-aeo.html">SEO, SEM, GEO &amp; AEO</a>'''


def e(value: str) -> str:
    return html.escape(str(value), quote=True)


def title_from_html(content: str, filename: str) -> str:
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.I | re.S)
    if h1:
        return re.sub(r"<.*?>", "", h1.group(1)).strip()
    title = re.search(r"<title>(.*?)</title>", content, re.I | re.S)
    if title:
        return title.group(1).split("|")[0].strip()
    return filename.replace(".html", "").replace("-", " ").title()


def meta_value(content: str, name: str) -> str | None:
    m = re.search(rf'<meta\s+[^>]*name="{re.escape(name)}"[^>]*content="([^"]*)"[^>]*>', content, re.I)
    if not m:
        m = re.search(rf'<meta\s+[^>]*content="([^"]*)"[^>]*name="{re.escape(name)}"[^>]*>', content, re.I)
    return html.unescape(m.group(1)).strip() if m else None


def trim_sentence(text: str, limit: int = 155) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(" ,.;:-")
    return cut if len(cut) >= 80 else text[:limit].rstrip(" ,.;:-")


def page_url(filename: str) -> str:
    if filename == "index.html":
        return SITE + "/"
    if filename.endswith("/index.html"):
        return SITE + "/" + filename[:-10]
    return f"{SITE}/{filename}"


def group_for(filename: str) -> str:
    for group, files in GROUPS.items():
        if filename in files:
            return group
    return "website"


def questions_for(filename: str, title: str, group: str) -> list[tuple[str, str, str]]:
    if filename == "corporate-websites.html":
        return [
            ("AI-ready", "Is our current corporate website ready for AI search?", "Axon reviews whether your services, proof points, FAQs and contact paths are clear enough for Google, ChatGPT, Gemini and Copilot-style discovery."),
            ("Services", "Can AI assistants understand what our company actually does?", "We restructure service pages so each page explains the client problem, solution, audience, outcome and next action in plain business language."),
            ("SEO", "Can we improve SEO without losing the clean modern design?", "Yes. We keep the visual experience clean while improving titles, descriptions, headings, internal links, sitemap and answer-ready content."),
            ("Conversion", "Why do visitors browse but not enquire?", "We check calls-to-action, contact forms, WhatsApp links, trust signals, mobile layout and the enquiry journey."),
            ("Revamp", "Do we need a full redesign or only content restructuring?", "Axon separates design, content, hosting, SEO, GEO and AEO fixes so the scope stays practical."),
            ("Support", "Can Axon build, host and maintain the website?", "Yes. We can plan, design, publish, host, secure, maintain and improve the website after launch."),
        ]
    if filename == "business-email-hosting.html":
        return [
            ("Mailboxes", "Can we host business email without using Google or Microsoft 365?", "Yes. Axon can set up business email hosting with webmail, IMAP, SMTP, mailbox quotas and support, depending on your requirements."),
            ("Delivery", "Why are emails going to spam or not reaching clients?", "We check SPF, DKIM, DMARC, DNS, SMTP settings, sender reputation and mailbox configuration."),
            ("Forms", "Can website forms send through our business email?", "Yes. Axon can connect website forms to the correct SMTP or transactional email service so enquiries reach your inbox reliably."),
            ("Security", "How do we reduce spoofing and hacked mailbox risk?", "We review password rules, mailbox access, DNS authentication, forwarding rules and suspicious login behaviour."),
            ("Migration", "Can Axon move old mailboxes to a new email setup?", "We can help plan migration, mailbox creation, DNS cutover and post-migration checks."),
            ("Support", "Can Axon manage the email hosting after setup?", "Yes. We support mailbox issues, DNS changes, password resets, webmail access and delivery troubleshooting."),
        ]
    if group == "website":
        return [
            ("AI search", f"Is {title.lower()} ready for ChatGPT, Gemini and AI answer engines?", "We check whether the page has clear service wording, direct answers, structured sections and internal links that are easier for AI systems and customers to understand."),
            ("SEO", f"Can {title.lower()} still support Google SEO?", "Yes. Axon reviews page titles, meta descriptions, headings, sitemap, speed, indexing and internal links alongside AI-search readiness."),
            ("UX", "Will the page be clear for non-technical business owners?", "We keep the layout clean and explain services in business language, with less jargon and a clearer path to enquiry."),
            ("Conversion", "How can this page generate more enquiries?", "We improve calls-to-action, contact routes, trust signals, service explanation and mobile readability."),
            ("Content", "What content should be added or removed?", "Axon identifies missing service explanations, weak proof points, unclear FAQs and outdated content that may reduce trust."),
            ("Support", "Can Axon revamp, publish and maintain it?", "Yes. We can handle content, design, hosting, forms, analytics, security and ongoing updates."),
        ]
    if group == "cloud_email":
        return [
            ("Setup", f"Which {title.lower()} setup is right for our company?", "Axon reviews current users, mailboxes, files, devices, DNS records and staff habits before recommending the setup."),
            ("Migration", "Can we migrate without losing emails or disrupting staff?", "We plan mailbox creation, DNS cutover, data movement, password access and post-migration checks."),
            ("Delivery", "Why are emails not sending, not receiving or landing in spam?", "We check MX, SPF, DKIM, DMARC, SMTP settings, forwarding rules and mailbox limits."),
            ("Access", "Can staff use this on phones, Outlook and webmail?", "Axon helps configure user access, device setup, admin settings and basic staff guidance."),
            ("Cost", "Are we paying for the right licences or email plan?", "We review licence type, mailbox needs, storage and collaboration features to avoid unnecessary cost."),
            ("Support", "Can Axon support users after setup?", "Yes. We can assist with passwords, mail flow, device setup, Drive/OneDrive access and admin changes."),
        ]
    if group == "hosting":
        return [
            ("Fit", f"Is {title.lower()} suitable for our website, email or app?", "Axon checks traffic, storage, email, database, SSL, backup and support needs before recommending the setup."),
            ("Performance", "Will the setup be fast and stable enough?", "We review server resources, caching, PHP/database needs, DNS, SSL and monitoring requirements."),
            ("Security", "How do we reduce downtime, hacking and configuration risks?", "Axon checks access, backups, firewalls, SSL, updates, passwords and recovery planning."),
            ("Migration", "Can we move from an old host or server safely?", "We plan files, database, DNS, email, SSL, testing and rollback steps before cutover."),
            ("Support", "Who helps when something breaks?", "Axon can provide practical support for websites, hosting, DNS, email, server issues and recovery."),
            ("Cost", "What should we pay for now and what can wait?", "We separate urgent hosting needs from future scaling so the setup remains practical for the business."),
        ]
    if group == "automation_ai":
        return [
            ("Use case", f"Where can {title.lower()} help our business first?", "Axon starts with practical use cases such as enquiries, content, follow-ups, documents, reports, internal knowledge and repetitive admin work."),
            ("Tools", "Should we use ChatGPT, Claude, Gemini, Kimi or another AI tool?", "We compare your work style, privacy needs, budget and integrations before recommending tools."),
            ("Data", "Can AI use our company knowledge safely?", "We review what should be shared, what should stay private, and how to structure company information for better AI answers."),
            ("Workflow", "Can this connect to website forms, WhatsApp, email or documents?", "Where suitable, Axon can help connect AI with practical workflows, while keeping the setup understandable for non-IT teams."),
            ("Adoption", "How do we avoid staff using AI wrongly?", "We help define simple usage rules, prompt guidance, review steps and safe handoff to humans."),
            ("Support", "Can Axon implement and support this?", "Yes. We can advise, set up, test, document, train and support AI or automation workflows."),
        ]
    if group == "security":
        return [
            ("Risk", f"How serious is our {title.lower()} issue?", "Axon checks symptoms, hosting logs, backups, website files, DNS, SSL and user access to understand the risk."),
            ("Recovery", "Can the website be restored without losing data?", "We review available backups, file changes, database condition and safest recovery path before making changes."),
            ("Prevention", "How do we stop the same issue from happening again?", "We help strengthen passwords, updates, backups, monitoring, access control and hosting security."),
            ("SEO", "Will security or downtime affect Google visibility?", "A hacked, slow or down website can affect trust and visibility, so we review search warnings, redirects and index status."),
            ("Speed", "Can security fixes slow down the website?", "We balance protection, performance and usability so fixes do not create new problems for visitors."),
            ("Support", "Can Axon monitor and support the site after cleanup?", "Yes. We can assist with maintenance, monitoring, backups, recovery and ongoing support."),
        ]
    return [
        ("Priority", f"What should we fix first for {title.lower()}?", "Axon separates urgent issues from optional improvements so the work supports real business outcomes."),
        ("Visibility", "Will this improve Google and AI-search visibility?", "We strengthen service clarity, metadata, internal links, questions and structured content where relevant."),
        ("Process", "How will this connect to our daily operations?", "We review current tools, staff workflow, customer journey and support process before recommending changes."),
        ("Cost", "How do we avoid spending on the wrong tools?", "We compare practical options and avoid unnecessary platforms where a simpler setup is enough."),
        ("Support", "Can Axon set up and support it?", "Yes. Axon can advise, configure, document and support the solution for non-IT teams."),
        ("Next step", "What information should we prepare before starting?", "Usually we need your current website, hosting, email, DNS, admin access, business goals and known issues."),
    ]


def help_html(group: str) -> str:
    links = HELP.get(group, HELP["website"])
    return '<div class="axon-search-help"><strong>Common help requests</strong><div>' + ''.join(f'<a href="{e(href)}">{e(label)}</a>' for label, href in links[:8]) + '</div></div>'


def card_html(cards: list[tuple[str, str, str]]) -> str:
    return ''.join(f'<article class="axon-standard-card"><span>{e(label)}</span><h3>{e(question)}</h3><p>{e(answer)}</p></article>' for label, question, answer in cards[:6])


def set_meta(content: str, name: str, value: str) -> str:
    pattern = re.compile(rf'<meta\s+content="[^"]*"\s+name="{re.escape(name)}"\s*/?>|<meta\s+name="{re.escape(name)}"\s+content="[^"]*"\s*/?>', re.I)
    repl = f'<meta name="{name}" content="{e(value)}"/>'
    return pattern.sub(repl, content, count=1) if pattern.search(content) else content.replace('</head>', repl + '\n</head>', 1)


def set_prop(content: str, prop: str, value: str) -> str:
    pattern = re.compile(rf'<meta\s+property="{re.escape(prop)}"\s+content="[^"]*"\s*/?>', re.I)
    repl = f'<meta property="{prop}" content="{e(value)}"/>'
    return pattern.sub(repl, content, count=1) if pattern.search(content) else content.replace('</head>', repl + '\n</head>', 1)


def set_link_rel(content: str, rel: str, href: str) -> str:
    pattern = re.compile(rf'<link\s+rel="{re.escape(rel)}"\s+href="[^"]*"\s*/?>|<link\s+href="[^"]*"\s+rel="{re.escape(rel)}"\s*/?>', re.I)
    repl = f'<link rel="{rel}" href="{e(href)}"/>'
    return pattern.sub(repl, content, count=1) if pattern.search(content) else content.replace('</head>', repl + '\n</head>', 1)


def ensure_social_meta(content: str, filename: str, title: str, description: str) -> str:
    url = page_url(filename)
    image = DEFAULT_SOCIAL_IMAGE
    content = set_link_rel(content, "canonical", url)
    content = set_prop(content, "og:type", "website")
    content = set_prop(content, "og:site_name", "Axon 1ProIT")
    content = set_prop(content, "og:locale", "en_US")
    content = set_prop(content, "og:title", f"{title} | Axon 1ProIT")
    content = set_prop(content, "og:description", description)
    content = set_prop(content, "og:url", url)
    content = set_prop(content, "og:image", image)
    content = set_prop(content, "og:image:secure_url", image)
    content = set_prop(content, "og:image:type", "image/png")
    content = set_meta(content, "twitter:card", "summary_large_image")
    content = set_meta(content, "twitter:title", f"{title} | Axon 1ProIT")
    content = set_meta(content, "twitter:description", description)
    content = set_meta(content, "twitter:url", url)
    content = set_meta(content, "twitter:image", image)
    return content


def faq_schema(title: str, cards: list[tuple[str, str, str]], url: str) -> str:
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for _, q, a in cards], "about": title, "url": url}
    return '<script type="application/ld+json" data-service-faq>' + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + '</script>'


def update_questions(content: str, cards: list[tuple[str, str, str]], filename: str) -> str:
    pattern = re.compile(r'(<div class="axon-standard-section">\s*<div class="axon-standard-section-head"><h2>Top questions clients ask</h2></div>\s*<div class="axon-standard-card-grid">)(.*?)(</div>\s*<div class="axon-standard-note">)', re.S)
    if pattern.search(content):
        return pattern.sub(r'\1' + card_html(cards) + r'\3', content, count=1)
    pattern2 = re.compile(r'(<div class="axon-standard-section">\s*<div class="axon-standard-section-head"><h2>Top questions clients ask</h2></div>\s*<div class="axon-standard-card-grid">)(.*?)(</div>\s*</div>\s*<div class="axon-standard-cta">)', re.S)
    if pattern2.search(content):
        return pattern2.sub(r'\1' + card_html(cards) + r'\3', content, count=1)
    print(f"WARN no questions section found in {filename}")
    return content


def update_help(content: str, group: str, filename: str) -> str:
    pattern = re.compile(r'<div class="axon-search-help"><strong>Common help requests</strong><div>.*?</div></div>', re.S)
    if pattern.search(content):
        return pattern.sub(help_html(group), content, count=1)
    print(f"WARN no common help section found in {filename}")
    return content


def inject_ai_ready(content: str, group: str) -> str:
    if group != "website" or 'data-ai-ready-section="true"' in content:
        return content
    marker = '<div class="axon-standard-section"><div class="axon-standard-section-head"><h2>Top questions clients ask</h2></div>'
    if marker in content:
        return content.replace(marker, AI_READY_SECTION + marker, 1)
    return content


def fix_visual(content: str, filename: str) -> str:
    if filename == "business-email-hosting.html":
        visual = '<div class="axon-standard-visual"><img alt="Business email hosting, mailboxes, DNS and delivery support" src="assets/visuals/business-email-hosting-axon-dashboard.svg"/></div>'
        return re.sub(r'<div class="axon-standard-visual">\s*<img[^>]+>\s*</div>', visual, content, count=1, flags=re.S)
    return content


def update_nav_ai_links(content: str) -> str:
    pattern = re.compile(
        r'<a class="mega-menu-link" href="seo-local-business-visibility.html">SEO &amp; Local Visibility</a>'
        r'(?:\s*<a class="mega-menu-link" href="ai-search-visibility.html">.*?</a>)?'
        r'(?:\s*<a class="mega-menu-link" href="ai-ready-website.html">.*?</a>)?'
        r'(?:\s*<a class="mega-menu-link" href="llm-friendly-content-architecture.html">.*?</a>)?'
        r'(?:\s*<a class="mega-menu-link" href="generative-engine-optimization.html">.*?</a>)?'
        r'(?:\s*<a class="mega-menu-link" href="answer-engine-optimization.html">.*?</a>)?'
        r'(?:\s*<a class="mega-menu-link" href="seo-sem-geo-aeo.html">.*?</a>)?',
        re.S,
    )
    if pattern.search(content):
        return pattern.sub(AI_NAV_INSERTION, content, count=1)
    return content


def update_page(filename: str) -> bool:
    path = ROOT / filename
    if not path.exists():
        print(f"SKIP missing {filename}")
        return False
    original = path.read_text(encoding="utf-8")
    content = original
    title = title_from_html(content, filename)
    group = group_for(filename)
    cards = questions_for(filename, title, group)
    keywords = SPECIAL_TERMS.get(filename, []) + [title, filename.replace('.html', '').replace('-', ' ')] + COMMON_KEYWORDS
    description = trim_sentence(f"{title} by Axon 1ProIT helps SMEs solve practical business technology issues with clear advice, setup support, SEO/GEO/AEO-ready content and ongoing assistance.")
    url = page_url(filename)

    content = update_questions(content, cards, filename)
    content = update_help(content, group, filename)
    content = inject_ai_ready(content, group)
    content = fix_visual(content, filename)
    content = update_nav_ai_links(content)

    content = re.sub(r'<title>.*?</title>', f'<title>{e(title)} | Axon 1ProIT</title>', content, count=1, flags=re.S)
    content = set_meta(content, "description", description)
    content = set_meta(content, "keywords", ", ".join(dict.fromkeys(keywords)))
    content = ensure_social_meta(content, filename, title, description)

    schema = faq_schema(title, cards, url)
    schema_pattern = re.compile(r'<script type="application/ld\+json" data-service-faq>.*?</script>\s*', re.S)
    if schema_pattern.search(content):
        content = schema_pattern.sub(schema + '\n', content, count=1)
    else:
        content = content.replace('</head>', schema + '\n</head>', 1)

    if content != original:
        path.write_text(content, encoding="utf-8")
        print(f"UPDATED {filename}")
        return True
    print(f"OK unchanged {filename}")
    return False


def update_social_only(filename: str) -> bool:
    path = ROOT / filename
    if not path.exists():
        print(f"SKIP missing social page {filename}")
        return False
    original = path.read_text(encoding="utf-8")
    content = original
    title = title_from_html(content, filename)
    description = meta_value(content, "description") or f"{title} by Axon 1ProIT helps business owners understand technology, websites, AI and digital services."
    description = trim_sentence(description)
    content = set_meta(content, "description", description)
    content = ensure_social_meta(content, filename, title, description)
    content = update_nav_ai_links(content)
    if content != original:
        path.write_text(content, encoding="utf-8")
        print(f"UPDATED social meta {filename}")
        return True
    print(f"OK social meta {filename}")
    return False


def main() -> int:
    changed = 0
    for filename in SERVICE_PAGES:
        if update_page(filename):
            changed += 1

    for filename in AI_SEARCH_PAGES + CORE_PAGES_FOR_SOCIAL:
        if update_social_only(filename):
            changed += 1

    print(f"Service page and social sharing update complete. Changed files: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
