import { escapeHtml, formatPrice } from "../../utils/format.js";


const CHECKOUT_PAGE_URL = "/pages/checkout.html";


function createOfferRow({ code, label, active, applyClass, removeClass }) {

  if (active) {

    return `

<div
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

  <span class="text-[13px] font-medium text-[#2F6B3A]">
    "${escapeHtml(code)}" applied
  </span>

  <button
    type="button"

    class="${removeClass} text-[12px] font-medium text-[#8A8A8A] hover:text-[#B3261E]"
  >
    Remove
  </button>

</div>

`;
  }


  return `

<div
  data-code="${escapeHtml(code)}"

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
      ${escapeHtml(code)}
    </p>

    <p class="mt-0.5 text-[11px] text-[#8A8A8A]">
      ${escapeHtml(label)}
    </p>

  </div>

  <button
    type="button"

    data-code="${escapeHtml(code)}"

    class="
      ${applyClass}

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


function createGiftCardSection(giftCards, appliedGiftCode) {

  if (!giftCards.length) return "";


  const applied =
    giftCards.find(
      (gift) => gift.giftCode === appliedGiftCode
    );


  return `

<div class="mt-6">

  <p class="mb-2 text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
    Gift Cards
  </p>

  <div id="cartGiftCardSection" class="space-y-2">
    ${
      applied
        ? createOfferRow({
            code: applied.giftCode,
            active: true,
            removeClass: "cart-gift-remove",
          })
        : giftCards
            .map((gift) =>
              createOfferRow({
                code: gift.giftCode,
                label: `${formatPrice(gift.amount ?? gift.remainingAmount ?? 0)} available`,
                active: false,
                applyClass: "cart-gift-apply",
              })
            )
            .join("")
    }
  </div>

</div>

`;
}


export function createCartSummary({
  availableItemCount = 0,
  totals = {},
  giftCards = [],
  appliedGiftCode = "",
  giftWrap = false,
  hasStockIssue = false,
} = {}) {

  const {
    totalMrp = 0,
    giftWrapCharge = 0,
    giftDiscount = 0,
    grandTotal = 0,
  } = totals;


  const checkoutButton =
    hasStockIssue
      ? `

<button
  type="button"
  disabled

  class="
    mt-6

    flex

    w-full

    cursor-not-allowed

    items-center
    justify-center

    gap-3

    rounded-2xl

    bg-[#D8CBB0]

    px-8
    py-5

    text-[13px]

    font-medium

    uppercase

    tracking-[0.18em]

    text-white
  "
>
  Item Out Of Stock
</button>

`
      : `

<a
  id="cartCheckoutButton"

  href="${CHECKOUT_PAGE_URL}"

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
  "
>

  Proceed to Checkout

  <i data-lucide="arrow-right" class="h-4 w-4"></i>

</a>

`;


  return `

<div
  class="
    h-fit

    rounded-[28px]

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    p-7
  "
>

  <h2 class="font-serif text-[24px] italic text-ink">
    Order Summary
  </h2>


  <label
    class="
      mt-5

      flex

      items-center

      justify-between

      rounded-xl

      border
      border-[#ECE5D8]

      bg-white

      px-4
      py-3

      text-[13px]

      text-ink
    "
  >
    <span>Add gift wrap (₹50/item)</span>

    <input
      type="checkbox"
      id="cartGiftWrapToggle"

      ${giftWrap ? "checked" : ""}

      class="h-4 w-4 accent-ink"
    >
  </label>


  ${createGiftCardSection(giftCards, appliedGiftCode)}


  <div class="mt-6 space-y-3 border-t border-[#ECE5D8] pt-5 text-[15px]">

    <div class="flex items-center justify-between">
      <span class="text-[#666]">
        Total MRP (${availableItemCount} ${availableItemCount === 1 ? "item" : "items"})
      </span>
      <span class="text-ink">
        ${formatPrice(totalMrp) || "—"}
      </span>
    </div>

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

    ${
      giftDiscount > 0
        ? `
<div class="flex items-center justify-between">
  <span class="text-[#666]">Gift Card Discount</span>
  <span class="text-[#2F6B3A]">− ${formatPrice(giftDiscount)}</span>
</div>
`
        : ""
    }

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
    <span>Estimated Amount</span>
    <span>${formatPrice(grandTotal) || "—"}</span>
  </div>

  <p class="mt-1 text-[12px] text-[#8A8A8A]">
    Making charges, tax and shipping are confirmed with you
    directly before your order is placed.
  </p>


  ${checkoutButton}

</div>

`;
}
