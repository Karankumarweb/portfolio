# Karan Kumar — Developer Portfolio

A fast, dependency-light personal portfolio for **Karan Kumar**, a Java backend developer working with
Spring Boot, REST APIs, microservices and PostgreSQL.

**Live site:** https://karankumarweb.github.io/portfolio/

---

## What's in here

- **Hero** with an animated typing role, aurora background and animated stat counters
- **About** with quick facts and a short professional summary
- **Skills** grouped into languages, Spring/backend, databases, testing, DevOps and AI
- **Experience & education** as a timeline (Infosys, SLIET, schooling) with highlighted results
- **Projects** — two detailed feature panels plus a card grid of six more projects
- **Certificates** with a click-to-zoom lightbox (C++, HTML, Coding Ninjas / Udemy / Great Learning)
- **Contact** with a working form that composes an email, copy-to-clipboard and direct links
- **Dark / light mode** and **five accent colours**, both remembered in `localStorage`

Everything is responsive from 320 px phones up to wide desktops, keyboard accessible, and respects
`prefers-reduced-motion`.

## Tech

Plain **HTML, CSS and JavaScript** — no build step, no framework, no dependencies.

- Inline SVG icon sprite (no icon-font request)
- `IntersectionObserver` for scroll reveals, counters and active-section highlighting
- Inter, Sora and JetBrains Mono from Google Fonts, with system-font fallbacks
- Images in WebP, lazy-loaded below the fold
- SEO: meta description, Open Graph/Twitter cards, JSON-LD `Person` schema, SVG favicon

## Project structure

```
.
├── index.html              # single-page site
├── 404.html                # GitHub Pages not-found page
├── assets/
│   ├── css/style.css       # design tokens, themes and all layout
│   ├── js/main.js          # theme, nav, animations, lightbox, form
│   ├── img/                # WebP portraits, project shots, certificates
│   └── docs/Resume.pdf     # downloadable résumé
├── .nojekyll               # serve files as-is on GitHub Pages
└── README.md
```

## Run locally

Any static server works — no install required:

```bash
git clone https://github.com/Karankumarweb/portfolio.git
cd portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

The site is published with **GitHub Pages** straight from the `main` branch:

1. Push to `main`
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `root`
3. The site is live at `https://karankumarweb.github.io/portfolio/` within a minute

## Editing content

| What | Where |
| --- | --- |
| Text, projects, certificates | `index.html` |
| Colours, spacing, type scale | `:root` variables at the top of `assets/css/style.css` |
| Accent presets | `html[data-accent="…"]` rules in `style.css` + `.swatch__dot` buttons in `index.html` |

## Contact

- Email: **kk4447058@gmail.com**
- Phone: **+91 87572 80393**
- GitHub: [@Karankumarweb](https://github.com/Karankumarweb)

---

© Karan Kumar. Content, résumé and certificates belong to their respective owners.
