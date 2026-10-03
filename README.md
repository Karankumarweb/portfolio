<div align="center">

# Karan Kumar — Developer Portfolio

**Java backend developer** — I build REST APIs, microservices and the test suites that keep them honest.

[![Live site](https://img.shields.io/badge/live-karankumarweb.github.io%2Fportfolio-6366f1?style=flat-square&logo=githubpages&logoColor=white)](https://karankumarweb.github.io/portfolio/)
[![Built with](https://img.shields.io/badge/built%20with-HTML%20%C2%B7%20CSS%20%C2%B7%20JS-22d3ee?style=flat-square)](#tech)
[![Dependencies](https://img.shields.io/badge/dependencies-0-a855f7?style=flat-square)](#tech)
[![License](https://img.shields.io/badge/license-MIT-34d399?style=flat-square)](LICENSE)

[**View the live portfolio →**](https://karankumarweb.github.io/portfolio/)

</div>

---

## About

Java-focused engineer with **7+ months at Infosys** building Java-based REST API automation —
validating payloads, status codes, headers, auth and business rules across **150+ API scenarios**.
I've designed **25+ RESTful endpoints** for a Spring Boot microservices platform, wired them to
PostgreSQL through JPA/Hibernate, and secured them with Spring Security + JWT.

This repository holds my personal portfolio — a single page covering my skills, experience,
projects and certificates, plus a downloadable résumé.

## Features

- **Hero** with an animated typing role, a syntax-highlighted Spring Boot code card and
  count-up statistics
- **5 accent themes** (indigo · emerald · amber · rose · violet) plus a **dark / light mode
  toggle** — both remembered in `localStorage`
- **Scroll-reveal** animations, animated skill bars and scroll-spy navigation
- **Filterable project grid** — Backend & APIs / Web / Python & IoT
- **Certificate lightbox** with keyboard support (`Esc` to close)
- **Validated contact form** that composes an email in the visitor's mail client
- Responsive, keyboard accessible, and respects `prefers-reduced-motion`
- SEO + social meta tags, SVG favicon, hand-written `404.html`

<a id="tech"></a>

## Tech

Plain **HTML, CSS and JavaScript** — no frameworks, no CDN scripts, no build step and
**zero runtime dependencies**. Icons and illustrations are inline SVG, artwork is WebP,
and the whole site is under 700 KB.

## Structure

```
.
├── index.html                            # the whole site
├── 404.html                              # standalone not-found page
├── .github/workflows/deploy-pages.yml    # auto-deploy to GitHub Pages
└── assets/
    ├── css/style.css                     # design tokens, themes, layout, animations
    ├── js/main.js                        # all behaviour, vanilla JS
    ├── docs/Karan-Kumar-Resume.pdf       # downloadable résumé
    └── img/                              # optimised WebP artwork + favicon
```

## Running locally

Any static file server works:

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

## Customising

| What | Where |
| --- | --- |
| Accent colours | `[data-accent="…"]` blocks in `assets/css/style.css` |
| Dark / light palettes | `:root` and `[data-theme="light"]` in `assets/css/style.css` |
| Role headline phrases | the `phrases` array in `assets/js/main.js` |
| Portrait photo | drop a file at `assets/img/karan.webp` (falls back to a monogram) |
| Projects & certificates | the matching `<section>` in `index.html` |

## Deployment

The site is a static bundle, so it deploys anywhere — GitHub Pages, Netlify, Vercel or
Cloudflare Pages. This repo ships with a GitHub Actions workflow
(`.github/workflows/deploy-pages.yml`) that publishes it to GitHub Pages automatically on
every push to `main`.

---

© Karan Kumar · [MIT licensed](LICENSE)
