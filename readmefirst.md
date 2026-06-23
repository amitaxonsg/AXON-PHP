Axon Website 2026 - Project Instructions
IMPORTANT

Read this file before making any changes.

Review the existing implementation first before proposing modifications.

Make the smallest possible change required to achieve the objective.

Do not redesign working sections unless specifically requested.

Repository Information

GitHub Repository:

https://github.com/amitaxonsg/axonnewsite2026

Primary Branch:

main

Project Folder:

axon-redesign/

Development Website:

https://dev.axon.com.sg

Local Development:

http://localhost:8000

Technology Stack

This is a STATIC WEBSITE.

Use:

HTML
CSS
Vanilla JavaScript

Do NOT use:

React
Next.js
TypeScript
Tailwind
Vite
Webpack
npm build processes
Additional frameworks unless specifically requested
Deployment Process

Changes are developed locally first.

Development deployment:

rsync -av --delete axon-redesign/ /home/devaxoncom/public_html/

Server:

dev.axon.com.sg

Document Root:

/home/devaxoncom/public_html

Always ensure files remain compatible with standard Apache/cPanel hosting.

Design Standards

Maintain existing Axon branding.

Preserve:

Header
Navigation
Footer
Typography
Corporate visual identity

Design direction:

Clean white corporate design
Large typography
Open whitespace
Professional appearance
Mobile responsive
Fast loading

Do not introduce trendy redesigns that conflict with the existing Axon brand.

Before Making Changes
Read the existing code first.
Understand the current implementation.
Explain the root cause before major modifications.
Make minimal changes whenever possible.
Preserve existing functionality.
Check for impact on other pages.
Known Issues
Homepage Animation

Do NOT use:

navActions.parentNode.insertBefore(searchToggle, menuButton);

Use:

navActions.insertBefore(searchToggle, menuButton);

Using the wrong version may break:

Homepage animations
Trending functionality
JavaScript execution
Trending Section

Do not remove or break:

Trending navigation
Trending article loading
Trending search
Category filtering

Always verify Trending functionality after JavaScript changes.