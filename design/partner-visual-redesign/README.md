# SmartBasket Partner Page — Visual Redesign Plan

Status: **Design specification / not yet implemented**  
Target: https://smartbasket.samisam.org/de/partner/  
Repository: samisam-hub/SmartBasket-website  
Date: 2026-10-20

## Objective

Create a premium, credible B2B partner page that visually explains the relationship between the consumer meal-planning app, aggregated shopping demand, and retailer-facing insights. Preserve the current SmartBasket identity and the existing content and navigation unless explicitly changed below. Do not redesign the consumer homepage.

## Design principles

- Modern, confident B2B SaaS aesthetic with warm grocery-brand character; not generic startup clip art.
- Existing brand colors: primary green `#0F6B3F`, secondary green `#A7D36B`, warm yellow `#FFD14D`, orange `#FF6B00`, warm background `#FFF8F0`, dark text `#1F2937`.
- Large editorial typography, disciplined spacing, subtle borders and shadows, high-contrast accessible CTAs.
- Reuse existing high-resolution SmartBasket assets and **real** app screenshots where available. Never fabricate screenshots that appear to depict shipping functionality.
- Keep demo analytics visibly labeled as illustrative, not measured live demand. No unsupported ROI, precision, privacy or availability claims.
- Desktop and mobile layouts must both feel intentional; avoid horizontal overflow and tiny screenshots.
- No new dependencies unless strictly necessary; site is static HTML/CSS/JS.

## Proposed page composition

1. **Hero / product showcase (P0)**: Two-column layout. Left: short retailer-focused headline, supporting sentence, primary pilot CTA and secondary anchor. Right: large premium dashboard mockup showing demand by product category, planned quantities and a small trend chart. Clearly label *Beispieldaten*.
2. **Consumer-to-retailer story (P0)**: A single visual narrative: weekly meal plan on a real phone screenshot → aggregated pack-size shopping basket → retailer demand dashboard. Use restrained connecting lines/arrows, captions and an accessible mobile stacked alternative. The app-to-data transformation must be immediately understandable.
3. **Three retailer benefits (P1)**: Compact modules for fresh-food planning, availability and local demand insights. Use a small chart or crop of product UI per benefit instead of repeating decorative icon cards. Frame benefits as hypotheses to validate in pilot.
4. **Pilot scope and process (P1)**: Show what a partner provides (product name, package size, price via CSV/Excel) and what will be tested. Clearly distinguish *Im Pilot testen* from *Später möglich*; order/payment is future scope only.
5. **Privacy (P1)**: Short calm section explaining aggregated reporting and future explicit consent for order-level information. Avoid absolute promises.
6. **Roadmap (P1)**: Merge redundant vision and timeline material into one concise three-stage timeline with current, next and later stages.
7. **Final CTA (P1)**: High-contrast dark-green section, single primary action and optional email contact.

## Asset workstream

1. Audit `dist/assets/`, the current partner markup and all recently uploaded app visuals before generating anything.
2. Identify and reuse the best available real mobile screenshots. Check whether the underlying images are high enough resolution (at least 2× intended rendered dimensions on high-density displays).
3. Create only genuinely missing visuals: one dashboard composite, one planning-to-demand flow visual, and optional restrained food photography. Use WebP/PNG appropriately.
4. Store web-served assets under the site's existing `dist/assets/` convention, with descriptive names and documented source/usage. Do not place production images in this planning folder.
5. Use actual HTML/CSS/SVG for charts, UI components and captions when possible; avoid text baked into raster images.

## Implementation sequence and acceptance criteria

### P0 — Design and asset audit
- [ ] Inventory existing partner and app imagery; record sizes, quality and licenses.
- [ ] Establish the current desktop/mobile baseline with screenshots.
- [ ] Define a component-level visual spec without changing existing brand identity.

### P0 — Hero and product narrative
- [ ] Upgrade dashboard hierarchy and legibility; preserve demo disclosure.
- [ ] Add a genuine app screenshot plus basket-to-demand visualization.
- [ ] Ensure all graphics remain sharp on Retina/HiDPI devices.
- [ ] Verify no unsupported metrics or claims are presented as real.

### P1 — Supporting sections
- [ ] Reduce repeated cards and excessive whitespace without cramming content.
- [ ] Visually separate current pilot scope from future ordering capability.
- [ ] Consolidate vision and timeline into a coherent roadmap.
- [ ] Retain accessible headings, keyboard focus and reduced-motion behavior.

### P2 — Responsive and QA
- [ ] Check 360, 390, 768, 1024 and 1440 px widths.
- [ ] Confirm contrast, alt text, semantic headings and no horizontal scrolling.
- [ ] Optimize image loading, file sizes and cumulative layout shift.
- [ ] Verify German and English routes; update English counterpart only with consistent, reviewed copy.
- [ ] Compare before/after screenshots; avoid unrequested redesigns.

## Suggested implementation files

- `dist/de/partner/index.html`
- `dist/de/partner/partner.css`
- `dist/partners/index.html` and its stylesheet, after verifying existing structure
- Relevant assets within `dist/assets/`

## Guardrails for Claude Code

Read this plan and inspect the repository before editing. Make changes in small, reviewable commits or a PR. Do not overwrite existing approved high-resolution assets. Do not alter the site's other pages, brand logo, global navigation, or live CTAs without a specific requirement. Preserve the existing static-site architecture. Avoid claiming the partner dashboard is already deployed or processing real households. Do not deploy automatically; request visual review before merge/deployment.

## Definition of done

A polished, visually coherent partner page that communicates the consumer-app → aggregated-demand → retailer-benefit journey in under 10 seconds; works on mobile and desktop; reuses genuine brand assets; distinguishes demo and future features; and passes basic accessibility/performance checks.
