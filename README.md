# Booklee Technologies — Agency Portfolio Website

A production-ready, multi-page agency portfolio built with semantic HTML5, modern CSS3, and vanilla JavaScript. Designed for premium aesthetics, accessibility, and easy deployment to Vercel or Netlify.

## Project Structure

```
├── index.html              # Home
├── about.html
├── services.html
├── contact.html
├── book-call.html
├── services/
│   ├── product-engineering.html
│   ├── system-architecture.html
│   ├── web-engineering.html
│   ├── ui-ux-systems.html
│   ├── digital-growth-strategy.html
│   └── product-strategy-consulting.html
├── assets/
│   ├── css/styles.css
│   ├── js/scripts.js
│   ├── images/
│   └── icons/favicon.svg
└── README.md
```

## Local Development

Open `index.html` in a browser, or run a local server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Visit `http://localhost:8080`

## Contact & scheduling

Official details are centralized in **`assets/js/scripts.js`** (`SITE_CONTACT`) and used across the site:

| Channel   | URL / address |
|-----------|----------------|
| Email     | `bookleetechnologies@gmail.com` |
| Calendly  | `https://calendly.com/bookleetechnologies/30mins` |
| LinkedIn  | `https://www.linkedin.com/company/booklee-technologies/` |
| Instagram | `https://www.instagram.com/booklee_technologies/` |

The **Book a Call** page embeds Calendly inline. To change the scheduling link later, update `SITE_CONTACT.calendly` in `scripts.js` and the `data-url` on the widget in **`book-call.html`**.

### Contact form email delivery

The **Contact** page sends submissions to `bookleetechnologies@gmail.com` via [FormSubmit](https://formsubmit.co) (`SITE_CONTACT.formSubmit` in `scripts.js`).

**One-time setup:** After the first real submission, FormSubmit emails `bookleetechnologies@gmail.com` an activation link—click it to confirm the inbox. Until then, messages may not arrive.

If delivery fails, visitors see a fallback message with the direct email address.

## Customize Colors & Fonts

All design tokens live in **`assets/css/styles.css`** under `:root`:

```css
:root {
  --color-bg-deep: #050816;
  --color-bg-mid: #0b1120;
  --color-primary: #3b82f6;
  --color-accent: #8b5cf6;
  --font-sans: "Inter", ...;
  --font-display: "Outfit", ...;
}
```

**Colors:** Change the hex values above; gradients and glows derive from these variables.

**Fonts:** Update Google Fonts links in each HTML `<head>`, then change `--font-sans` and `--font-display` in CSS.

## Deploy the Site

### Vercel

1. Push the project to GitHub.
2. Import the repo at [vercel.com](https://vercel.com).
3. Framework preset: **Other** (static site).
4. Deploy — no build command required.

### Netlify

1. Drag and drop the project folder at [netlify.com/drop](https://app.netlify.com/drop), or connect a Git repo.
2. Build command: *(leave empty)*
3. Publish directory: `/` (root)

### GitHub Pages

1. Push to GitHub.
2. Settings → Pages → Source: `main` branch, `/ (root)`.

## Features

- Sticky navbar with mobile hamburger menu
- Scroll progress indicator
- Custom cursor (desktop, respects reduced motion)
- Mouse-follow gradient & particle background
- Scroll reveal animations
- Glassmorphism cards
- FAQ accordions on service pages
- Contact form validation (client-side)
- Calendly embed on Book a Call page
- WCAG-inspired accessibility (semantic HTML, focus states, ARIA)
- `prefers-reduced-motion` support

## Recommended Free Assets & Tools

| Tool | Use |
|------|-----|
| [Google Fonts](https://fonts.google.com) | Inter, Outfit (already linked) |
| [Heroicons](https://heroicons.com) | SVG icons |
| [Unsplash](https://unsplash.com) / [Pexels](https://pexels.com) | Team/hero photography |
| [Squoosh](https://squoosh.app) | Image compression |
| [Calendly](https://calendly.com) | Scheduling embed |
| [Formspree](https://formspree.io) / [Netlify Forms](https://docs.netlify.com/forms/setup/) | Backend for contact form |
| [Lighthouse](https://developers.google.com/web/tools/lighthouse) | Performance & a11y audits |

### Wire contact form to a backend

The contact form currently validates client-side only. To receive submissions:

**Formspree:** Set `action="https://formspree.io/f/YOUR_ID"` on `#contact-form` in `contact.html`.

**Netlify:** Add `data-netlify="true"` and `name` attributes; deploy on Netlify.

## License

© Booklee Technologies. All rights reserved.
