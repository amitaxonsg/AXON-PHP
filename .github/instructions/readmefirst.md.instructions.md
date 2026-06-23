---
description: Apply to all Axon website development tasks
---

# Axon Website 2026

Read these instructions before making any changes.

## Project Type

Static HTML website.

Technology:

- HTML
- CSS
- Vanilla JavaScript

Do NOT use:

- React
- Next.js
- TypeScript
- Tailwind
- Vite
- Webpack
- npm build processes
- Additional frameworks

## Repository

GitHub:

https://github.com/amitaxonsg/axonnewsite2026

Branch:

main

Project Folder:

axon-redesign/

## Development

Local:

http://localhost:8000

Development Site:

https://dev.axon.com.sg

## Deployment

Deploy using:

rsync -av --delete axon-redesign/ /home/devaxoncom/public_html/

Document Root:

/home/devaxoncom/public_html

## Design Rules

Maintain:

- Axon branding
- Existing header
- Existing footer
- Google Sans Flex
- Corporate styling

Design direction:

- White background
- Large typography
- Open spacing
- Mobile responsive

## Before Making Changes

1. Read existing implementation first.
2. Make the smallest possible change.
3. Do not redesign unrelated sections.
4. Preserve working functionality.
5. Explain major changes before implementing.

## Known Issues

Homepage animation breaks if:

navActions.parentNode.insertBefore(searchToggle, menuButton);

Use:

navActions.insertBefore(searchToggle, menuButton);

## Trending

Always verify:

- Trending navigation
- Trending article loading
- Search
- Category filtering

## Contact Page

Required layout:

Top:
- Hero section

Middle:
- Left = Contact Form
- Right = AI Agent

Bottom:
- Address
- Email
- WhatsApp
- Phone

## Testing Checklist

Before committing:

- Homepage loads
- Homepage animation works
- Trending works
- Contact page works
- Mobile menu works
- No JavaScript console errors


## AI Reasoning Policy

Default reasoning level:

LOW

Use MEDIUM only when:

- Debugging JavaScript issues
- Homepage animation problems
- Trending page issues
- Multi-file bugs
- Complex responsive/mobile problems

Use HIGH only when:

- Explicitly requested
- Major architecture decisions
- Large redesigns
- Root cause analysis across many files

Always start with LOW.

Escalate to MEDIUM only if LOW cannot solve the problem.

Do not use HIGH automatically.


## Change Control

Before modifying files:

1. Explain the proposed fix.
2. List files to be changed.
3. Explain potential impact.
4. Make the smallest possible change.
5. Avoid refactoring unrelated code.

For changes affecting more than 3 files:
Ask for approval first.

## Project Philosophy

Maintain and improve the website.

Do not rebuild the website.

Do not replace working functionality.

Preserve existing branding and user experience.