# SmartBasket — Approved Editorial Design Handoff

Implementation issue: https://github.com/samisam-hub/SmartBasket-website/issues/16

**Important:** The user's approved screenshot is the sole design reference. Do not redesign. The existing demo calculator must remain exactly as it currently looks and behaves.

## Asset package
A 27-file standalone asset bundle was generated in the ChatGPT session as `smartbasket-approved-design-assets.zip`. **It is not fully committed to this branch**. To complete the asset import, extract the ZIP's `editorial/` folder into `dist/assets/editorial/`. Do not use existing `app-*.webp` screens as replacements for the newly generated concept phone mockups.

### Required standalone assets
- Hero: `hero-desktop.jpg`, `hero-mobile.jpg`
- Concept phone screens: `step-01-household.png`, `step-02-weekplan.png`, `step-03-shopping.png`
- Food: `food-tomatoes.jpg`, `food-lemons.jpg`, `food-herbs.jpg`, `food-olive-oil.jpg`, `food-meal-bowl.jpg`, `food-water.jpg`, `food-cutting-board.jpg`, `food-linen.jpg`
- Backgrounds: `bg-stone.jpg`, `bg-plant-shadow.jpg`, `bg-wood.jpg`, `bg-kitchen.jpg`, `bg-light-shadow.jpg`
- Icons: `icon-leaf.svg`, `icon-clock.svg`, `icon-cart.svg`, `icon-people.svg`, `icon-box.svg`, `icon-heart.svg`, `icon-calendar.svg`
- Supporting: `asset-manifest.json`, `CLAUDE_CODE_IMPLEMENTATION.md`

**Asset availability:** Some SVGs have been pushed to this branch; do not assume JPG/PNG files are committed until checked. The standalone generated ZIP is available as a ChatGPT artifact to the user, not an accessible GitHub URL. If Claude Code cannot access the ZIP in its environment, it must explicitly report that blocker instead of inventing replacements.

## Immutable boundaries
- `dist/de/index.html`: B2C copy and section layout may be updated, but existing calculator markup must remain identical.
- `dist/de/startseite.css`: scope new design rules so they cannot restyle the calculator.
- `dist/de/familie-demo.js`, `dist/de/demo.js`, `dist/demo.js`, `dist/demo.css`: no modifications.
- Do not touch English site, B2B, legal pages, backend or beta signup.

## Review
Compare to approved reference screenshot. Check calculator before/after and all breakpoints. Do not merge until verified.
