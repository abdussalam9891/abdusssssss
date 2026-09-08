# Banshiwale — Repo Guide

Static, vanilla-JS storefront for Banshiwale (sterling silver jewellery). No
build tool, no bundler, no `package.json` — plain HTML files load ES modules
directly via `<script type="module">`. Styling is Tailwind (CDN) plus a
hand-written `src/css/main.css`. All data (products, cart, wishlist, auth,
orders, reviews, etc.) comes from a remote backend defined in `src/config.js`.

Read this file first. It tells you **which file to open** for a given kind of
change, so you don't have to search the whole repo.

---

## 1. How the site is put together

- Every page is a real, static `.html` file — the root `index.html` (home)
  and everything in `pages/*.html` (one file per route, e.g.
  `pages/products.html`, `pages/cart.html`).
- Each HTML page contains empty "slot" elements with specific `id`s
  (e.g. `#productsHero`, `#cartPage`, `#profilePage`) and loads
  `src/main.js` as a module (`../src/main.js` from inside `pages/`,
  `./src/main.js` from the root).
- `src/main.js` is the single entry point for **every** page. On
  `DOMContentLoaded` it always initializes global/shared UI (navbar, footer,
  toast, cart/wishlist sync, WhatsApp button, etc.), then checks which
  page-specific slot element exists in the DOM and dynamically
  `import()`s the matching module from `src/pages/`. This is how one bundle
  of JS serves every page without a router or bundler.
- There is no npm install / build step. To work on this site locally, just
  serve the folder statically (e.g. VS Code "Live Server", or
  `python -m http.server`) — opening `index.html` via `file://` will break
  ES module imports.
- Deployment is plain static hosting (Apache/cPanel-style) — see
  `.htaccess` (forces `www.banshiwale.com` → `banshiwale.com`) and `sw.js`
  (a service worker that exists solely to patch a broken payment-gateway
  redirect path; see comments inside it before touching it).

---

## 2. Folder-by-folder map

| Folder | What lives here |
|---|---|
| `index.html`, `pages/*.html` | The actual pages/routes. Structure, static text, meta tags, Tailwind classes. |
| `src/main.js` | App bootstrap. Wires global UI + lazy-loads the right page module. **Start here when adding a brand-new page.** |
| `src/config.js` | `API_BASE_URL`, `STORE_DOMAIN`, Google client ID, and the full map of backend `API_ENDPOINTS`. **Edit here when a backend URL/route changes.** |
| `src/pages/` | One file per page, the "controller" that a given `pages/*.html` boots into (e.g. `productsPage.js`, `cartPage.js`, `checkoutPage.js`). Ties together the feature(s) + component(s) for that page. |
| `src/features/` | Business/behavior logic: state management, API calls orchestration, event wiring, validation. Organized by domain (e.g. `features/cart/`, `features/auth/`, `features/productDetails/`). **Edit here for "how something behaves/works".** |
| `src/components/` | DOM-building/render functions ("view" layer) — functions that return HTML strings or build/update DOM nodes. Organized by domain, mirrors `features/`. **Edit here for "how something looks/is structured in markup".** |
| `src/services/` | One file per backend resource (`cartService.js`, `authService.js`, `productService.js`, `ordersService.js`, etc.). Thin wrappers around `apiClient` calling the endpoints from `config.js`. **Edit here when the shape of a request/response to the backend changes.** |
| `src/services/apiClient.js` | The single low-level `fetch` wrapper (auth header injection, timeout, JSON parsing, error normalization) used by every service file. Rarely needs touching. |
| `src/constants/` | Static/hardcoded data: nav links, hero slides, payment method list, testimonials, "why choose us" copy, fallback showcase products. |
| `src/utils/` | Small generic helpers (formatting, image fallback/pruning, auth redirect guard, toast trigger, category matching, etc.) shared across features/components. |
| `src/css/main.css` | Global stylesheet (non-Tailwind custom styles/utility overrides). |
| `src/css/pages/products.css` | Page-specific overrides for the products listing page. |
| `src/features/*/*.css` (e.g. `announcement.css`, `marquee.css`, `animations.css`, `priceRangeSlider.css`) | Small component/feature-scoped stylesheets colocated with their JS. |
| `src/assets/` | Images (product photos by category, process photos, icons, testimonial avatars, etc.). |
| `sw.js` | Service worker — only exists to fix the Cashfree payment-return redirect. See in-file comment before editing. |
| `.htaccess` | Apache-level redirect: `www.banshiwale.com` → `banshiwale.com`. |

### The `features/` ↔ `components/` split
For most domains (auth, cart, checkout, productDetails, wishlist, orders,
profile, navbar, footer, hero, faq, etc.) there is a folder of the same name
under **both** `src/features/` and `src/components/`:
- `components/<domain>/` = renders markup, no business logic.
- `features/<domain>/` = event handlers, state, validation, API
  orchestration; imports the component(s) to render and re-render them.

When fixing a **visual/markup** bug, go to `components/<domain>/`.
When fixing a **behavior/logic/data** bug, go to `features/<domain>/`.

---

## 3. "I want to change X" — where to look

| You want to... | Open this |
|---|---|
| Change a page's static text, layout, SEO meta tags | The relevant file in `pages/*.html` (or `index.html` for home) |
| Add a brand-new page/route | Create `pages/newPage.html` + `src/pages/newPage.js`, then add an `if (document.getElementById(...))` block in `src/main.js` that dynamically imports it |
| Change the navbar (links, mobile menu, search) | `src/components/navbar/` (markup) + `src/features/navbar/` (behavior) |
| Change the footer (links, newsletter, accordion) | `src/components/footer/` + `src/features/footer/` |
| Change the homepage hero, showcase, marquee, testimonials, craftsmanship section, "why choose us" | Matching folder under `src/components/` + `src/features/` (e.g. `hero/`, `showcase/`, `testimonials/`) and `src/pages/homePage.js` |
| Change product listing (filters, sorting, pagination, grid) | `src/features/products/` (`filters.js`, `pipeline.js`, `pagination.js`, `toolbar.js`, `grid.js`, `state.js`) + `src/pages/productsPage.js` |
| Change product details page (gallery, reviews, variants, size, delivery check, related/recently viewed) | `src/features/productDetails/` + `src/components/productDetails/` + `src/pages/productDetailsPage.js` |
| Change cart behavior/UI (add/remove, quantities, badge count) | `src/features/cart/` (`cartState.js`, `cartBadge.js`, `cartPageInit.js`) + `src/components/cart/` + `src/services/cartService.js` |
| Change checkout flow (address, payment methods, order summary/confirmation) | `src/features/checkout/` + `src/components/checkout/` + `src/pages/checkoutPage.js` |
| Change wishlist | `src/features/wishlist/` + `src/components/wishlist/` + `src/services/wishlistService.js` |
| Change login/register/forgot-password/auth modal/Google login | `src/features/auth/` + `src/components/auth/` + `src/services/authService.js` |
| Change user profile / saved addresses / order history in profile | `src/features/profile/` + `src/components/profile/` + `src/services/addressService.js`, `src/services/ordersService.js` |
| Change past orders page | `src/features/orders/` + `src/components/orders/` + `src/services/ordersService.js` |
| Change FAQ page or homepage FAQ accordion | `src/features/faqPage/` (dedicated page) or `src/features/homeFaq/` (homepage widget) + `src/components/faq/` |
| Change contact page / contact form | `src/features/contact/` + `src/components/contact/` + `src/services/contactService.js` |
| Change "Customize Jewellery" floating button/modal/form | `src/features/customizeJewellery/` + `src/components/customizeJewellery/` + `src/services/customizeService.js` / `customizeProductService.js` |
| Change reviews (list, star summary, write a review) | `src/features/productDetails/reviews.js` + `src/components/productDetails/reviewsSection.js` / `reviewModal.js` + `src/services/reviewService.js` |
| Change "Quick Add" (pick-a-size add-to-cart modal) | `src/features/quickAdd/` + `src/components/quickAdd/` |
| Change coupons / offers shown on product page | `src/features/productDetails/offers.js` + `src/components/productDetails/offersSection.js` + `src/services/offersService.js` |
| Change gift cards | `src/services/giftCardsService.js` (feature/UI currently minimal — check `src/features/profile/` and `src/pages/profilePage.js` for where it's surfaced) |
| Change postal code / delivery estimate check | `src/features/productDetails/delivery.js` + `src/components/productDetails/deliveryChecker.js` + `src/services/postalCodeService.js` |
| Change privacy policy / shipping policy / terms text | `pages/privacy-policy.html`, `pages/shipping-policy.html`, `pages/terms-and-conditions.html` — rendered via `src/pages/policies/initPolicyPage.js` + `src/utils/renderPolicy.js` |
| Change toast notifications (styling/behavior) | `src/components/toast/` + `src/features/toast/` |
| Change the floating WhatsApp button | `src/components/whatsapp/` + `src/features/whatsapp/` |
| Change "scroll to top" button | `src/components/scrollToTop/` + `src/features/scrollToTop/` |
| Change the "X just explored Y" social-proof toast widget | `src/components/socialProof/` + `src/features/socialProof/` |
| Change scroll/reveal animations sitewide | `src/features/animations/reveal.js` + `src/features/animations/animations.css` |
| Change/add a backend endpoint URL, switch backend environment | `src/config.js` (`API_BASE_URL`, `API_ENDPOINTS`) |
| Change how API requests are made (headers, timeout, error format) | `src/services/apiClient.js` |
| Change hardcoded/fallback content (nav links, hero slides, testimonials, payment method list, "why choose us" copy, fallback showcase products) | `src/constants/` |
| Change global styles, colors, spacing not covered by Tailwind utility classes | `src/css/main.css` |
| Change images/photos | `src/assets/<category>/` (`bracelets`, `chains`, `earrings`, `rings`, `icons`, `images`, `process`, `testimonials`) |
| Fix the Cashfree payment redirect issue | `sw.js` (read the top comment fully first — it explains a real backend limitation this file works around) |
| Change the www → non-www redirect | `.htaccess` |

---

## 4. Conventions worth knowing before you edit

- **No bundler**: imports must use real relative paths with `.js`
  extensions (native ES modules). There's no transpilation — don't use
  syntax the target browsers don't support natively.
- **Page bootstrapping pattern**: a page's JS only runs if its slot element
  exists in the DOM (checked in `src/main.js`). If you add a new page,
  give its root container a unique `id` and add the matching
  `if (document.getElementById("..."))` block + dynamic `import()` in
  `src/main.js`, following the existing pattern (each is wrapped in
  `try/catch` with a `console.error` labeled by feature name).
  Public API of each page module tends to be a single `init...`/`load...`
  page in the module.
- **Independent failure domains**: `main.js` deliberately wraps most inits
  in `try/catch` (or `.catch()`) so one broken feature (e.g. backend down)
  doesn't block unrelated sitewide UI (navbar, footer, toast) from
  rendering. Keep new global inits similarly isolated.
- **Auth-aware sections re-render on `authChanged`**: cart/wishlist state
  and the navbar listen for a custom `authChanged` window event and
  re-hydrate on login/logout — see `hydrateAuth()` /
  `initCartSync()` / `initWishlistSync()` in `main.js` and
  `src/features/auth/authState.js`.
- **Cart is guest-usable (localStorage-backed), wishlist requires login**
  (backend-backed only) — keep this distinction in mind when touching
  either.
- **Styling**: Tailwind utility classes are used directly in the HTML/JS
  template strings; `src/css/main.css` and the small per-feature `.css`
  files are for things Tailwind utilities don't cleanly cover.
