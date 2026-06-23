#!/usr/bin/env python3
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://axon.com.sg"
IMAGE = f"{SITE}/dashboard_preview.png"
WEAK = {"and", "or", "with", "for", "to", "of", "in", "the", "a", "an"}


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<.*?>", "", value)).strip()


def page_url(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return SITE + "/"
    if rel.endswith("/index.html"):
        return SITE + "/" + rel[:-10]
    return SITE + "/" + rel


def title_for(content: str, path: Path) -> str:
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.I | re.S)
    if h1:
        return clean(h1.group(1))
    title = re.search(r"<title>(.*?)</title>", content, re.I | re.S)
    if title:
        return clean(title.group(1)).split("|")[0].strip()
    return path.stem.replace("-", " ").title()


def meta_value(content: str, name: str) -> str | None:
    m = re.search(rf'<meta\s+[^>]*name="{re.escape(name)}"[^>]*content="([^"]*)"[^>]*>', content, re.I)
    if not m:
        m = re.search(rf'<meta\s+[^>]*content="([^"]*)"[^>]*name="{re.escape(name)}"[^>]*>', content, re.I)
    return html.unescape(m.group(1)).strip() if m else None


def trim(text: str, limit: int = 155) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0].rstrip(" ,.;:-")
    words = text.split()
    while words and words[-1].lower().strip(" ,.;:-") in WEAK:
        words.pop()
    return " ".join(words).rstrip(" ,.;:-")


def set_meta(content: str, name: str, value: str) -> str:
    repl = f'<meta name="{name}" content="{esc(value)}"/>'
    pat = re.compile(rf'<meta\s+content="[^"]*"\s+name="{re.escape(name)}"\s*/?>|<meta\s+name="{re.escape(name)}"\s+content="[^"]*"\s*/?>', re.I)
    return pat.sub(repl, content, count=1) if pat.search(content) else content.replace("</head>", repl + "\n</head>", 1)


def set_prop(content: str, prop: str, value: str) -> str:
    repl = f'<meta property="{prop}" content="{esc(value)}"/>'
    pat = re.compile(rf'<meta\s+property="{re.escape(prop)}"\s+content="[^"]*"\s*/?>', re.I)
    return pat.sub(repl, content, count=1) if pat.search(content) else content.replace("</head>", repl + "\n</head>", 1)


def set_canonical(content: str, href: str) -> str:
    repl = f'<link rel="canonical" href="{esc(href)}"/>'
    pat = re.compile(r'<link\s+rel="canonical"\s+href="[^"]*"\s*/?>|<link\s+href="[^"]*"\s+rel="canonical"\s*/?>', re.I)
    return pat.sub(repl, content, count=1) if pat.search(content) else content.replace("</head>", repl + "\n</head>", 1)


def update_nav(content: str) -> str:
    content = re.sub(r'(<a class="nav-link(?: active)?" href="(?:/)?trending/">)(Trending|Trends)(</a>)', r'\1News\3', content)
    if 'href="ask-axon.html"' not in content:
        news = re.search(r'<a class="nav-link(?: active)?" href="(?:/)?trending/">News</a>', content)
        if news:
            content = content[:news.start()] + '<a class="nav-link" href="ask-axon.html">Ask Axon</a>' + content[news.start():]
        else:
            contact = re.search(r'<a class="nav-link" href="contact.html">Contact Us</a>', content)
            if contact:
                content = content[:contact.end()] + '<a class="nav-link" href="ask-axon.html">Ask Axon</a><a class="nav-link" href="trending/">News</a>' + content[contact.end():]
    return content


def update_social(content: str, path: Path) -> str:
    title = title_for(content, path)
    desc = trim(meta_value(content, "description") or f"{title} by Axon 1ProIT helps business owners understand websites, AI, cloud, email, automation and technology support.")
    url = page_url(path)
    content = set_meta(content, "description", desc)
    content = set_canonical(content, url)
    content = set_prop(content, "og:type", "website")
    content = set_prop(content, "og:site_name", "Axon 1ProIT")
    content = set_prop(content, "og:locale", "en_US")
    content = set_prop(content, "og:title", f"{title} | Axon 1ProIT")
    content = set_prop(content, "og:description", desc)
    content = set_prop(content, "og:url", url)
    content = set_prop(content, "og:image", IMAGE)
    content = set_prop(content, "og:image:secure_url", IMAGE)
    content = set_prop(content, "og:image:type", "image/png")
    content = set_meta(content, "twitter:card", "summary_large_image")
    content = set_meta(content, "twitter:title", f"{title} | Axon 1ProIT")
    content = set_meta(content, "twitter:description", desc)
    content = set_meta(content, "twitter:url", url)
    content = set_meta(content, "twitter:image", IMAGE)
    return content


def main() -> int:
    changed = 0
    for path in list(ROOT.glob("*.html")) + list((ROOT / "trending").glob("*.html")):
        original = path.read_text(encoding="utf-8")
        content = update_social(update_nav(original), path)
        if content != original:
            path.write_text(content, encoding="utf-8")
            print(f"UPDATED {path.relative_to(ROOT)}")
            changed += 1
    print(f"Final navigation and social sharing update complete. Changed files: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
