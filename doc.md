# Banshiwale — Repo Guide

Static, vanilla-JS storefront for Banshiwale (sterling silver jewellery). No
build tool, no bundler, no `package.json` — plain HTML files load ES modules
directly via `<script type="module">`. Styling is Tailwind (CDN) plus a
hand-written `src/css/main.css`. All data (products, cart, wishlist, auth,
orders, reviews, etc.) comes from a remote backend defined in `src/config.js`.

Read this file first. It tells you **which file to open** for a given kind of
change, so you don't have to search the whole repo. Section 3 answers "I want
to change X"; section 5 is a full file-by-file index if section 3 doesn't
have your case.

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
| `src/components/` | DOM-building/render ("view") functions for the domains still big/complex enough to keep markup separate from behavior — currently just `auth/`, `profile/`, `productDetails/`, plus the single shared `faq/faqCard.js`. Every other domain's render functions live alongside their behavior in `features/<domain>/` instead (see the split explanation below). **Edit here for "how something looks/is structured in markup"** on one of those four. |
| `src/services/` | One file per backend resource (`cartService.js`, `authService.js`, `productService.js`, `ordersService.js`, etc.). Thin wrappers around `apiClient` calling the endpoints from `config.js`. **Edit here when the shape of a request/response to the backend changes.** |
| `src/services/apiClient.js` | The single low-level `fetch` wrapper (auth header injection, timeout, JSON parsing, error normalization) used by every service file. Rarely needs touching. |
| `src/constants/` | Static/hardcoded data: nav links, hero slides, payment method list, Instagram gallery picks, "why choose us" copy, fallback showcase products. |
| `src/utils/` | Small generic helpers (formatting, image fallback/pruning, auth redirect guard, toast trigger, category matching, etc.) shared across features/components. |
| `src/css/main.css` | Global stylesheet (non-Tailwind custom styles/utility overrides). |
| `src/css/pages/products.css` | Page-specific overrides for the products listing page. |
| `src/features/*/*.css` (e.g. `announcement.css`, `marquee.css`, `animations.css`, `priceRangeSlider.css`) | Small component/feature-scoped stylesheets colocated with their JS. |
| `src/assets/` | Images (product photos by category, process photos, icons, etc.). `src/assets/testimonials/` is currently **unused** — the testimonials feature (see below) was removed from the site but its image folder wasn't cleaned up. |
| `sw.js` | Service worker — only exists to fix the Cashfree payment-return redirect. See in-file comment before editing. |
| `.htaccess` | Apache-level redirect: `www.banshiwale.com` → `banshiwale.com`. |
| `robots.txt` | Allows all crawling + points to `sitemap.xml`. Deliberately has no `Disallow` rules — pages that shouldn't be indexed (cart/checkout/login/register/forgotPassword/orders/profile/wishlist) are excluded via a `noindex` meta tag in their own `pages/*.html` instead, since `Disallow`-ing a page stops Google from ever seeing that tag. |
| `sitemap.xml` | Static list of the site's indexable, fixed-URL pages (home, `products.html`, about/contact/faq/policies). **Does not and cannot list individual product URLs** — `pages/product-details.html` serves every product via `?slug=`/`?id=` with no build step to enumerate them at deploy time; a real per-product sitemap needs either a backend-generated feed or a separate script, not a static file here. |
| `.gitignore` | Keeps `rules.md`, `changes.md`, and `doubt or question.md` (this file's own kind of internal dev-notes) untracked — this is a static site with no build/deploy-exclude step, so anything tracked at the repo root ships as a publicly reachable file. These three were previously committed, leaked unfixed backend gaps and another client's name, and were purged from history in commit `3955c58`. Keep them local-only; don't re-add them to git. |

> **Note (testimonials removed):** `src/features/testimonials/`,
> `src/components/testimonials/`, and `src/constants/testimonials.js` have
> been deleted from the codebase (a recent, uncommitted change on this
> branch). If you see references to a "testimonials" section in old docs,
> commit history, or design files, it no longer exists — the homepage now
> shows an **Instagram gallery** section instead (`src/features/instagramGallery/`
> + `src/constants/instagramGallery.js`).

### The `features/` ↔ `components/` split
Most domains do **not** have this split anymore — a domain's `create*`
(render) and `init*` (behavior) files sit together in one
`src/features/<domain>/` folder. Only three domains are big/complex enough
that markup and behavior are still kept in separate, same-named folders
under **both** `src/features/` and `src/components/`: **`auth`**,
**`profile`**, and **`productDetails`**. For those three only:
- `components/<domain>/` = renders markup, no business logic.
- `features/<domain>/` = event handlers, state, validation, API
  orchestration; imports the component(s) to render and re-render them.

When fixing a **visual/markup** bug on one of those three, go to
`components/<domain>/`. When fixing a **behavior/logic/data** bug, go to
`features/<domain>/`.

Every other domain that used to have this split — `navbar`, `footer`,
`hero`, `cart`, `checkout`, `wishlist`, `orders`, `showcase`, `category`,
`accountDropdown`, `customizeJewellery`, `socialProof` — has been merged:
each one's render file(s) moved into its `features/<domain>/` folder
alongside the logic that already lived there, and `components/<domain>/`
was deleted. This was done because, for a small domain, having to check
two differently-named top-level folders just to make one change costs more
time than it saves.

A domain whose markup is small and has exactly one consumer (e.g.
`whatsapp`, `toast`, `scrollToTop`, `craftsmanship`, `marquee`,
`announcement`, `whyChooseUs`, `quickAdd`, `contact`, `instagramGallery`)
never had a separate `components/` folder to begin with — its `create*`
markup function has always lived right in the single `features/<domain>/*.js`
file that uses it.

**Naming collisions from the merge**: four domains had a render file with
the exact same filename as a logic file already sitting in
`features/<domain>/` (`searchOverlay.js`, `modal.js`, `customizeProducts.js`,
`dropdown.js`). To keep both without one silently shadowing the other, the
incoming render file was renamed with a `render` prefix:
- `features/navbar/renderSearchOverlay.js` (markup) vs.
  `features/navbar/searchOverlay.js` (behavior)
- `features/customizeJewellery/renderModal.js` (markup) vs.
  `features/customizeJewellery/modal.js` (behavior)
- `features/customizeJewellery/renderCustomizeProducts.js` (markup) vs.
  `features/customizeJewellery/customizeProducts.js` (behavior)
- `features/accountDropdown/renderDropdown.js` (markup) vs.
  `features/accountDropdown/dropdown.js` (behavior)

If a new render function's natural name would collide with an existing
behavior file in the same merged domain (or vice versa), follow the same
`render*`-prefix convention rather than inventing an unrelated name.

---

## 3. "I want to change X" — where to look

| You want to... | Open this |
|---|---|
| Change a page's static text, layout, SEO meta tags | The relevant file in `pages/*.html` (or `index.html` for home) |
| Add a brand-new page/route | Create `pages/newPage.html` + `src/pages/newPage.js`, then add an `if (document.getElementById(...))` block in `src/main.js` that dynamically imports it |
| Change the navbar (links, mobile menu, search) | `src/features/navbar/` — `navbar.js`/`desktopNav.js`/`mobileNav.js`/`renderSearchOverlay.js` (markup) + `activeLink.js`/`scroll.js`/`mobileDrawer.js`/`searchOverlay.js` (behavior) |
| Change the account dropdown (logged-in menu, guest menu) | `src/features/accountDropdown/` — `renderDropdown.js`/`guestMenu.js`/`userMenu.js` (markup) + `dropdown.js` (open/close/logout behavior) |
| Change the footer (links, newsletter, accordion) | `src/features/footer/` — `footer.js`/`footerLinks.js`/`footerAccordion.js`/`copyright.js`/`seoLinks.js` (markup) + `newsletter.js`/`hydrateSocialLinks.js` (behavior) |
| Change the homepage hero slider | `src/features/hero/` — `hero.js`/`slides.js`/`indicators.js` (markup) + `slider.js` (drag/autoplay), `timeline.js` (autoplay timer), `animations.js` (enter/zoom transitions) + `src/constants/heroSlides.js` |
| Change the homepage showcase (trending/new-arrival tabs) | `src/features/showcase/` — `showcaseCard.js`/`showcaseSection.js` (markup) + `carousel.js`/`tabs.js`/`renderShowcase.js` (behavior) + `src/constants/showcaseProducts.js` (fallback data) |
| Change the homepage Instagram gallery | `src/features/instagramGallery/` + `src/constants/instagramGallery.js` |
| Change the homepage marquee / scrolling banner | `src/features/marquee/` (`marqueeInit.js` markup + `marquee.css` for styling not covered by Tailwind) |
| Change the top announcement bar | `src/features/announcement/` (`announcementInit.js` markup + `announcement.css` for styling not covered by Tailwind) |
| Change "why choose us" section | `src/features/whyChooseUs/` + `src/constants/whyChooseUs.js` |
| Change the craftsmanship/process section | `src/features/craftsmanship/` |
| Change the homepage "Shop by Category" grid | `src/features/category/` — `categoryCard.js` (markup) + `renderCategory.js` (behavior) |
| Change product listing (filters, sorting, pagination, grid) | `src/features/products/` (`filters.js`, `pipeline.js`, `pagination.js`, `toolbar.js`, `grid.js`, `state.js`, `api.js`, `query.js`, `hero.js`) + `src/pages/productsPage.js` |
| Change product details page (gallery, reviews, variants, size, delivery check, related/recently viewed) | `src/features/productDetails/` + `src/components/productDetails/` + `src/pages/productDetailsPage.js` |
| Change cart behavior/UI (add/remove, quantities, badge count) | `src/features/cart/` — `cartState.js`/`cartBadge.js`/`cartPageInit.js` (behavior) + `cartItemRow.js`/`cartLayout.js`/`cartSummary.js` (markup) + `src/services/cartService.js` |
| Change "Quick Add" (pick-a-size add-to-cart modal from product cards) | `src/features/quickAdd/` |
| Change checkout flow (address, payment methods, order summary/confirmation) | `src/features/checkout/` — `addressPanel.js`/`paymentPanel.js`/`orderPanel.js`/`checkoutPageInit.js` (behavior) + `addressSelector.js`/`checkoutLayout.js`/`orderSummary.js`/`orderConfirmation.js`/`paymentMethods.js` (markup) + `src/pages/checkoutPage.js` |
| Change wishlist | `src/features/wishlist/` — `wishlistState.js`/`wishlistBadge.js`/`wishlistButtons.js`/`wishlistPageInit.js` (behavior) + `wishlistCard.js`/`wishlistLayout.js` (markup) + `src/services/wishlistService.js` |
| Change login/register/forgot-password/auth modal/Google login | `src/features/auth/` + `src/components/auth/` + `src/services/authService.js` |
| Change the guest login nudge (timer/exit-intent prompt for logged-out users) | `src/features/auth/guestEngagement.js` + `src/features/auth/authModal.js` + `src/features/auth/authModalData.js` |
| Change user profile / saved addresses / order history in profile | `src/features/profile/` + `src/components/profile/` + `src/services/addressService.js`, `src/services/ordersService.js` |
| Change past orders page | `src/features/orders/` — `model.js`/`ordersPageInit.js` (behavior) + `orderCard.js`/`ordersLayout.js` (markup) + `src/services/ordersService.js` |
| Change FAQ page or homepage FAQ accordion | `src/features/faqPage/` (dedicated `/faq` page) or `src/features/homeFaq/` (homepage widget) + `src/components/faq/` |
| Change contact page / contact form | `src/features/contact/` + `src/services/contactService.js` |
| Change "Customize Jewellery" floating button/modal/form | `src/features/customizeJewellery/` — `customizeJewelleryInit.js`/`customizeProducts.js`/`modal.js`/`validation.js` (behavior) + `floatingButton.js`/`form.js`/`renderModal.js`/`renderCustomizeProducts.js` (markup) + `src/services/customizeService.js` / `customizeProductService.js` |
| Change reviews (list, star summary, write a review) | `src/features/productDetails/reviews.js` + `src/components/productDetails/reviewsSection.js` / `reviewModal.js` + `src/services/reviewService.js` |
| Change coupons / offers shown on product page | `src/features/productDetails/offers.js` + `src/components/productDetails/offersSection.js` + `src/services/offersService.js` |
| Change gift cards | `src/services/giftCardsService.js` (feature/UI currently minimal — check `src/features/profile/` and `src/pages/profilePage.js` for where it's surfaced) |
| Change postal code / delivery estimate check | `src/features/productDetails/delivery.js` + `src/components/productDetails/deliveryChecker.js` + `src/services/postalCodeService.js` |
| Change privacy policy / shipping policy / terms text | `pages/privacy-policy.html`, `pages/shipping-policy.html`, `pages/terms-and-conditions.html` — rendered via `src/pages/policies/initPolicyPage.js` + `src/utils/renderPolicy.js` |
| Change toast notifications (styling/behavior) | `src/features/toast/` |
| Change the floating WhatsApp button | `src/features/whatsapp/` |
| Change "scroll to top" button | `src/features/scrollToTop/` |
| Change the "X just explored Y" social-proof toast widget | `src/features/socialProof/` — `socialProofWidget.js` (markup) + `socialProofInit.js` (behavior) |
| Change scroll/reveal animations sitewide | `src/features/animations/reveal.js` + `src/features/animations/animations.css` |
| Change/add a backend endpoint URL, switch backend environment | `src/config.js` (`API_BASE_URL`, `API_ENDPOINTS`) |
| Change how API requests are made (headers, timeout, error format) | `src/services/apiClient.js` |
| Change hardcoded/fallback content (nav links, hero slides, Instagram gallery picks, "why choose us" copy, fallback showcase products) | `src/constants/` |
| Change global styles, colors, spacing not covered by Tailwind utility classes | `src/css/main.css` |
| Change images/photos | `src/assets/<category>/` (`bracelets`, `chains`, `earrings`, `rings`, `icons`, `images`, `process`) |
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
  function in the module.
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
- **Naming pattern**: component (view) files export `create*` functions
  that return an HTML string or DOM node (e.g. `createCartLayout`,
  `createOrderCard`). Feature (behavior) files export `init*` functions
  that wire up a section after it's in the DOM (e.g. `initCartPage`,
  `initReviews`), plus occasional state getters/mutators
  (`getCartItems`, `setGiftWrap`, `addToWishlist`).
- **No `index.js` files at all, barrel or otherwise**: every import points
  straight at the file that defines the thing (e.g. `import { createFooter }
  from "./footer.js"`). This codebase used to name each domain's top-level
  controller `index.js` (its `init*` entry point that wires the domain
  together — fetch, render, init sub-modules), which is confusing because
  `index.js` conventionally means "barrel/re-export file" in most other
  codebases, and this one was never that. Every one of those controllers
  has been renamed to `<domain>Init.js` instead (e.g. `features/hero/heroInit.js`,
  `features/productDetails/productDetailsInit.js`, `features/navbar/navbarInit.js`).
  When adding a new domain that needs a top-level wiring entry point,
  name it `<domain>Init.js`, not `index.js`.

---

## 5. File-level index

Every source file, one line each, grouped the same way as section 2.
Component (`create*`) files build markup; feature (`init*`) files wire up
behavior/state — see the naming convention above.

### `src/` root

| File | What it does |
|---|---|
| `src/main.js` | App entry point. Initializes global UI on every page (navbar, footer, toast, cart/wishlist sync, auth, WhatsApp button, scroll-to-top, animations) then detects the current page by slot element and dynamically imports the matching `src/pages/*` controller. |
| `src/config.js` | `API_BASE_URL`, `STORE_DOMAIN`, `GOOGLE_CLIENT_ID`, and `API_ENDPOINTS` — the full map of backend routes grouped by resource (AUTH, ADDRESS, CONTACT, CUSTOMIZE, PRODUCTS, WEBSITE, etc). |

### `src/pages/` — page controllers (one per route)

| File | What it does |
|---|---|
| `cartPage.js` | `loadCartPage()` — boots the `/cart` page. |
| `checkoutPage.js` | `loadCheckoutPage()` — boots the `/checkout` page. |
| `contactPage.js` | `initContactPage()` — boots the `/contact` page. |
| `faqPage.js` | `loadFAQPage()` — boots the dedicated `/faq` page. |
| `forgotPasswordPage.js` | `loadForgotPasswordPage()` — boots the forgot-password page. |
| `homePage.js` | `initHomePage()` — boots the homepage: hero, showcase, Instagram gallery, marquee, craftsmanship, why-choose-us, home FAQ, shop-by-category, social proof toasts. |
| `loginPage.js` | `loadLoginPage()` — boots the login page. |
| `ordersPage.js` | `loadOrdersPage()` — boots the past-orders page. |
| `policies/initPolicyPage.js` | `initPolicyPage(...)` — shared controller for privacy/shipping/terms pages; fetches policy text and renders it via `src/utils/renderPolicy.js`. |
| `productDetailsPage.js` | `loadProductDetailsPage()` — boots the PDP (product details page). |
| `productsPage.js` | `loadProductsPage()` — boots the product listing/category page. |
| `profilePage.js` | `loadProfilePage()` — boots the account/profile page. |
| `registerPage.js` | `loadRegisterPage()` — boots the register page. |
| `wishlistPage.js` | `loadWishlistPage()` — boots the wishlist page. |

### `src/services/` — backend API wrappers

| File | What it does |
|---|---|
| `apiClient.js` | The single low-level `fetch` wrapper used by every service: injects the auth header, applies a request timeout, parses JSON, normalizes errors. |
| `addressService.js` | `addressService` — CRUD calls for saved shipping addresses (list/add/update/delete). |
| `authService.js` | `authService` — login, register, Google login, logout, get/update profile, change password, forgot-password/OTP verify. |
| `cartService.js` | `cartService` — backend calls the cart syncs against (used alongside the localStorage-backed guest cart). |
| `contactService.js` | `contactService` — submits the contact-us form. |
| `customizeProductService.js` | `customizeProductService` — fetches the product list shown inside the "Customize Jewellery" modal. |
| `customizeService.js` | `customizeService` — submits a "Customize Jewellery" request. |
| `giftCardsService.js` | `giftCardsService` — gift card API calls (minimal current UI usage — check `src/features/profile/` / `src/pages/profilePage.js`). |
| `offersService.js` | `offersService` — fetches coupons/offers shown on the product details page. |
| `ordersService.js` | `ordersService` — past orders list/detail, and order placement. |
| `postalCodeService.js` | `postalCodeService` — delivery-estimate-by-pincode lookup used on the PDP. |
| `productService.js` | `productService` — product listing/search/detail/similar-products calls. |
| `reviewService.js` | `reviewService` — fetch/submit product reviews. |
| `websiteService.js` | `websiteService` — misc storefront/site-config calls (e.g. marquees/announcements, social links). |
| `wishlistService.js` | `wishlistService` — backend-backed wishlist add/remove/list (wishlist requires login, unlike cart). |

### `src/utils/` — generic helpers

| File | What it does |
|---|---|
| `authRedirect.js` | `rememberAuthRedirect()` / `consumeAuthRedirect()` — stash and restore the page a guest was on before being sent to login, so they land back where they started. |
| `cartLine.js` | Cart line-item size helpers: `describeVariant`, `buildCartSize`, `parseCartSize`, `formatCartSize` — encode/decode the "size" string stored per cart line. |
| `categoryMatch.js` | `normalizeForComparison` / `toStringList` — normalizes category names/values for filter matching. |
| `format.js` | `formatPrice`, `getProductDetailsHref(id, slug)`, `escapeHtml` — shared formatting/HTML-escaping helpers used across components. |
| `getProductImages.js` | `getProductImages(product)` — resolves the image list for a product from whatever shape the backend returns. |
| `icon.js` | `icon(...)` — inline SVG icon helper used by components instead of an icon font/library. |
| `isAuthPage.js` | `isAuthPage()` — detects whether the current page is login/register/forgot-password (used to skip guest-engagement prompts there). |
| `productImages.js` | `PLACEHOLDER_IMAGE`, `toGalleryUrls`, `getGalleryUrls`, `getPrimaryImage`, `getCardImages` — image-URL derivation for product cards/galleries, with a placeholder fallback. |
| `productStatus.js` | `isActiveProduct(product)` — checks whether a product is active/purchasable (vs. hidden/discontinued). |
| `pruneBrokenImages.js` | `isImageReachable`, `pruneBrokenImages`, `pruneProductImages` — probes image URLs and strips ones that 404, so broken photos don't render. |
| `renderPolicy.js` | `renderPolicySections(...)` — turns policy page backend content into rendered HTML sections (used by `src/pages/policies/initPolicyPage.js`). |
| `seo.js` | `setCanonicalUrl(path)` — rewrites the page's `<link rel="canonical">` href at runtime. Only needed by pages whose canonical URL depends on data not known until after render (currently just `product-details.html`, called from `features/productDetails/productDetailsInit.js` once a product resolves); every other page just hardcodes its own canonical tag in its HTML `<head>`. **Known gap:** a crawler that fetches `product-details.html`'s raw HTML without running this JS gets no canonical at all (see the `<noscript>` comment in that file) rather than a wrong one. **TODO (follow-up, not yet started):** generate one static HTML file per product at deploy time (a script looping over `getPublicProducts()` from `productService.js`, emitting a file per product with the canonical/title/meta baked in) instead of serving every product through this single templated file — same enumeration problem `sitemap.xml`'s per-product gap below has, and could plausibly share one script. |
| `toast.js` | `showToast({...})` — low-level trigger used by feature code to fire a toast notification (renders via the container built in `src/features/toast/toastInit.js`). |

### `src/constants/` — static/fallback data

| File | What it does |
|---|---|
| `heroSlides.js` | `HERO_SLIDES` — homepage hero slider content. |
| `instagramGallery.js` | `INSTAGRAM_GALLERY` — homepage Instagram gallery tile data (images/links). |
| `navigation.js` | `NAVIGATION` — the shop category links shared by the navbar, mobile drawer, search overlay, and footer. |
| `products.js` | `PRODUCTS` — fallback/seed product data. |
| `showcaseProducts.js` | `SHOWCASE_TABS` — tab config + fallback products for the homepage showcase section. |
| `whyChooseUs.js` | `WHY_CHOOSE_US` — copy/icons for the "why choose us" homepage section. |

### `src/features/` — behavior, state, API orchestration (by domain)

| File | What it does |
|---|---|
| `accountDropdown/dropdown.js` | `initAccountDropdown()` — wires open/close + logout behavior for the navbar account dropdown. |
| `accountDropdown/renderDropdown.js` | `createAccountDropdown(user)` — builds the navbar account dropdown shell (markup; named `render*` because a same-named behavior file, `dropdown.js` above, already existed here). |
| `accountDropdown/guestMenu.js` | `createGuestMenu()` — dropdown contents shown to a logged-out visitor. |
| `accountDropdown/userMenu.js` | `createUserMenu(user)` — dropdown contents shown to a logged-in user. |
| `animations/reveal.js` | `initRevealAnimations()` — sitewide scroll-triggered reveal animations. |
| `announcement/announcementInit.js` | `getActiveMarquees()`, `initAnnouncementBar(container)` — fetches and renders the top announcement/marquee bar (markup built inline, single consumer). |
| `auth/authGuard.js` | `requireAuth(callback, type)` — gates an action behind login, opening the auth modal/prompt if the user isn't logged in. |
| `auth/authModal.js` | `createAuthModal()` — builds and controls the login/register modal shown to guests (timer/exit-intent prompts). |
| `auth/authModalData.js` | `AUTH_MODAL_DATA` — copy/content shown inside the guest auth modal. |
| `auth/authPage.js` | `initLogin()`, `initRegister()`, `initForgotPassword()` — wires the dedicated (non-modal) auth pages. |
| `auth/authState.js` | `getCurrentUser`, `isLoggedIn`, `whenAuthReady`, `hydrateAuth`, `logout` — the source of truth for current-user/session state; fires the `authChanged` event other features listen for. |
| `auth/authTextSlider.js` | `initAuthTextSlider()` — rotating marketing text shown alongside the auth form. |
| `auth/authTriggers.js` | `initAuthModal`, `openAuthModal(type)`, `closeAuthModal` — wires what opens/closes the guest auth modal (buttons, timers, guard callbacks). |
| `auth/guestEngagement.js` | `showGuestPrompt(type)`, `initGuestEngagement()` — timer/exit-intent logic that nudges logged-out visitors to sign in. |
| `auth/passwordToggle.js` | `initPasswordToggle()` — show/hide password field eye-icon behavior. |
| `auth/validation.js` | `initLoginValidation`, `initRegisterValidation`, `initForgotPasswordValidation` — client-side form validation for the three auth forms. |
| `cart/cartBadge.js` | `initCartBadgeSync()` — keeps the navbar cart-count badge in sync with cart state. |
| `cart/cartPageInit.js` | `initCartPage()` — wires the `/cart` page (renders lines, quantity changes, remove, gift wrap, totals). |
| `cart/cartState.js` | Core cart state module: `loadCart`, `initCartSync`, `repairCartImages`, `getCartItems`, `getGiftWrap`/`setGiftWrap`, `getAvailableCartItems`, `getCartCount`, `getCartSubtotal`, `addToCart`, `updateCartItemQuantity`, `removeCartItem`, `clearCart`. Guest cart is localStorage-backed; syncs against `cartService` when logged in. |
| `cart/cartItemRow.js` | `createCartItemRow(item)` — a single cart line item row (qty stepper, remove, price). |
| `cart/cartLayout.js` | `createCartLayout()` — overall cart page shell (list + summary regions). |
| `cart/cartSummary.js` | `createCartSummary({...})` — order totals/summary box on the cart page. |
| `category/renderCategory.js` | `initCategory()` — fetches/renders the homepage "Shop by Category" grid. |
| `category/categoryCard.js` | `createCategoryCard(category)` — a single homepage category card. |
| `checkout/addressPanel.js` | `getSelectedAddress`, `initAddressPanel(onChange)` — address selection step of checkout. |
| `checkout/checkoutPageInit.js` | `initCheckoutPage()` — top-level wiring for the checkout page, ties address/payment/order panels together. |
| `checkout/orderPanel.js` | `initOrderPanel(onPlaced)`, `syncPayButtonState` — order summary + "place order" step. |
| `checkout/paymentPanel.js` | `getSelectedPaymentMethod`, `initPaymentPanel()` — payment method selection step. |
| `checkout/addressSelector.js` | `createAddressSelector(addresses, selectedId)` — saved-address picker at checkout. |
| `checkout/checkoutLayout.js` | `createCheckoutLayout()` — overall checkout page shell. |
| `checkout/orderConfirmation.js` | `createOrderConfirmation(order)` — post-order confirmation screen markup. |
| `checkout/orderSummary.js` | `createOrderSummary(items, totals, options)` — order summary box at checkout. |
| `checkout/paymentMethods.js` | `createPaymentMethods(selected)` — payment method radio list at checkout. |
| `contact/contact.js` | `initContact()` — renders the contact form (markup built inline, single consumer) and wires its submit flow. |
| `contact/faq.js` | `initFAQ()` — an FAQ accordion used within the contact page (distinct from the dedicated FAQ page/homepage widget below). |
| `contact/hydrateContactInfo.js` | `hydrateContactInfo()` — fills in contact page details (address/phone/email) from the backend. |
| `craftsmanship/craftsmanshipInit.js` | `initCraftsmanship()` — renders the homepage craftsmanship/process section (markup built inline, single consumer). |
| `customizeJewellery/customizeJewelleryInit.js` | `initCustomizeJewellery()` — wires the floating "Customize Jewellery" button + modal together. |
| `customizeJewellery/customizeProducts.js` | `initCustomizeProducts()` — loads/renders the product picker shown inside the customize modal. |
| `customizeJewellery/modal.js` | `openCustomizeModal`, `initCustomizeModal` — open/close and submit wiring for the customize modal. |
| `customizeJewellery/validation.js` | `initCustomizeJewelleryValidation()` — validates the customize request form. |
| `customizeJewellery/floatingButton.js` | `createCustomizeJewelleryButton()` — the floating "Customize Jewellery" button. |
| `customizeJewellery/form.js` | `createCustomizeJewelleryForm()` — the customize-request form markup. |
| `customizeJewellery/renderModal.js` | `createCustomizeJewelleryModal()` — the customize modal shell (markup; `render*` name because `modal.js` above already holds the open/close behavior). |
| `customizeJewellery/renderCustomizeProducts.js` | `createCustomizeProductCard(...)` — product card used inside the customize modal's picker (markup; `render*` name because `customizeProducts.js` above already holds the fetch/init behavior). |
| `faqPage/faqPageInit.js` | `initFAQ()` — wires the dedicated `/faq` page (accordion + category filter). |
| `faqPage/accordion.js` | `initAccordion()` — expand/collapse behavior for FAQ items. |
| `faqPage/filter.js` | `initCategoryFilter()` — category filter tabs on the FAQ page. |
| `faqPage/renderFaqs.js` | `renderFaqs()`, `getFAQData()` — fetches/renders the FAQ list. |
| `footer/hydrateSocialLinks.js` | `hydrateFooterSocialLinks()` — fills in footer social icons from backend/constants data. |
| `footer/newsletter.js` | `initFooterNewsletter()` — wires the footer newsletter signup form. |
| `footer/copyright.js` | `createCopyright()` — the copyright line markup. |
| `footer/footer.js` | `createFooter()` — the overall footer shell (assembles links, newsletter, accordion, copyright). |
| `footer/footerAccordion.js` | `initFooterAccordion()` — mobile footer accordion expand/collapse (note: named like a behavior file but lives with the other markup files here). |
| `footer/footerLinks.js` | `createSocialIcons(socialLinks)`, `createFooterLinks(socialLinks)` — footer link columns + social icon row. |
| `footer/seoLinks.js` | `createSeoLinks()` — extra SEO-oriented footer link block. |
| `hero/heroInit.js` | `initHero()` — wires the homepage hero (slides + slider + timeline + animations together). |
| `hero/animations.js` | `animateImageEnter`, `animateButton`, `animateDescription`, `animateTitleLine`, `animateImageZoom` — per-slide entrance/zoom animation helpers. |
| `hero/slider.js` | `initHeroSlider`, `destroyHeroSlider` — drag/swipe + slide-change mechanics for the hero. |
| `hero/timeline.js` | `startTimeline`, `pauseTimeline`, `resumeTimeline`, `cancelTimeline`, `getTimelineProgress`, `isTimelineRunning` — autoplay timer driving automatic hero slide changes. |
| `hero/hero.js` | `createHero(heroSlides)` — the hero section shell. |
| `hero/indicators.js` | `createHeroIndicators(slideCount)` — the hero slide dot/indicator markup. |
| `hero/slides.js` | `createHeroSlides(heroSlides)` — individual hero slide markup. |
| `homeFaq/accordion.js` | `initHomeFaq()` — wires the condensed FAQ accordion widget shown on the homepage (separate from `faqPage/`). |
| `instagramGallery/instagramGalleryInit.js` | `initInstagramGallery()` — renders the homepage Instagram gallery section shell (markup built inline, single consumer). |
| `instagramGallery/renderInstagramGallery.js` | `renderInstagramGallery()` — renders the gallery tiles from `src/constants/instagramGallery.js` (tile markup built inline, single consumer). |
| `marquee/marqueeInit.js` | `initMarquee()` — fetches and renders the scrolling marquee/banner strip (markup built inline, single consumer). |
| `navbar/navbarInit.js` | `initNavbar()` — top-level navbar wiring (ties together active-link, scroll, mobile drawer, search overlay). |
| `navbar/activeLink.js` | `initActiveLink()` — highlights the current page's nav link. |
| `navbar/mobileDrawer.js` | `initMobileDrawer()` — open/close behavior for the mobile nav drawer. |
| `navbar/scroll.js` | `initScroll()` — navbar show/hide/shrink-on-scroll behavior. |
| `navbar/searchOverlay.js` | `initSearchOverlay()` — wires the full-screen search overlay. |
| `navbar/desktopNav.js` | `createDesktopNav(...)` — desktop nav links markup. |
| `navbar/mobileNav.js` | `createMobileNav()`, `refreshMobileAccount()`, `initMobileDrawer()` — mobile nav drawer markup **and** its drawer open/close wiring (an exception — behavior lives here too, not just in `mobileDrawer.js`). |
| `navbar/navbar.js` | `createNavbar(...)` — overall navbar shell (assembles desktop/mobile nav, account dropdown, search). |
| `navbar/renderSearchOverlay.js` | `createSearchOverlay()` — full-screen search overlay markup (`render*` name because `searchOverlay.js` above already holds the wiring behavior). |
| `orders/model.js` | `getProductImage(product)`, `normalizeOrder(order)` — shapes raw backend order data for display. |
| `orders/ordersPageInit.js` | `initOrdersPage()` — wires the past-orders list page. |
| `orders/orderCard.js` | `createOrderCard(order)` — a single past-order summary card. |
| `orders/ordersLayout.js` | `createOrdersLayout()` — overall past-orders page shell. |
| `productDetails/productDetailsInit.js` | `initProductDetailsPage()` — top-level PDP wiring; imports and calls the other `productDetails/*` init functions below. |
| `productDetails/cart.js` | `initAddToCart()`, `initBuyNow()` — add-to-cart and buy-now button behavior on the PDP. |
| `productDetails/delivery.js` | `initDeliveryChecker()` — pincode-based delivery estimate check on the PDP. |
| `productDetails/gallery.js` | `initGallery()` — main image + thumbnail gallery behavior on the PDP. |
| `productDetails/lightbox.js` | `initLightbox()` — full-screen image lightbox/zoom on the PDP. |
| `productDetails/model.js` | Data-shaping helpers for a single product: `pickDefaultVariant`, `pickDefaultSize`, `normalizeProduct`, `formatPrice`, `getAvailabilityLabel`, `formatDiscount`, `escapeHtml`. |
| `productDetails/offers.js` | `initOffers()` — fetches/renders coupons/offers applicable to the current product. |
| `productDetails/quantity.js` | `initQuantitySelector()`, `refreshQuantityLimits()` — quantity stepper behavior + stock-based limits. |
| `productDetails/recentlyViewed.js` | `saveRecentlyViewed()`, `initRecentlyViewed()` — tracks and renders the "recently viewed" product rail (localStorage-backed). |
| `productDetails/relatedProducts.js` | `initRelatedProducts()` — fetches/renders the "you may also like" rail. |
| `productDetails/reviews.js` | `initReviews()` — loads reviews, wires the "write a review" modal, updates the star summary. |
| `productDetails/share.js` | `initShareButton()` — wires the product share button (native share/copy link). |
| `productDetails/size.js` | `initSizeSelector()` — size-picker behavior on the PDP. |
| `productDetails/state.js` | `getProductId()`, `getProductSlug()` (reads the product identifier out of the current URL), `productState` + setters (`setProduct`, `applyVariantToProduct`, `setQuantity`, `setActiveImage`, `setActiveTab`, `setSelectedSize`, `setSelectedVariant`) — the single in-memory state object the whole PDP reads/writes. |
| `productDetails/tabs.js` | `initProductTabs()` — description/details/reviews tab switching on the PDP. |
| `productDetails/variant.js` | `initVariantSelector()` — variant (e.g. metal/color) picker behavior on the PDP. |
| `productDetails/wishlist.js` | `initWishlistToggle()` — wishlist heart-icon toggle behavior on the PDP. |
| `products/productsInit.js` | `initProductsPage()` — top-level wiring for the product listing/category page. |
| `products/api.js` | `hasFreshProductsCache`, `fetchProducts`, `fetchCategoryFacets` — data fetching + a client-side cache for the listing page. |
| `products/filters.js` | `renderCategoryOptions`, `createProductsFilters`, `renderProductsFilters`, `openMobileFilters`, `closeMobileFilters`, `initFilterEvents`, `restoreFilterUI` — the filter sidebar/mobile filter drawer (category, price range, etc). |
| `products/grid.js` | `renderProductsLoading`, `renderProductsError`, `renderProductsGrid` — renders the product card grid + its loading/error states. |
| `products/hero.js` | `createProductsHero`, `renderProductsHero`, `updateHeroCount` — the category hero banner + result count at the top of the listing page. |
| `products/pagination.js` | `renderProductsPagination(...)` — pagination controls for the listing page. |
| `products/pipeline.js` | `isNewArrival(product)`, `applyProductsPipeline()` — client-side filter/sort/pagination pipeline applied to the fetched product list. |
| `products/query.js` | `getProductsQuery`, `restoreProductsStateFromURL`, `updateProductsURL`, `resetProductsURL` — keeps filter/sort/page state in sync with the URL query string. |
| `products/state.js` | `productsState` — the in-memory state object for the listing page (filters, sort, page, results). |
| `products/toolbar.js` | `createProductsToolbar`, `renderProductsToolbar`, `initToolbarEvents` — the sort/view-toggle toolbar above the grid. |
| `profile/addresses.js` | `loadAddresses`, `initProfileAddresses` — the "saved addresses" tab in the profile page. |
| `profile/orders.js` | `initProfileOrders()` — the "orders" tab in the profile page. |
| `profile/profileInfo.js` | `initProfileInfo()` — the "edit profile info" tab/form. |
| `profile/profilePageInit.js` | `initProfilePage()` — top-level wiring for the profile page (sidebar tab switching + delegates to the above). |
| `quickAdd/quickAddInit.js` | `initQuickAdd()` — the "Quick Add" size-picker modal (markup built inline, single consumer) triggered from product cards. |
| `scrollToTop/scrollToTopInit.js` | `initScrollToTopButton()` — the scroll-to-top button (markup built inline, single consumer) + show/hide/click-to-top behavior. |
| `showcase/showcaseInit.js` | `initShowcase()` — wires the homepage showcase section (tabs + carousel + data load together). |
| `showcase/carousel.js` | `initShowcaseCarousel()` — drag/scroll carousel behavior for showcase cards. |
| `showcase/renderShowcase.js` | `renderShowcaseSkeleton`, `loadShowcaseProducts`, `renderShowcase(activeTab)` — fetches and renders showcase products per active tab. |
| `showcase/tabs.js` | `initShowcaseTabs()` — tab-switching (e.g. Trending/New Arrivals) behavior. |
| `showcase/showcaseCard.js` | `createShowcaseCard(...)` — a single showcase product card. |
| `showcase/showcaseSection.js` | `createShowcaseSection()` — homepage showcase section shell (tabs + card grid container). |
| `socialProof/socialProofInit.js` | `initSocialProofToasts()` — drives the rotating "X just explored Y" toast widget (timing/rotation logic). |
| `socialProof/socialProofWidget.js` | `createSocialProofContainer()`, `createSocialProofCard({...})` — the rotating "X just explored Y" toast markup. |
| `toast/toastInit.js` | `initToast()` — global toast container (markup built inline, single consumer) init, listens for toast-trigger events from `src/utils/toast.js`. |
| `whatsapp/whatsappInit.js` | `initFloatingWhatsAppButton()` — the floating WhatsApp contact button (markup built inline, single consumer) + its wiring. |
| `whyChooseUs/renderFeatures.js` | `renderWhyChooseUs()` — renders the "why choose us" feature cards (markup built inline, single consumer) from `src/constants/whyChooseUs.js`. |
| `wishlist/wishlistBadge.js` | `initWishlistBadgeSync()` — keeps the navbar wishlist-count badge in sync. |
| `wishlist/wishlistButtons.js` | `initWishlistButtons()` — wires heart/toggle buttons on product cards sitewide. |
| `wishlist/wishlistPageInit.js` | `initWishlistPage()` — wires the `/wishlist` page. |
| `wishlist/wishlistState.js` | `loadWishlist`, `initWishlistSync`, `getWishlistIds`, `getWishlistCount`, `isWishlisted`, `addToWishlist`, `removeFromWishlist`, `toggleWishlist` — backend-backed wishlist state (requires login, unlike cart). |
| `wishlist/wishlistCard.js` | `createWishlistCard(product)` — a single wishlist product card. |
| `wishlist/wishlistLayout.js` | `createWishlistLayout()` — overall wishlist page shell. |

### `src/components/` — markup/view layer (by domain)

| File | What it does |
|---|---|
| `auth/authLayout.js` | `createAuthLayout({...})` — shared two-column layout wrapper for auth pages. |
| `auth/authPages.js` | `createLoginPage()`, `createRegisterPage()`, `createForgotPasswordPage()` — the three full auth pages (layout + matching form each). |
| `auth/forgotPasswordForm.js` | `createForgotPasswordForm()` — the forgot-password form markup. |
| `auth/loginForm.js` | `createLoginForm()` — the login form markup. |
| `auth/registerForm.js` | `createRegisterForm()` — the register form markup. |
| `faq/faqCard.js` | `createFaqCard(faq)` — a single FAQ accordion item (used by both `faqPage` and `homeFaq`). |
| `productDetails/addToCartButton.js` | `createAddToCartButton(product)` — the add-to-cart button on the PDP. |
| `productDetails/benefitsRow.js` | `createBenefitsRow()` — trust/benefit icons row (e.g. free shipping, easy returns) on the PDP. |
| `productDetails/buyNowButton.js` | `createBuyNowButton(product)` — the buy-now button on the PDP. |
| `productDetails/deliveryChecker.js` | `createDeliveryChecker()` — pincode input + delivery estimate UI on the PDP. |
| `productDetails/offersSection.js` | `createOffersSection()` — coupons/offers block on the PDP. |
| `productDetails/productDetailsLayout.js` | `createProductDetailsLayout(product)` — overall PDP shell that assembles gallery, info, tabs, etc. |
| `productDetails/productGallery.js` | `createProductGallery(product)` — main image + thumbnails markup. |
| `productDetails/productInfo.js` | `createPricing(product)`, `createProductInfo(product)` — title/price/variant info block. |
| `productDetails/productLightbox.js` | `createProductLightbox(product)` — full-screen image lightbox markup. |
| `productDetails/productTabs.js` | `createProductTabs(product)` — description/details/reviews tab markup. |
| `productDetails/quantitySelector.js` | `createQuantitySelector(product)` — the quantity stepper markup. |
| `productDetails/recentlyViewedSection.js` | `createRecentlyViewedSection()` — "recently viewed" rail shell. |
| `productDetails/relatedProductsSection.js` | `createRelatedProductsSection()` — "related products" rail shell. |
| `productDetails/reviewModal.js` | `createReviewModal()` — "write a review" modal markup. |
| `productDetails/reviewsSection.js` | `createStars(rating, sizeClass)`, `createReviewsSummary(product)`, `createReviewsSection(product)` — star rating rendering + reviews list/summary block. |
| `productDetails/shareButton.js` | `createShareButton()` — the share button markup. |
| `productDetails/stickyActionBar.js` | `createStickyActionBar(product)` — the mobile sticky add-to-cart bar. |
| `productDetails/wishlistButton.js` | `createWishlistButton(product)` — the wishlist heart-icon button on the PDP. |
| `profile/addressCard.js` | `createAddressCard(address)` — a single saved-address card. |
| `profile/addressesPanel.js` | `createAddressesPanel()` — the "saved addresses" tab panel shell. |
| `profile/addressFormModal.js` | `createAddressFormModal()` — add/edit address modal form. |
| `profile/ordersPanel.js` | `createProfileOrdersPanel()` — the "orders" tab panel shell within profile. |
| `profile/profileInfoForm.js` | `createProfileInfoForm(user)` — the edit-profile-info form. |
| `profile/profileLayout.js` | `createProfileLayout()` — overall profile page shell. |
| `profile/profileOverview.js` | `createProfileOverview({...})` — the "overview" tab summary panel. |
| `profile/profileSidebar.js` | `createProfileSidebar(user, activeTab)` — the profile page's left-nav sidebar/tab switcher markup. |

---
