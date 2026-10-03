# Karan Kumar — Portfolio

A fast, dependency-free personal portfolio for **Karan Kumar**, Java backend developer
(Bengaluru, India) — Spring Boot · REST APIs · Microservices · PostgreSQL · JUnit/Mockito.

Built as plain HTML, CSS and JavaScript. No frameworks, no build step, no npm install —
open `index.html` and it runs.

---

## Features

- **Animated hero** with a typing role headline, a syntax-highlighted Spring Boot code card
  and count-up statistics
- **5 accent themes** (indigo · emerald · amber · rose · violet) plus a **dark / light mode
  toggle** — both remembered in `localStorage`
- **Scroll-reveal** animations, animated skill bars and a scroll-spy navigation bar
- **Filterable project grid** (Backend & APIs / Web / Python & IoT)
- **Certificate lightbox** with keyboard support (`Esc` to close)
- **Validated contact form** that opens the visitor's mail client pre-filled
- Fully **responsive**, keyboard accessible, and respects `prefers-reduced-motion`
- SEO + social meta tags, inline SVG favicon, zero external JS dependencies

## Structure

```
.
├── index.html                          # the whole site
└── assets/
    ├── css/style.css                   # design tokens, themes, layout, animations
    ├── js/main.js                      # all behaviour, vanilla JS
    ├── docs/Karan-Kumar-Resume.pdf     # downloadable résumé
    └── img/                            # optimised WebP artwork
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
| Projects & certificates | the relevant `<section>` in `index.html` |

## Deployment

The site is a static bundle, so it deploys anywhere — GitHub Pages, Netlify, Vercel or
Cloudflare Pages. For GitHub Pages, serve the repository root from the `main` branch.

---

© Karan Kumar
