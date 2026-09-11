# SmartBasket — website

Landing page for **SmartBasket**, an Android app in development that turns meal plans with personal calorie and protein targets into a grocery basket of whole packages, and carries leftovers forward into the next plan.

Bilingual: English at `/`, German at `/de/`, switchable with the flags in the header.

## What's inside

- **Interactive planning demo** — choose meals for one or two people and watch nutrition, package quantities, prices and pantry savings update. Ingredients shared across the day are combined before rounding up to whole packages.
- **No framework, no build step** — plain HTML, CSS and JavaScript.
- **Accessible** — skip link, visible focus states, `aria-pressed` / `aria-current` / `aria-live`, `prefers-reduced-motion`, WCAG AA text contrast.
- **Degrades gracefully** — the app screenshots switch with CSS only; without JavaScript the demo area explains what it needs instead of staying empty.
- **Light on data** — food photography served as WebP and lazy-loaded.

## Structure

```
dist/
├── index.html          English
├── de/                 German (index.html, demo.js, hero-carousel.js)
├── style.css           shared styles
├── demo.css
├── demo.js             planning demo
├── hero-carousel.js
└── assets/             images and social preview images
```

## Run locally

```bash
python -m http.server 8000 --directory dist
```

Open http://localhost:8000 for English or http://localhost:8000/de/ for German.

## Notes

Nutrition values and package prices in the demo are illustrative estimates. Grocery data: Open Food Facts.

Designed and built by Samaana Zakharova.
