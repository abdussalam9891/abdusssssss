# Changes

This file is a plain-language walkthrough of everything pushed to `main`, grouped
by feature area instead of by commit order, split into batches (one batch per
round of work). Each section says **what** changed, **why**, and which files were
touched. Commit hashes are listed at the bottom of each batch if you want to look
up the exact diff for any one of them (`git show <hash>`).

---

# Batch 1 (53 commits)

---

## 1. Product Reviews (new feature)

Previously the product page only showed a read-only aggregate rating (e.g. "4.5
stars, 12 reviews") pulled off the product object itself — there was no way for a
customer to actually read individual reviews or submit their own.

**Now:**
- The product page fetches the real review list and a fresh rating summary from
  the backend (`GET /review/getProductReviews/:id` and `GET /review/starsummary/:id`)
  and renders them as cards under the reviews section.
- A **"Write a Review"** button opens a modal where a signed-in customer picks a
  star rating, types a review, and submits it (`POST /review/createReview`). If
  they're not signed in, it shows a "sign in to review" prompt instead of failing
  silently.
- After a successful submission, the review list and summary refresh in place —
  no page reload.

**Files:**
- `src/services/reviewService.js` *(new)* — the API calls (list / summary / create).
- `src/components/productDetails/reviewModal.js` *(new)* — the modal markup (form, stars, textarea).
- `src/features/productDetails/reviews.js` *(new)* — all the behavior: loading reviews, star picker, submit handling, error states.
- `src/components/productDetails/reviewsSection.js` — reworked so the star-rating renderer and the ratings summary block can be reused by the new modal/list code instead of being locked inside one function.
- `src/components/productDetails/productDetailsLayout.js` — mounts the new modal on the page.
- `src/features/productDetails/index.js` — starts the reviews feature when a product page loads.
- `src/features/auth/authModalData.js` — adds the wording shown in the "please sign in" popup when an anonymous user clicks Write a Review.

---

## 2. Offers / Coupons (new feature)

The product page now shows an **"Offers For You"** section listing any active
store-wide coupon codes, fetched live from the backend. Each offer is a collapsible
row — clicking it reveals the coupon code and a "Copy Code" button (with a
confirmation toast). If there are no active coupons, or the request fails, the
section simply stays hidden — it never shows fake/placeholder offers.

**Files:**
- `src/services/offersService.js` *(new)* — calls `GET /customercoupons/getAvailableCoupons/:domain`.
- `src/components/productDetails/offersSection.js` *(new)* — the (initially hidden) section shell.
- `src/features/productDetails/offers.js` *(new)* — fetches coupons, renders rows, handles expand/collapse and copy-to-clipboard.
- `src/components/productDetails/productInfo.js` — slots the offers section into the page between price and the description tabs.

---

## 3. Real pincode delivery check

The pincode checker on the product page used to just show a generic "we deliver
across India" message for any 6-digit input — it never actually knew if a pincode
was serviceable, because no backend endpoint existed for it.

**Now:** it calls `GET /postalcode/:pincode`, and:
- If any post office branch for that pincode is marked deliverable, it shows
  "Delivery available for `<pincode>` — delivering to `<area>`."
- Otherwise (or on a network/API error) it honestly says the pincode isn't
  deliverable, instead of guessing.

**Files:**
- `src/services/postalCodeService.js` *(new)* — the API call + interpreting the response.
- `src/features/productDetails/delivery.js` — wires the checker's input/button to the real call, with a loading and disabled-button state while checking.
- `src/components/productDetails/deliveryChecker.js` — comment-only update pointing at where the real logic now lives.

---

## 4. Category filters now use real backend data

The "Filter by Category" checkboxes on the products page used to be a **hardcoded**
list (`rings`, `chains`, `bracelets`, `pendants`, `earrings`). If the store's
actual product categories didn't match that list, filtering silently broke.

**Now:** the filter list is built from the categories that actually exist on
real products (sampled from a broad product query in the background), so it can
never drift out of sync with the backend. There's also matching logic so a fixed
nav link like "Rings" still correctly highlights/filters even if the backend
category is phrased differently (e.g. "Silver Ring").

**Files:**
- `src/utils/categoryMatch.js` *(new)* — shared helpers to normalize/compare category strings (`"Rings"` vs `"ring"` vs `"Silver-Ring"`) without touching the original text shown to users.
- `src/features/products/api.js` — new `fetchCategoryFacets()` that samples real subCategory values.
- `src/features/products/filters.js` — category checkboxes now render from real data instead of the hardcoded list.
- `src/features/products/index.js` — loads the category list in the background (never blocks the product grid) and reconciles nav-link category slugs against real values.
- `src/features/products/query.js` — stopped force-lowercasing category values from the URL, since real backend values are mixed-case.
- `src/features/products/state.js` — added a place to store the fetched category list.
- `src/services/productService.js` — removed a hardcoded category name-translation table that's no longer needed now that real category names are used end to end.
- `src/components/showcase/showcaseCard.js` — uses the new category-matching helper so a category badge never shows a single stray character if the backend sends a string instead of an array.

---

## 5. Scroll-to-top button (new)

A small "back to top" button now appears (on desktop/large screens) after
scrolling down 400px on any page, and smooth-scrolls back to the top when
clicked. It's purely local UI — no backend involved.

**Files:**
- `src/components/scrollToTop/` *(new)* — button markup.
- `src/features/scrollToTop/index.js` *(new)* — show/hide on scroll, click handler.
- `src/main.js` — starts it on every page load.

---

## 6. "Custom Jewellery" is now reachable from every page

Previously the Custom Jewellery button/modal only rendered on the homepage. Links
to it from the account dropdown or mobile nav on *other* pages (products, product
details) went to a dead page or did nothing.

**Now:** the button + modal markup can render into any page that has the right
containers, and a link to `/index.html#customize-jewellery` from another page will
correctly open the modal once the homepage loads.

**Files:**
- `src/features/customizeJewellery/index.js` — renders the button/modal into whichever page has the containers; opens the modal automatically if arriving via the `#customize-jewellery` link.
- `src/features/customizeJewellery/modal.js` — switched from one hardcoded open-button to a shared `.js-open-customize-modal` trigger class so any element sitewide can open it; exposes `openCustomizeModal()` for the deep-link case above.
- `src/components/customizeJewellery/floatingButton.js` — tagged with the shared trigger class.
- `src/components/customizeJewellery/modal.js` — mobile styling: full-height sheet on small screens, centered dialog on larger ones.
- `src/components/accountDropdown/userMenu.js` — "Custom Jewellery" link now uses the shared trigger instead of a broken page link.
- `src/components/navbar/mobileNav.js` / `src/features/navbar/mobileDrawer.js` — mobile nav's Custom Jewellery entry uses the same trigger; drawer closes itself when it's clicked.
- `src/pages/homePage.js` — removed the old homepage-only rendering code now that it's handled centrally.
- `src/main.js` — customize-jewellery init now runs on any page that has the containers, not just home.
- `pages/product-details.html`, `pages/products.html` — added the container elements these pages were missing.

---

## 7. Mobile navigation redesign

The mobile nav panel changed from a centered pop-up card to a **full-height
slide-in drawer from the left** (matching common mobile app patterns), with its
own scrollable body so long menus don't get clipped. The duplicate "Wishlist"
link (already reachable elsewhere in the menu) was removed, and "Custom
Jewellery" was moved into its own clearly-styled row.

**Files:** `src/components/navbar/mobileNav.js`, `src/features/navbar/mobileDrawer.js`.

Separately, `src/features/navbar/scroll.js` got a small fix: a currently-active
nav link (shown in gold) was losing its gold color when you scrolled — it now
stays gold regardless of scroll position.

---

## 8. Loading states for FAQ / Showcase / Home FAQ sections

These three sections used to go from blank straight to "here's the data" (or a
plain error line). Now each shows a **skeleton placeholder** while its data is
loading, and a nicer-styled empty/error message if the request fails — so the
page never looks broken or blank while waiting on the backend.

**Files:** `src/features/faqPage/renderFaqs.js`, `src/features/homeFaq/accordion.js`,
`src/features/showcase/index.js`, `src/features/showcase/renderShowcase.js`.

---

## 9. Collections section: real fallback images

If the "shop by category" section's API call fails, or returns categories that
don't match any of the site's known category images, it now falls back to a
local list built from the same real images used elsewhere — instead of showing
"No collections available" or a broken image.

**File:** `src/features/collections/renderCollections.js`.

---

## 10. Small UI/UX polish

- **Hero banner** — height now adapts per breakpoint (was one fixed height for
  all screens); on mobile, a blurred zoomed-in copy of the slide image fills the
  letterboxed edges behind the (now "contain"-fit) main image instead of leaving
  bare space. *(`src/components/hero/hero.js`, `src/components/hero/slides.js`)*
- **Testimonials** — cards resize responsively on small screens, and the
  carousel now supports swipe gestures on touch devices, not just the arrow
  buttons. *(`src/components/testimonials/testimonialCard.js`, `src/features/testimonials/carousel.js`)*
- **Product gallery & lightbox** — both now support swipe-to-change-image on
  touch devices. *(`src/features/productDetails/gallery.js`, `src/features/productDetails/lightbox.js`)*
- **WhatsApp floating button** — repositions itself above the mobile "Buy Now"
  sticky bar on product pages instead of overlapping it. *(`src/components/whatsapp/floatingButton.js`, `src/features/whatsapp/index.js`)*
- **Wishlist card** — sizing/spacing fixed for small screens so the "Move to
  Cart" button text no longer overflows. *(`src/components/wishlist/wishlistCard.js`)*
- **Wishlist page** — now shows "X items in your wishlist" under the heading.
  *(`src/components/wishlist/wishlistLayout.js`, `src/features/wishlist/wishlistPageInit.js`)*
- **Wishlist button label** — shortened from "Saved to Wishlist" to
  "Wishlisted". *(`src/features/productDetails/wishlist.js`)*
- **Product description tab** — now correctly renders bullet-point lines
  (backend text starting with "•") as an actual list instead of one flat
  paragraph; the unused "Price Breakdown" and "Occasion & Gifting" tabs (which
  had no real content behind them) were removed. *(`src/components/productDetails/productTabs.js`)*
- **Stock/availability label** — the product page and the Specifications tab
  used two separate, slightly different pieces of logic to decide what
  "Availability" text to show; they now share one helper so they can never say
  different things. *(`src/features/productDetails/model.js` — new
  `getAvailabilityLabel()`, used by `productInfo.js` and `productTabs.js`)*
- **Contact page** — now also initializes the static FAQ accordion on that page
  (previously only the contact form was wired up). *(`src/pages/contactPage.js`)*

---

## 11. Config

- `src/config.js` — the active backend URL switch was flipped to the dev
  tunnel URL (this is the existing manager-controlled toggle described in the
  project's CLAUDE.md, not a new mechanism). Also added endpoint definitions for
  the three new services above: pincode check, reviews, and coupons.

---

## 12. Known temporary/in-progress bits (called out honestly, not hidden)

- `src/features/productDetails/relatedProducts.js` — the "related products"
  section is temporarily previewing results using a stand-in product slug
  (`silver-tiara-crown-blue-ring`) instead of the current product's own slug,
  because the live catalog doesn't yet have enough products in shared
  sub-categories for the real endpoint to return anything. There's a comment in
  the code marking this as temporary and what to revert once there's more
  inventory.

---

## Full commit list (oldest → newest)

| Commit | Message |
|---|---|
| `55b8fad` | feat(utils): add category value normalization helpers |
| `fa6dd7e` | refactor(products): pass backend subCategory values through unmodified |
| `2d31368` | feat(product-details): wire real pincode delivery check via postalcode API |
| `93b9e40` | feat(reviews): add review API service |
| `0517d76` | feat(offers): add coupons API service |
| `f80c17f` | chore(config): switch active API to devtunnel, add postalcode/review/coupon endpoints |
| `fdd702b` | refactor(reviews): extract reusable stars/summary renderers, add write-review CTA |
| `ab79570` | feat(reviews): add write-a-review modal markup |
| `8e089cc` | feat(product-details): mount review modal in layout |
| `974d351` | feat(offers): add offers section shell to product details |
| `78ac48b` | feat(product-details): show offers section, base price strikethrough, shared availability label |
| `3ac6882` | refactor(product-details): render bullet-aware description, drop unused price/gifting tabs |
| `0539eb5` | chore(product-details): add id to sticky action bar for JS hook |
| `d17301e` | feat(scroll-to-top): add scroll-to-top button component |
| `29b056c` | style(customize-jewellery): full-height modal on mobile |
| `5342658` | feat(customize-jewellery): mark floating button as sitewide modal trigger |
| `7fb0b0e` | fix(account-menu): point Custom Jewellery link at sitewide modal trigger |
| `aff2a53` | refactor(navbar): redesign mobile nav as full-height slide-in drawer |
| `d61bfe0` | style(hero): responsive hero height per breakpoint |
| `bd4c2fe` | feat(hero): add blurred mobile backdrop, contain-fit image on mobile |
| `985acbd` | fix(showcase): normalize category display via categoryMatch helpers |
| `38bcadd` | feat(testimonials): responsive card sizing + swipe support |
| `f3c2c9b` | fix(whatsapp): reposition floating button above sticky Buy Now bar |
| `80ac8df` | style(wishlist): responsive sizing fixes for mobile card |
| `e103834` | feat(wishlist): show item count under wishlist heading |
| `835b0af` | feat(offers): render and copy coupon codes on product details |
| `e47e045` | feat(reviews): load reviews/summary, handle write-review submission |
| `6180802` | feat(product-details): init offers and reviews sections |
| `7adaffe` | refactor(product-details): add shared getAvailabilityLabel helper |
| `4a61e7a` | feat(product-details): add swipe support to gallery |
| `29388be` | feat(product-details): add swipe support to lightbox |
| `d3abf12` | chore(product-details): temp-preview related products via populated slug |
| `a1f9d0f` | style(product-details): shorten wishlist button label |
| `55f9732` | feat(scroll-to-top): wire visibility toggle and click-to-scroll |
| `aca4a72` | feat(customize-jewellery): render button/modal into any page, support deep link |
| `931fc33` | refactor(customize-jewellery): delegate open/close to sitewide trigger class |
| `bb11048` | refactor(navbar): close drawer on Custom Jewellery trigger, simplify panel classes |
| `dd42979` | fix(navbar): don't override active nav link color on scroll |
| `239899b` | feat(products): sample real subCategory values from backend |
| `68c2555` | feat(products): render category filters from real backend facets |
| `71402e8` | feat(products): load category facets independently, reconcile nav slugs |
| `8234d51` | fix(products): stop lowercasing category values from URL |
| `b8092b4` | chore(products): add categoryOptions to products state |
| `0f2c217` | fix(collections): fall back to local images when categories API fails |
| `24c17b2` | feat(faq): add skeleton loading state, friendlier error message |
| `ff52a25` | feat(home-faq): add skeleton loading state, isolate list errors |
| `85be715` | feat(showcase): add skeleton loading state, friendlier empty/error messages |
| `123ff91` | feat(wishlist): show wishlist item count |
| `e5103a7` | feat(auth): add sign-in prompt copy for write-a-review |
| `d1a40b3` | feat(main): init scroll-to-top, gate customize-jewellery init on container |
| `0e1ca57` | refactor(home): move customize-jewellery rendering into shared feature |
| `70731a5` | feat(contact): init static FAQ accordion |
| `baaba6c` | feat: add customize-jewellery containers to product and product-details pages |

Look up any of these with `git show <hash>` for the exact code diff.

---

# Batch 2 (27 commits)

## 1. Checkout (new feature)

There was no real checkout flow — Buy Now and the cart's checkout button both
fell back to a WhatsApp/contact-page handoff since no order endpoint existed.

**Now:** both go to a real `pages/checkout.html` flow: pick/add a saved
delivery address, review the order summary, pick a payment method, and place
the order. There's still no backend order endpoint, so the placed order is
persisted locally (`features/checkout/orderState.js`) rather than sent
anywhere — this mirrors the same "honest fallback" pattern used elsewhere in
the app (e.g. the old WhatsApp checkout) until a real order API exists.

**Files:**
- `src/components/checkout/checkoutLayout.js`, `addressSelector.js`,
  `orderSummary.js`, `paymentMethods.js`, `orderConfirmation.js` *(new)* —
  page markup.
- `src/features/checkout/orderState.js` *(new)* — local order persistence.
- `src/features/checkout/addressPanel.js` *(new)* — loads/selects the
  logged-in user's saved addresses via `addressService`.
- `src/features/checkout/orderPanel.js`, `paymentPanel.js` *(new)* — order
  summary and payment-method behavior.
- `src/features/checkout/checkoutPageInit.js`, `src/pages/checkoutPage.js`
  *(new)* — page entry point.
- `pages/checkout.html` *(new)*.
- `src/main.js` — lazy-loads the checkout page init, same pattern as the
  existing wishlist/FAQ pages.
- `src/components/productDetails/buyNowButton.js`,
  `src/components/cart/cartSummary.js`, `src/features/cart/cartPageInit.js`
  — Buy Now and the cart checkout button now point at
  `pages/checkout.html` instead of the old WhatsApp-deep-link fallback;
  the now-dead WhatsApp-message-building logic in `cartPageInit.js` was
  removed.

## 2. Profile & address book (new feature)

Previously there was no account/profile page and no way for a customer to
save a delivery address — every order relied on typing address details in
over WhatsApp.

**Now:** a `pages/profile.html` page lets a signed-in customer view/edit
their profile details and manage a saved address book (add, edit, delete,
set default), which the new checkout flow reads from directly.

**Files:**
- `src/services/addressService.js` *(new)* — address CRUD
  (`GET/POST/PUT/DELETE /address/...`), tolerant of a few different
  response envelope shapes since the exact success-response contract
  wasn't pinned down.
- `src/components/profile/profileLayout.js`, `profileSidebar.js`,
  `profileOverview.js`, `profileInfoForm.js`, `addressCard.js`,
  `addressesPanel.js`, `addressFormModal.js` *(new)* — page markup.
- `src/features/profile/profileInfo.js` *(new)* — view/edit profile
  details, using the new `authService.updateProfile`.
- `src/features/profile/addresses.js` *(new)* — list/add/edit/delete
  addresses via `addressService`.
- `src/features/profile/profilePageInit.js`, `src/pages/profilePage.js`
  *(new)* — page entry point.
- `pages/profile.html` *(new)*.
- `src/main.js` — lazy-loads the profile page init.
- `src/services/authService.js` — adds `updateProfile()`.
- `src/config.js` — adds the `AUTH.UPDATE_PROFILE` and `ADDRESS.*`
  endpoints.

## 3. Cart mirrored to the backend for logged-in users

The cart has always lived entirely in `localStorage`. The backend turns out
to have a real cart module (confirmed via a direct probe — an
unauthenticated request 401s instead of 404ing), so add-to-cart /
buy-now now also fires a best-effort `POST /addtocart/addToCart` for a
signed-in user.

This is **not** a source-of-truth switch: the local cart still drives the
UI, cart page, and checkout, and a failed backend sync is only logged, never
surfaced to the customer or allowed to block the local add.

**Files:**
- `src/services/cartService.js` *(new)* — the mirror call.
- `src/features/productDetails/cart.js` — fires it after every local
  add-to-cart / buy-now for a logged-in user.
- `src/config.js` — adds the `CART.*` endpoints.

## 4. Footer redesign + newsletter moved into the footer

The footer's four columns (Brand/Shop/Customer/Company) had overlapping,
oddly-organized links, and the "Subscribe to our newsletter" section used
to be its own standalone block on the homepage only.

**Now:** the footer has five columns — Brand, Quick Links, Policies, Shop,
and Contact Us (which also hosts the newsletter signup form) — built from a
shared `createFooterColumn()`/`createFooterLink()` pair instead of four
near-duplicate blocks. The old homepage-only newsletter section is removed.

**Files:**
- `src/components/footer/footerLinks.js` — restructured columns; adds the
  Contact Us column (email/phone placeholders for
  `features/contact/hydrateContactInfo.js`) and the newsletter form markup.
- `src/features/footer/newsletter.js` *(new)* — validates the newsletter
  form and shows a confirmation message. **No email provider is connected
  yet** — this only confirms locally and needs to be wired to a real
  backend/ESP endpoint before launch.
- `src/components/newsletter/newsletterSection.js`,
  `src/features/newsletter/index.js` *(deleted)* — superseded by the above.
- `index.html`, `src/pages/homePage.js` — drop the old
  `#newsletter-container` and its init call.
- `src/main.js` — starts `initFooterNewsletter()` and
  `hydrateContactInfo()` alongside the existing footer social-links
  hydration.

## 5. Product page / listing polish

- **Discount badges are real again** — product cards now compute a
  "20% OFF" / "₹500 OFF" badge from `product.discountValue`/
  `discountType` instead of staying blank. This was previously disabled
  to avoid fabricating a discount from a missing MRP; the backend now
  provides real discount fields directly.
  *(`src/components/showcase/showcaseCard.js`)*
- **Price breakdown** — the product page now shows a Base Price / Making
  Charges / Tax Rate breakdown and a "You save ₹X" line under the price,
  when that data is available. *(`src/components/productDetails/productInfo.js`)*
- **Specifications tab** — dropped the Category/Collection rows (the
  underlying fields aren't reliable enough to show as spec data).
  *(`src/components/productDetails/productTabs.js`)*
- **Category price filter** — the three hardcoded price-range radio
  buttons ("Under ₹2,000", etc.) were replaced with a dual-handle price
  slider paired with min/max number inputs, bounded 0–100000 (there's no
  backend endpoint yet for the real catalog min/max).
  *(`src/features/products/filters.js`, new
  `src/features/products/priceRangeSlider.css`)*
- **Mobile menu icon** — the hamburger icon was rendering blank (missing
  `data-lucide="menu"` glyph); replaced with an inline SVG that doesn't
  depend on the icon set. *(`src/components/navbar/desktopNav.js`)*

## 6. Config

- `src/config.js` — the active backend URL switch (the existing
  manager-controlled toggle) was flipped from the devtunnel URL to the
  live production URL. Also adds the profile-update, address, and cart
  endpoints described above.

---

## Batch 2 commit list (oldest → newest)

| Commit | Message |
|---|---|
| `a7deacf` | chore: rename CLAUDE.md to rules.md |
| `39a6d46` | chore(config): switch active API to production backend, add profile/address/cart endpoints |
| `fc57560` | feat(auth): add updateProfile call to authService |
| `bcb8849` | feat(profile): add addressService for address CRUD against backend |
| `771437e` | feat(cart): add cartService as a best-effort backend cart mirror |
| `de36b4c` | fix(navbar): replace missing menu icon with inline svg hamburger |
| `812dcdf` | feat(showcase): render real discount badge from backend discount fields |
| `2ae366b` | feat(product-details): add price breakdown and "you save" line to pricing |
| `f5d8937` | chore(product-details): drop Category/Collection rows from specifications tab |
| `0811b1e` | feat(products): replace fixed price-range buckets with a min/max slider |
| `5adaf6b` | feat(footer): redesign footer into Quick Links/Policies/Shop/Contact columns |
| `21a8bf4` | feat(footer): add newsletter signup handler |
| `dcc6425` | chore(newsletter): remove standalone homepage newsletter section |
| `d78b47f` | feat(checkout): add checkout page layout and address selector components |
| `6f29314` | feat(checkout): add order summary, payment methods, and order confirmation components |
| `d477259` | feat(checkout): add order state and address panel logic |
| `bb726f0` | feat(checkout): add order panel and payment panel logic |
| `7ecfabc` | feat(checkout): add checkout page entry point and route |
| `31cc7d6` | feat(cart): point Buy Now / cart checkout button at the real checkout page |
| `a4282ac` | feat(cart): sync add-to-cart / buy-now to backend cart for logged-in users |
| `5392b95` | feat(profile): add profile layout, sidebar, and overview components |
| `170c97d` | feat(profile): add profile info form and address card/panel components |
| `0570729` | feat(profile): add address form modal component |
| `02d924e` | feat(profile): add profile info feature logic (view/edit profile details) |
| `ccbc42b` | feat(profile): add addresses feature logic (list/add/edit/delete via addressService) |
| `5c1bfa3` | feat(profile): add profile page entry point and route |
| `7e8cc71` | chore(main): wire checkout/profile routing and footer newsletter/contact hydration |

---

# Batch 3 (11 commits)

## 1. Quick View (new feature)

Previously the only way to see a product's photos, price, and available
sizes was to leave the listing and open its full product-details page.

**Now:** every showcase card (homepage, listing, related/recently-viewed,
wishlist) has an eye icon next to the wishlist heart. Clicking it opens a
modal with the product's photo gallery, price/discount, a short
description, size selection, and Add to Cart / Buy Now — without
navigating away. It deliberately doesn't try to replace the full page:
reviews, specifications, and shipping info stay behind a "View Full
Details" link inside the modal.

**Files:**
- `src/components/quickView/quickViewModal.js` *(new)* — static modal
  shell.
- `src/features/quickView/index.js` *(new)* — fetches the product,
  renders the modal body, and handles gallery thumbnails, size selection,
  and Add to Cart / Buy Now (reusing `cartState.addToCart`).
- `src/components/showcase/showcaseCard.js` — restyles the wishlist
  button and adds the new quick-view trigger next to it.
- `src/main.js` — starts `initQuickView()` alongside the existing
  quick-add wiring.

## 2. My Orders page (new feature)

There was no way for a signed-in customer to see their own order history
— `src/services/ordersService.js` only had `createOrder`/`getOrder` for
the checkout flow itself.

**Now:** `pages/orders.html` lists the signed-in customer's own orders
(via `GET /orders/my-orders`, the individual-customer endpoint —
deliberately not the admin `getadminorders` one), newest first, with
login/loading/empty/error states matching the wishlist page's pattern.
Each order shows its items, status, payment method, and total; clicking
an item goes straight to that item's own product-details page.

The real `/orders/my-orders` response shape was confirmed live against a
real account mid-build (see `doubt or question.md` #9) — notably, each
item's `image` field is an array of URL strings rather than the
`{ url, position }` shape used everywhere else on this backend, which
caused a real (now-fixed) blank-image bug for any order with more than
one photo on an item.

**Files:**
- `src/services/ordersService.js` — adds `getMyOrders()`.
- `src/features/orders/model.js` *(new)* — normalizes the raw
  order/item shape defensively.
- `src/components/orders/ordersLayout.js`, `orderCard.js` *(new)* — page
  shell and order card markup.
- `src/features/orders/ordersPageInit.js` *(new)* — fetch, page states,
  and a fallback that fetches a product directly (same pattern the
  wishlist page uses) whenever an order item is still missing an image.
- `src/pages/ordersPage.js`, `pages/orders.html` *(new)* — page entry
  point.
- `src/main.js` — lazy-loads the orders page init.
- `src/components/profile/profileSidebar.js`, `profileOverview.js` —
  add a "My Orders" link/quick-action (the account dropdown and mobile
  nav already linked to `/pages/orders.html` before this page existed).

---

## Batch 3 commit list (oldest → newest)

| Commit | Message |
|---|---|
| `827f387` | feat(quickView): add quick view modal component |
| `8e327af` | feat(quickView): add quick view feature logic for showcase cards |
| `9bd3a2f` | feat(showcase): add quick view button alongside wishlist button on product cards |
| `decaab6` | feat(main): wire up quick view modal initialization |
| `78af1f9` | feat(orders): add getMyOrders to ordersService |
| `8bf9612` | feat(orders): add order and order-item normalization model |
| `e5de211` | feat(orders): add orders page layout and order card components |
| `88a1c5e` | feat(orders): add orders page feature logic |
| `e7a222f` | feat(orders): add orders page entry point and route |
| `379cdd9` | feat(main): wire up orders page routing |
| `8afef0a` | feat(profile): add My Orders links to profile sidebar and quick actions |

Look up any of these with `git show <hash>` for the exact code diff.

---

# Batch 4 (77 commits)

## 1. Site-wide favicon rollout

Every page (`index.html` and everything under `pages/`) used a single bare
`/favicon.ico` link. **Now** each page ships a full favicon set — 96x96 and
512x512 PNGs plus an Apple touch icon — linked with relative (`../`/`./`)
paths instead of absolute ones, so the icons resolve correctly regardless of
how deep the page is served from.

**Files:** `apple-touch-icon.png`, `favicon-96x96.png`, `favicon-512x512.png`,
`favicon.ico` *(new)*, plus `index.html` and all 16 files under `pages/`
(each gets its own commit in the list below). `src/assets/icons/` (16/32/48
PNGs, *new*) was also added for future favicon/manifest use but isn't wired
into any page yet.

## 2. Quick View removed

The Quick View modal added in Batch 3 (photo gallery + size/Add-to-Cart
without leaving the listing) has been removed — the eye icon, its modal, and
the feature logic are all gone; showcase cards now only show the wishlist
button.

**Files:** `src/components/quickView/quickViewModal.js`,
`src/features/quickView/index.js` *(both deleted)*,
`src/components/showcase/showcaseCard.js`, `src/main.js`.

## 3. Store-wide shift to "all sales final" (no returns/refunds)

The store no longer offers a returns/refund policy. The dedicated refund
page, every link to it, and every "Easy Returns" mention across the site
were removed or reworded, replaced with a "Handcrafted Excellence" feature
and honest all-sales-final copy.

**Files:**
- `pages/refund-policy.html` *(deleted)*.
- `src/components/footer/copyright.js`, `src/components/footer/footerLinks.js`
  (also adds email/phone icon glyphs to the Contact Us column — a separate,
  unrelated tweak that happened to land in the same file),
  `src/constants/navigation.js` — drop the Refund Policy link/entry.
- `pages/contact.html` — the "Can I return a product?" FAQ answer now says
  all sales are final instead of pointing at a return policy.
- `pages/shipping-policy.html` — the damage-claim resolution wording no
  longer mentions refund/exchange, only replacement.
- `src/components/productDetails/productTabs.js` — "Shipping & Returns" tab
  renamed to "Shipping"; the refund-policy bullet dropped from its content.
- `src/components/productDetails/benefitsRow.js`,
  `src/components/whyChooseUs/featureCard.js` — the return-arrow icon swapped
  for a gem/craftsmanship icon.
- `src/constants/whyChooseUs.js` — the "Easy Returns" feature card replaced
  with "Handcrafted Excellence".

## 4. About page: expanded craftsmanship journey

The About page's craftsmanship section went from a plain 4-step grid to a
detailed, photographed 14-stage journey (filling → heating → casting →
washing → cutting → assembly → filing/setting → grinding → polishing, each
with its own photo and a curved connecting spine on desktop).

**Files:** `pages/about.html`, `src/assets/process/*.jpg` *(9 new step
photos)*.

## 5. Collections: new category image + safer fallback

`renderCollections.js` now has art for a "Kids Bangles" category, and
categories without dedicated local art no longer get silently filtered out
of the shop-by-category section — they render using a brand fallback image
instead of disappearing.

**Known issue (left as-is intentionally):** the fallback image constant
points at `src/assets/banshiwala-gold.png`, but that file was deleted in
this same batch. Any category that falls through to the fallback will show
a broken image until this is pointed at an asset that still exists.

**Files:** `src/features/collections/renderCollections.js`,
`src/assets/kids_bangle.png` *(new)*, `src/assets/banshiwala-gold.png`
*(deleted)*. Separately, `src/components/craftsmanship/craftsmanshipSection.js`
swapped its placeholder `hero5.jpg` for the new `src/assets/multipleCategories.png`.

## 6. Navbar logo now swaps on scroll

The navbar logo used to be a single static image. **Now** it's wrapped in a
circular mask and swaps between a circular gold coin mark (`logo-white.png`,
shown over the transparent top-of-page navbar) and the wider brand lockup
(`logo.png`, shown once the navbar goes solid on scroll), with matching
`object-fit` changes so neither version looks cropped or squashed.

**Files:** `src/assets/logo-white.png` *(new)*,
`src/components/navbar/desktopNav.js`, `src/features/navbar/scroll.js`.
Separately, `src/components/navbar/mobileNav.js` fixed a "Banshiwala" →
"Banshiwale" typo in the mobile logo's alt text.

## 7. Search overlay: real live search + redesign

The search overlay used to be a dark modal with only static "popular search"
shortcuts — typing into it did nothing. **Now:**
- The panel was redesigned from a dark, centered modal to a full-width,
  light, editorial-style panel (serif heading, gold accents, slide-down
  animation).
- Typing actually searches: a debounced (350ms) call to the real product
  API renders a results grid (image, name, category, price with strike-
  through original price when discounted), with loading, empty-query, and
  no-results states.

**Files:** `src/components/navbar/searchOverlay.js` (markup/styling),
`src/features/navbar/searchOverlay.js` (live search behavior).

## 8. Testimonials: dropped fabricated names/ratings

The testimonials section previously showed invented customer names and
5-star ratings attached to real products — nothing backing those was ever
collected. **Now** each card is an honest, non-attributed product highlight
(a short headline + review sentence, no name, no star rating), and the
section subheading changed from "Trusted by our community" to "Crafted to be
worn every day" to match.

**Files:** `src/components/testimonials/testimonialCard.js`,
`src/components/testimonials/testimonialSection.js`,
`src/constants/testimonials.js`.

## 9. Auth pages redesign

Login, register, and forgot-password pages got a visual refresh: a gold
hairline accent and circular brand mark at the top of the shared layout, an
"eyebrow" label above each heading, icon-prefixed inputs (mail/lock/user/
phone glyphs), tighter vertical spacing, and an "Or continue with" divider
above the Google button.

**Files:** `src/components/auth/authLayout.js`, `loginForm.js`, `page.js`,
`forgotPasswordForm.js`, `forgotPasswordPage.js`, `registerForm.js`,
`registerPage.js`.

## 10. Contact page polish

WhatsApp/Email/Phone rows on the Contact page now show an icon badge next to
each method instead of plain text, and phone numbers hydrated from the
backend are formatted with a `+91` country-code prefix instead of shown raw.
A "Banshiwaale" → "Banshiwale" label typo was also fixed.

**Files:** `src/components/contact/contactForm.js`,
`src/features/contact/hydrateContactInfo.js`.

## 11. My Orders moved into the Profile page as a tab

Previously "My Orders" was only reachable as a separate page
(`pages/orders.html`, added in Batch 3). **Now** the profile page has its
own "My Orders" tab (mirroring `components/orders/ordersLayout.js`'s
loading/empty/error/list states, minus the login state since the profile
shell already gates on it) — the sidebar nav item and the overview quick
action both open this tab instead of navigating away. `pages/orders.html`
itself is untouched and still works as a direct link.

Separately, the profile form gained an optional Date of Birth field
(validated to not be in the future, persisted alongside the rest of the
profile update).

**Files:** `src/components/profile/ordersPanel.js`, `src/features/profile/orders.js`
*(new)*, `src/components/profile/profileLayout.js`, `profileSidebar.js`,
`profileOverview.js`, `src/features/profile/profilePageInit.js` (orders tab);
`src/components/profile/profileInfoForm.js`, `src/features/profile/profileInfo.js`
(date of birth).

## 12. Discounts are now always percentage-based

`getAvailabilityLabel`'s sibling `formatDiscount()` used to branch on
`discountType` to show either a `%` or a flat `₹` amount off. **Now** it
always treats `discountValue` as a percentage (matching
`showcaseCard.js`'s existing behavior), and falls back to deriving a percent-
off figure from the gap between `price` and `finalPrice` when the backend
doesn't send `discountValue` at all — so a discount badge is never silently
missing. Note: `showcaseCard.js`'s non-percentage label branch now renders
like `"500 % OFF"` (with a stray space before the `%`) rather than the old
`"₹500 OFF"`.

**Files:** `src/features/productDetails/model.js`,
`src/components/showcase/showcaseCard.js` (see item 2's commit).

## 13. Smaller, unrelated tweaks

- **Product page** — the Base Price / Making Charges / Tax Rate price
  breakdown added in Batch 2 was removed from the product page entirely.
  *(`src/components/productDetails/productInfo.js`)*
- **Product gallery** — the thumbnail frame background changed from an
  off-white tint to plain white. *(`src/components/productDetails/productGallery.js`)*
- **Reveal animations** — elements now reveal as soon as they cross the
  viewport edge instead of waiting for a 60px scroll-margin and 15%
  visibility threshold. *(`src/features/animations/reveal.js`)*
- **Homepage** — the unused `<section id="marquee">` and its
  `initMarquee()` call were removed. *(`index.html`, `src/pages/homePage.js`)*
- Several backend-integration comments across the codebase had a
  "banshiwaale" → "banshiwale" spelling typo fixed (no behavior change):
  `src/config.js`, `src/features/productDetails/share.js`,
  `src/features/checkout/checkoutPageInit.js`, `orderPanel.js`,
  `src/features/orders/model.js`, `src/services/cartService.js`,
  `ordersService.js`, `productService.js`, `src/components/hero/slides.js`.

---

## Batch 4 commit list (oldest → newest)

| Commit | Message |
|---|---|
| `1baa7c1` | feat(assets): add favicon.ico, 96x96/512x512 PNGs, and apple-touch-icon |
| `6c19dee` | chore(assets): add 16/32/48 icon set for future favicon/manifest use |
| `76bca8b` | feat(assets): add 9 step photos for the about page craftsmanship journey |
| `71a9e5b` | feat(assets): add circular logo-white.png navbar mark |
| `ce01153` | feat(assets): add kids_bangle.png collection image |
| `871039e` | feat(assets): add multipleCategories.png craftsmanship section image |
| `68fe557` | chore(cart): switch to the new favicon set |
| `4c88754` | chore(checkout): switch to the new favicon set |
| `1012509` | chore(faq): switch to the new favicon set |
| `cfb1606` | chore(auth): switch forgot-password page to the new favicon set |
| `7859ce2` | chore(auth): switch login page to the new favicon set |
| `a01ed62` | chore(orders): switch to the new favicon set |
| `90fc524` | chore(privacy-policy): switch to the new favicon set |
| `c15fbcb` | chore(product-details): switch to the new favicon set |
| `3b8d10f` | chore(products): switch to the new favicon set |
| `bbff463` | chore(profile): switch to the new favicon set |
| `7661be4` | chore(auth): switch register page to the new favicon set |
| `7c845e3` | chore(terms): switch to the new favicon set |
| `579e33d` | chore(wishlist): switch to the new favicon set |
| `d0883e7` | chore(quickView): remove quick view modal component |
| `3fd1362` | chore(quickView): remove quick view feature logic |
| `3defb66` | refactor(showcase): remove quick-view trigger, simplify card title and discount label |
| `d6e83aa` | chore(main): stop initializing the removed quick view modal |
| `4210b64` | refactor(testimonials): drop star ratings, rename reviewer field to a non-attributed headline |
| `99be703` | content(testimonials): update section subheading copy |
| `be77c2a` | content(testimonials): replace fabricated reviewer names and ratings with honest product highlights |
| `5d3aa6e` | style(auth): add gold hairline accent, brand mark, and eyebrow label to auth layout |
| `6208ee8` | style(auth): add icon-prefixed inputs and a social-login divider to login form |
| `d7225ad` | content(auth): update login page heading and eyebrow copy |
| `4cde597` | style(auth): wrap forgot-password inputs in icon-prefixed fields |
| `082ecb7` | content(auth): add eyebrow label to forgot-password page |
| `13c1c27` | style(auth): add icon-prefixed inputs and a social-login divider to register form |
| `e58168e` | content(auth): add eyebrow label to register page |
| `50edb9c` | style(navbar): redesign search overlay from dark modal to light editorial panel |
| `6519ece` | feat(navbar): wire up debounced live product search with results grid in search overlay |
| `ab1b80f` | feat(navbar): wrap desktop nav logo in a circular mask with scroll-state data attributes |
| `178f358` | feat(navbar): swap logo image and object-fit between top and scrolled states |
| `654b419` | fix(navbar): correct Banshiwala typo to Banshiwale in mobile nav logo alt text |
| `4779cf0` | feat(contact): add icon badges to WhatsApp/Email/Phone rows, fix Banshiwaale typo |
| `d2d84ae` | feat(contact): format hydrated phone numbers with a +91 country code prefix |
| `d0d4fc8` | chore(pages): delete refund-policy page — site now sells all-sales-final |
| `2c29687` | chore(footer): drop Refund Policy link from copyright bar |
| `705d1c6` | feat(footer): add email/phone icons to Contact Us column, drop Refund Policy link |
| `d328110` | chore(nav): remove Refund Policy entry from footer navigation constants |
| `6a371d3` | content(contact): replace return-policy FAQ answer with all-sales-final wording, switch favicon set |
| `d713c6d` | content(shipping-policy): drop refund/exchange mention from claims wording, switch favicon set |
| `4358100` | content(product-details): rename Shipping & Returns tab to Shipping, drop refund-policy line |
| `8f50cf5` | content(product-details): swap return icon for craftsmanship icon in benefits row |
| `fc7bb9d` | content(why-choose-us): swap return icon for craftsmanship icon in feature card map |
| `49e9324` | content(why-choose-us): replace Easy Returns feature with Handcrafted Excellence |
| `26568f0` | feat(about): rebuild craftsmanship section into a detailed 14-stage journey, switch favicon set |
| `2a19350` | chore(assets): remove banshiwala-gold.png |
| `7b31bf0` | feat(collections): render Kids Bangles category, fall back to brand image for unmapped categories |
| `ada2e05` | chore(craftsmanship): swap hero5.jpg placeholder for multipleCategories.png imagery |
| `6bd5083` | feat(profile): add orders panel shell component for the profile page's orders tab |
| `1c7e85b` | feat(profile): add orders tab feature logic, reusing the orders model and services |
| `269b404` | feat(profile): add sticky sidebar positioning and orders panel container to layout |
| `824e6f8` | feat(profile): add My Orders tab to sidebar nav, drop external orders page link |
| `5eb8cd4` | refactor(profile): point My Orders quick action at the new orders tab instead of external page |
| `2633dd4` | feat(profile): wire up orders tab initialization |
| `aac898c` | feat(profile): add optional date-of-birth field to profile form |
| `5d7eb09` | feat(profile): validate and persist date-of-birth on profile save |
| `2f866eb` | docs(config): correct banshiwaale typo in cart-contract comment |
| `0b78cfd` | feat(product-details): treat discountValue as a percentage, derive it from price gap when missing |
| `5d565e9` | fix(product-details): correct Banshiwaale typo in share fallback title |
| `e5571fb` | docs(checkout): correct banshiwaale typo in Cashfree integration comment |
| `3e0d767` | docs(checkout): correct banshiwaale typo in checkout integration comment |
| `43fb9e8` | docs(orders): correct banshiwaale typo in order-image shape comment |
| `1b6278e` | docs(cart): correct banshiwaale typo in backend-contract comment |
| `22d4598` | docs(orders): correct banshiwaale typo in orders integration comment |
| `2ab1aaa` | docs(products): correct banshiwaale typo in slug-lookup comment |
| `f07c258` | fix(hero): correct Banshiwaale typo in slide alt text fallback |
| `d26166b` | style(product-details): use white background for gallery thumbnail frame |
| `28eeda3` | style(animations): reveal elements immediately instead of waiting for scroll offset |
| `598adbc` | chore(home): remove unused marquee section, switch favicon set |
| `6edd5a8` | chore(home): stop initializing the removed marquee feature |
| `123d4b2` | refactor(product-details): remove Base Price/Making Charges/Tax Rate breakdown section |

Look up any of these with `git show <hash>` for the exact code diff.
