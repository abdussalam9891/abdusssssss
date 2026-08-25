import { escapeHtml, formatPrice } from "../../utils/format.js";


const PAYMENT_LABELS = {
  online: "Online Payment (UPI / Cards / Netbanking)",
  cod: "Cash on Delivery",
};


function formatOrderDate(isoString) {

  try {

    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  } catch {

    return "";
  }

}


export function createOrderConfirmation(order) {

  const itemCount =
    (order?.items || []).reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

  const orderNumber =
    order?.orderNumber || order?.id || "";

  const transactionId =
    order?.payment?.transactionId || "";


  return `

<div
  class="
    mx-auto

    max-w-xl

    overflow-hidden

    rounded-[28px]

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    text-center
  "
>

  <div class="h-[3px] bg-gradient-to-r from-[#D8CBB0] via-[#A07936] to-[#D8CBB0]"></div>

  <div class="p-8 sm:p-10">

    <div
      class="
        mx-auto

        flex

        h-[72px]
        w-[72px]

        items-center
        justify-center

        rounded-full

        border
        border-[#A07936]/30

        bg-[#181818]
      "
    >
      <i data-lucide="check" class="h-7 w-7 text-[#D8CBB0]"></i>
    </div>

    <p
      class="
        mt-6

        text-[11px]

        font-medium

        uppercase

        tracking-[0.24em]

        text-[#A07936]
      "
    >
      Order Confirmed
    </p>

    <h2 class="mt-2 font-serif text-[30px] italic text-[#181818]">
      Thank You For Your Order
    </h2>

    <p class="mx-auto mt-3 max-w-sm text-[14px] leading-6 text-[#666]">
      Your order has been confirmed successfully. We'll notify you
      as soon as it ships.
    </p>


    <div
      class="
        mt-8

        space-y-3.5

        rounded-2xl

        border
        border-[#ECE5D8]

        bg-white

        p-5
        sm:p-6

        text-left

        text-[13px]
      "
    >

      <div class="flex items-center justify-between gap-3">
        <span class="text-[#8A8A8A]">Order ID</span>
        <span class="font-medium tracking-wide text-[#181818]">${escapeHtml(orderNumber)}</span>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-[#8A8A8A]">Order Date</span>
        <span class="font-medium text-[#181818]">
          ${escapeHtml(formatOrderDate(order.placedAt))}
        </span>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-[#8A8A8A]">Items</span>
        <span class="font-medium text-[#181818]">${itemCount}</span>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-[#8A8A8A]">Payment Method</span>
        <span class="font-medium text-[#181818]">
          ${escapeHtml(PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod)}
        </span>
      </div>

      ${
        transactionId
          ? `
<div class="flex items-center justify-between gap-3">
  <span class="text-[#8A8A8A]">Transaction ID</span>
  <span class="break-all text-right font-medium text-[#181818]">
    ${escapeHtml(transactionId)}
  </span>
</div>
`
          : ""
      }

      <div
        class="
          flex

          items-center

          justify-between

          border-t
          border-[#A07936]/20

          pt-3.5

          text-[16px]

          font-semibold
        "
      >
        <span class="text-[#181818]">Total Amount</span>
        <span class="text-[#A07936]">
          ${formatPrice(order.totals?.grandTotal) || "—"}
        </span>
      </div>

    </div>


    <a
      href="/pages/products.html"

      class="
        mt-8

        inline-flex

        items-center

        gap-2

        rounded-full

        bg-[#181818]

        px-8
        py-4

        text-[13px]

        font-medium

        uppercase

        tracking-[0.18em]

        text-white

        transition-all
        duration-300

        hover:bg-[#A07936]
      "
    >
      Continue Shopping

      <i data-lucide="arrow-right" class="h-4 w-4"></i>
    </a>

  </div>

</div>

`;
}
