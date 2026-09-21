# Working-Tree Changes — Snapshot (2026-09-21)

Notes on the change set committed on this date: a shared skeleton-loading
system adopted across every dynamic section, two homepage sections moved
from JS-rendered to static markup, a couple of unrelated perf/data-flow
fixes, a hero image swap, and SEO meta-description touch-ups.

## 1. Shared skeleton-loading component

`src/components/skeleton/skeleton.js` (new) — primitives
(`createSkeletonBlock`, `createSkeletonTextLine`, `createSkeletonImage`,
`createProductCardSkeleton`, `createProductCarouselSkeleton`,
`createProductGridSkeleton`, `createFetchErrorState`, `setSkeletonBusy`)
shared by every section that renders backend content at runtime. Each
composed skeleton mirrors its real card's exact box model (aspect ratio,
rounding, line heights) so swapping skeleton → real content never shifts
layout (CLS). `createFetchErrorState` gives every section the same real,
actionable error/retry UI instead of dead-end error text.

Adopted in:
- `src/features/products/grid.js` + `productsInit.js` — grid skeleton,
  error state now takes an `onRetry` callback (`loadProducts` itself).
- `src/features/bestSellers/renderBestSellers.js` — carousel skeleton +
  wired retry button.
- `src/features/showcase/renderShowcase.js` — carousel skeleton + retry
  that re-skeletons, reloads, and re-renders the active tab.
- `src/features/wishlist/wishlistPageInit.js` + `wishlistLayout.js` — a
  new `wishlistLoadingState` grid shown by default before
  login/empty/items resolve.
- `src/features/productDetails/recentlyViewed.js` and `relatedProducts.js`
  — carousel skeletons while their fetches resolve.

All affected containers also gained `aria-live="polite"` (in
`bestSellersSection.js`, `showcaseSection.js`,
`recentlyViewedSection.js`, `relatedProductsSection.js`, `products.html`,
`index.html`'s `categoryGrid`) so screen readers announce the swap, paired
with `setSkeletonBusy()` toggling `aria-busy` on the same containers.

## 2. Homepage: why-choose-us + craftsmanship inlined as static markup

- `src/features/whyChooseUs/renderFeatures.js` and
  `src/features/craftsmanship/craftsmanshipInit.js` — **deleted**. Both
  sections were static content with no backend dependency, so rendering
  them via JS only added an avoidable delay + layout shift.
- `index.html` — both previously-empty containers now hold the full
  markup inline.
- `src/main.js` — calls `window.lucide?.createIcons()` once up front so
  the now-static icons hydrate (dynamically-rendered sections still call
  it themselves).
- `src/pages/homePage.js`, `doc.md` — dead imports/pipeline entries and
  the module-map rows for both removed files cleaned up.

## 3. `index.html` perf hints (independent of the above)

- `<link rel="modulepreload">` for the whole first-paint module graph, so
  the browser fetches it in parallel instead of discovering imports
  serially after `main.js` parses.
- `<link rel="preconnect" href="https://backend.globalshopify.com">`
  since category/showcase/best-sellers all hit that origin immediately.

## 4. Data-flow fixes (unrelated to the above)

- `src/services/productService.js` — `getPublicProducts()` dedupes
  concurrent identical requests via an in-flight-promise map, since
  Showcase and Best Sellers both fire the same default-params request on
  homepage load.
- `src/features/category/renderCategory.js` — renders the local category
  list immediately (it's real, current data, not a placeholder) instead
  of waiting on the backend; only re-renders if the backend result
  actually differs.

## 5. Hero image swap

`hero1.jpg`, `hero2.png`, `hero2-640/1080/1920.webp` deleted;
`heroSlides.js` slide 2 now points at a single new `hero2.webp` (448 KB)
for every breakpoint, unlike slide 1 which still uses a responsive
srcset. **Flagged as a likely regression** — worth regenerating
640/1080/1920 variants for hero2 before shipping, since this is very
likely the page's LCP element.

## 6. SEO meta-description rewrites

`cart.html`, `checkout.html`, `contact.html`, `forgotPassword.html`,
`orders.html`, `products.html`, `profile.html`, `wishlist.html` — brand
casing fixed (`banshiwale` → `Banshiwale`) and descriptions rewritten
with fuller, more specific copy.

## 7. Misc

- `package.json` — dropped `repository`/`bugs`/`homepage` fields.
- `.gitignore` — un-ignores `changes.md` (case-insensitively matches this
  file on Windows) so these notes can be committed.
- `src/css/tailwind.build.css` — rebuilt to pick up new utility classes
  used across the above (aria-live containers, static markup, etc.).

## Issues found and fixed during commit

- `package.json` had a stray literal line (`npm run build:css`) appended
  after the closing `}`, making it invalid JSON — would have broken
  `npm install`/`npm run build:css`. Removed.
- `productService.js` had a leftover `console.log("[DEBUG
  getPublicProducts] ...")` in the new dedup code. Removed.
