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

  const mobile =
    order?.address?.mobile || order?.address?.phone || "";

  const itemCount =
    (order?.items || []).reduce(
      (sum, item) => sum + item.quantity,
      0
    );


  return `

<div
  class="
    mx-auto

    max-w-xl

    rounded-[28px]

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    p-8
    sm:p-10

    text-center
  "
>

  <div
    class="
      mx-auto

      flex

      h-16
      w-16

      items-center
      justify-center

      rounded-full

      bg-[#F1F7F1]
    "
  >
    <i data-lucide="check" class="h-8 w-8 text-[#2F6B3A]"></i>
  </div>

  <h2 class="mt-6 font-serif text-[28px] italic text-[#181818]">
    Order Placed!
  </h2>

  <p class="mt-3 text-[14px] leading-6 text-[#666]">
    Thank you for shopping with banshiwale. Our team will reach out
    ${mobile ? `to ${escapeHtml(mobile)} ` : ""}shortly to confirm
    your order and delivery details.
  </p>


  <div
    class="
      mt-8

      space-y-3

      rounded-2xl

      border
      border-[#ECE5D8]

      bg-white

      p-5

      text-left

      text-[13px]
    "
  >

    <div class="flex items-center justify-between">
      <span class="text-[#8A8A8A]">Order ID</span>
      <span class="font-medium text-[#181818]">${escapeHtml(order.id)}</span>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-[#8A8A8A]">Order Date</span>
      <span class="font-medium text-[#181818]">
        ${escapeHtml(formatOrderDate(order.placedAt))}
      </span>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-[#8A8A8A]">Items</span>
      <span class="font-medium text-[#181818]">${itemCount}</span>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-[#8A8A8A]">Payment Method</span>
      <span class="font-medium text-[#181818]">
        ${escapeHtml(PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod)}
      </span>
    </div>

    <div
      class="
        flex

        items-center

        justify-between

        border-t
        border-[#ECE5D8]

        pt-3

        text-[15px]

        font-semibold
      "
    >
      <span class="text-[#181818]">Total Amount</span>
      <span class="text-[#181818]">
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

      rounded-full

      bg-[#181818]

      px-8
      py-4

      text-[13px]

      font-medium

      uppercase

      tracking-[0.18em]

      text-white

      transition-colors
      duration-300

      hover:bg-[#A07936]
    "
  >
    Continue Shopping
  </a>

</div>

`;
}
