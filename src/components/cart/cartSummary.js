import { formatPrice } from "../../utils/format.js";


const CONTACT_PAGE_URL = "/pages/contact.html";


/*
 * There is no order/checkout backend endpoint yet, so the real
 * checkout action here is the same honest fallback used
 * throughout the site: render a contact-page link first, then
 * features/cart/cartPageInit.js upgrades it to a WhatsApp deep
 * link (with the cart contents in the message) once the backend
 * WhatsApp number resolves. No fake "Place Order" success state.
 */

export function createCartSummary(subtotal) {

  const total =
    formatPrice(subtotal);


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

  <h2
    class="
      font-serif

      text-[24px]

      italic

      text-[#181818]
    "
  >
    Order Summary
  </h2>


  <div
    class="
      mt-6

      flex

      items-center

      justify-between

      border-t
      border-[#ECE5D8]

      pt-5

      text-[15px]
    "
  >

    <span class="text-[#666]">
      Subtotal
    </span>

    <span
      class="
        font-semibold

        text-[#181818]
      "
    >
      ${total || "—"}
    </span>

  </div>

  <p
    class="
      mt-2

      text-[12px]

      leading-5

      text-[#8A8A8A]
    "
  >
    Making charges, tax and shipping are confirmed with you
    directly before your order is placed.
  </p>


  <a
    id="cartCheckoutButton"

    data-checkout-message=""

    href="${CONTACT_PAGE_URL}"

    class="
      mt-6

      flex

      w-full

      items-center
      justify-center

      gap-3

      rounded-2xl

      bg-[#181818]

      px-8
      py-5

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

    <i
      data-lucide="message-circle"

      class="
        h-4
        w-4
      "
    ></i>

    Checkout via WhatsApp

  </a>

  <p
    class="
      mt-4

      text-center

      text-[12px]

      leading-5

      text-[#8A8A8A]
    "
  >
    We'll confirm availability, pricing and delivery with you
    over WhatsApp before your order is placed.
  </p>

</div>

`;
}
