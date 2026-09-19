import { escapeHtml, formatPrice } from "../../utils/format.js";
import { formatCartSize } from "../../utils/cartLine.js";


// Mirrors features/cart/cartItemRow.js's inline placeholder so a
// broken product thumbnail never falls back to another broken path.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="#FCFBF9"/>` +
    `<path d="M140 250 L190 170 L225 215 L260 160 L305 250 Z" ` +
    `fill="none" stroke="#D8CBB0" stroke-width="10" stroke-linejoin="round"/>` +
    `<circle cx="170" cy="140" r="20" fill="none" stroke="#D8CBB0" stroke-width="10"/>` +
    `</svg>`
  );


function createOrderItem(item) {

  const unitPrice =
    Number(item.finalPrice ?? item.price) || 0;

  const lineTotal =
    formatPrice(unitPrice * item.quantity);


  return `

<div
  class="
    flex

    gap-3

    border-b
    border-[#ECE5D8]

    pb-4
  "
>

  <div
    class="
      h-16
      w-16

      shrink-0

      overflow-hidden

      rounded-xl

      border
      border-[#ECE5D8]

      bg-white
    "
  >
    <img
      src="${escapeHtml(item.image || PLACEHOLDER_IMAGE)}"

      alt="${escapeHtml(item.name || "Product")}"

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="h-full w-full object-cover"
    >
  </div>

  <div class="min-w-0 flex-1">

    <p class="line-clamp-2 text-[13px] font-medium text-ink">
      ${escapeHtml(item.name || "Product")}
    </p>

    <p class="mt-1 text-[12px] text-[#8A8A8A]">
      ${
        [
          escapeHtml(formatCartSize(item.size)),
          `Qty: ${item.quantity}`,
        ]
          .filter(Boolean)
          .join(" · ")
      }
    </p>

  </div>

  <p class="shrink-0 text-[14px] font-semibold text-ink">
    ${lineTotal || "—"}
  </p>

</div>

`;
}


function createCouponRow(coupon) {

  return `

<div
  data-code="${escapeHtml(coupon.couponCode)}"

  class="
    flex

    items-center

    justify-between

    gap-3

    rounded-xl

    border
    border-[#ECE5D8]

    bg-white

    px-4
    py-2.5
  "
>

  <div class="min-w-0">

    <p class="text-[13px] font-medium text-ink">
      ${escapeHtml(coupon.couponCode)}
    </p>

    <p class="mt-0.5 text-[11px] text-[#8A8A8A]">
      ${coupon.discount}% off${
        coupon.minPurchase
          ? ` on orders above ${formatPrice(coupon.minPurchase)}`
          : ""
      }
    </p>

  </div>

  <button
    type="button"

    data-code="${escapeHtml(coupon.couponCode)}"

    class="
      checkout-coupon-apply

      shrink-0

      rounded-lg

      border
      border-ink

      px-4
      py-1.5

      text-[11px]

      font-medium

      uppercase

      tracking-[0.08em]

      text-ink

      transition-colors
      duration-300

      hover:border-primary
      hover:text-primary
    "
  >
    Apply
  </button>

</div>

`;
}


function createCouponSection(coupons, appliedCoupon, couponError) {

  if (appliedCoupon) {

    return `

<div
  id="checkoutCouponSection"

  class="
    flex

    items-center

    justify-between

    gap-3

    rounded-2xl

    border
    border-[#2F6B3A]/30

    bg-[#F1F7F1]

    px-4
    py-3
  "
>

  <div class="flex items-center gap-2 text-[13px]">

    <i data-lucide="badge-check" class="h-4 w-4 shrink-0 text-[#2F6B3A]"></i>

    <span class="font-medium text-[#2F6B3A]">
      "${escapeHtml(appliedCoupon.code)}" applied
    </span>

  </div>

  <button
    type="button"
    id="checkoutCouponRemoveButton"

    class="text-[12px] font-medium text-[#8A8A8A] hover:text-[#B3261E]"
  >
    Remove
  </button>

</div>

`;
  }


  if (!coupons.length) {

    return `
<p class="text-[12px] text-[#8A8A8A]">No coupons available right now.</p>
`;
  }


  return `

<div id="checkoutCouponSection" class="space-y-2">

  ${coupons.map((coupon) => createCouponRow(coupon)).join("")}

  ${
    couponError
      ? `<p class="mt-1 text-[12px] text-[#B3261E]">${escapeHtml(couponError)}</p>`
      : ""
  }

</div>

`;
}


export function createOrderSummary(items = [], totals = {}, options = {}) {

  const {
    totalMrp = 0,
    itemDiscount = 0,
    couponDiscount = 0,
    giftWrapCharge = 0,
    grandTotal = 0,
  } = totals;

  const {
    appliedCoupon = null,
    couponError = "",
    coupons = [],
  } = options;

  const itemCount =
    items.reduce((sum, item) => sum + item.quantity, 0);


  return `

<div
  class="
    h-fit

    rounded-[28px]

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    p-6
    sm:p-7
  "
>

  <h2 class="font-serif text-[22px] italic text-ink">
    Order Summary
  </h2>

  <div class="mt-6 space-y-4">
    ${items.map((item) => createOrderItem(item)).join("")}
  </div>


  <div class="mt-6">
    <p class="mb-2 text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
      Available Coupons
    </p>
    ${createCouponSection(coupons, appliedCoupon, couponError)}
  </div>


  <div class="mt-6 space-y-3 border-t border-[#ECE5D8] pt-5 text-[14px]">

    <div class="flex items-center justify-between">
      <span class="text-[#666]">
        Price (${itemCount} ${itemCount === 1 ? "item" : "items"})
      </span>
      <span class="text-ink">
        ${formatPrice(totalMrp) || "—"}
      </span>
    </div>

    ${
      itemDiscount > 0
        ? `
<div class="flex items-center justify-between">
  <span class="text-[#666]">Discount</span>
  <span class="text-[#2F6B3A]">
    − ${formatPrice(itemDiscount)}
  </span>
</div>
`
        : ""
    }

    ${
      couponDiscount > 0
        ? `
<div class="flex items-center justify-between">
  <span class="text-[#666]">Coupon Discount</span>
  <span class="text-[#2F6B3A]">
    − ${formatPrice(couponDiscount)}
  </span>
</div>
`
        : ""
    }

    ${
      giftWrapCharge > 0
        ? `
<div class="flex items-center justify-between">
  <span class="text-[#666]">Gift Wrap</span>
  <span class="text-ink">${formatPrice(giftWrapCharge)}</span>
</div>
`
        : ""
    }

    <div class="flex items-center justify-between">
      <span class="text-[#666]">Delivery</span>
      <span class="text-[#2F6B3A]">Free</span>
    </div>

  </div>


  <div
    class="
      mt-5

      flex

      items-center

      justify-between

      border-t
      border-[#ECE5D8]

      pt-5

      text-[17px]

      font-semibold

      text-ink
    "
  >
    <span>Total Amount</span>
    <span>${formatPrice(grandTotal) || "—"}</span>
  </div>


  <button
    type="button"
    id="checkoutPayButton"

    class="
      mt-6

      flex

      w-full

      items-center
      justify-center

      gap-3

      rounded-2xl

      bg-ink

      px-8
      py-5

      text-[13px]

      font-medium

      uppercase

      tracking-[0.18em]

      text-white

      transition-all
      duration-300

      hover:bg-primary

      disabled:cursor-not-allowed
      disabled:opacity-50
      disabled:hover:bg-ink
    "
  >
    <span id="checkoutPayButtonText">Place Order</span>
  </button>

</div>

`;
}
