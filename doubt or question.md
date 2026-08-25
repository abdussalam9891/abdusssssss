# Open Doubts / Questions — Checkout, Cashfree, Coupons, Gift Cards, Orders

Running list of things from this session that are genuinely unresolved on the
backend side, not something fixable from frontend code alone.

## 1. Cashfree crash for COD orders
Backend calls Cashfree's create-order API even when `paymentMethod: "COD"`,
and it 500s for `domain: "banshiwaale"` with `{"message":"Cashfree create
error","error":{}}`. Two separate questions here:
- Is `banshiwaale` actually onboarded with Cashfree merchant credentials on
  the backend (same as `Mivo Jewels`), or is this store simply not
  provisioned yet?
- Independent of that: **should COD even need a Cashfree call at all?**
  If Mivo Jewels' COD only "works" because it happens to have valid
  Cashfree keys configured, that's a backend design smell, not something
  banshiwaale-specific — worth asking whoever owns that backend directly.

## 2. Real error details are being swallowed
`catch (err) { res.status(500).json({ success:false, message:"Cashfree
create error", error:{} }) }` — the actual Cashfree SDK error never reaches
the frontend. I can't diagnose further than "Cashfree call failed" without
someone checking backend server logs at the time of a failing request.

## 3. Coupon discount isn't validated server-side
`POST /orders/createorder` only receives the already-computed
`totalDiscount` / `totalAmount` — the coupon **code** itself is never sent.
The backend has no way to confirm the discount is legitimate; a tampered
request could claim any discount. Is there a dedicated coupon-verification
endpoint on the backend that the frontend should be calling instead of
trusting the locally-fetched coupon list? (Same gap exists in the
pre-existing checkout coupon logic, not something introduced today.)

## 4. Gift card contract is unconfirmed, not verified live
`giftCardsService.getMyGiftCards()` (`GET /giftcardscustomer/mycard`) was
built purely by mirroring Mivo's frontend — same caveat as the rest of this
codebase's shared-backend integrations. Given the Cashfree gap turned out to
be a banshiwaale-specific provisioning issue, it's worth checking: does this
endpoint even return real data for `banshiwaale`, or an empty/error response
because gift cards aren't set up for this store either?

## 5. Gift card amount also isn't sent to order creation
Same issue as #3 but for gift cards — no `giftCode` field goes to
`/orders/createorder` at all currently. If gift cards are meant to actually
deduct stored value server-side, the backend needs to know which card was
used, not just receive a pre-reduced total.

## 6. Cart-page totals vs. checkout-page totals can now disagree
Cart page shows an "Estimated Amount" that includes coupon + gift card +
gift wrap. Checkout page computes its own total independently (coupon only,
no gift card, no gift wrap) and doesn't read the cart page's selection. A
user could see one number on the cart page and a different, higher one at
checkout. Left unresolved on purpose (wasn't in scope), but flagging it as a
real UX inconsistency that should get a decision.

## 7. How much of the shared-backend contract is actually confirmed vs. assumed?
Per the header comments already in this codebase (`cartService.js`,
`ordersService.js`), only cart GET has been explicitly verified live against
banshiwaale's own traffic. Address, orders, coupons, and now gift cards are
all "mirrors Mivo's working frontend" assumptions. Given the Cashfree issue
turned out to be exactly this kind of gap (works for Mivo, silently doesn't
for banshiwaale), it seems worth someone doing a pass to confirm each
endpoint against banshiwaale's actual store data rather than discovering
each gap one 500 error at a time.

## 8. CORS-on-error theory unconfirmed
I inferred "backend crashes before CORS middleware runs" from the "500 in
Network tab, empty Response body" symptom, but never actually saw the
Console tab's CORS error text to confirm it. Worth double-checking next time
this happens, in case the real cause is something else (e.g. a
devtunnel/proxy quirk) that just looks similar.

## 9. `/orders/my-orders` contract — now partially confirmed live
Building the new My Orders page (`src/features/orders/`), item #7 above
turned out to be resolvable for this one endpoint: tested live against a
real signed-in banshiwaale account with a real order.

**Confirmed real shape** (see the header comment in
`src/features/orders/model.js`):
- Each order item carries **flat** `productId` (a bare string id, not a
  populated product ref), `name`, `price`, `finalPrice`, `category`,
  `discount`, and `selectedSize` fields — the product is *not* populated
  server-side.
- Each item's `image` field is an **array of URL strings**, a snapshot
  taken at order time — unlike every other image field on this backend
  (which use `images: [{ url, position }]`). This actually caused a real
  bug: code that treated a truthy `item.image` as a ready string worked
  by accident for a single-image array (array-to-string coercion) but
  silently produced `"url1,url2"` for a multi-image one.
- `orderNumber` looks like `BANSHIWAALE-2026-000016`.

**Still unconfirmed:**
- Only saw `status: "Processing"` in live data. The other status values
  (Delivered / Shipped / Cancelled / Returned / whatever the backend
  actually emits) are unverified — `orderCard.js`'s status-badge color
  mapping for those is a best guess based on plausible naming, not
  confirmed against a real order in each of those states.
- `paymentMethod`'s exact string values beyond what checkout itself sends
  (`"COD"` / `"Online"`) aren't independently confirmed on the read side.
