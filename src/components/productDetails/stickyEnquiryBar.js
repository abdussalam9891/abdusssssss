import { buildEnquiryMessage } from "./enquiryButton.js";

import {
  escapeHtml,
  formatPrice,
} from "../../features/productDetails/model.js";


const CONTACT_PAGE_URL = "/pages/contact.html";


/*
 * Mirrors createEnquiryButton: renders a contact-page link that
 * features/productDetails/enquiry.js upgrades to a WhatsApp deep
 * link once the backend number resolves.
 */

export function createStickyEnquiryBar(product) {

  const price =
    formatPrice(product.finalPrice);


  const message =
    buildEnquiryMessage(product);


  return `

<div
  class="
    fixed

    bottom-0
    left-0
    right-0

    z-50

    border-t
    border-[#ECE5D8]

    bg-white/95

    backdrop-blur-xl

    p-4

    lg:hidden
  "
>

  <div
    class="
      flex

      items-center

      gap-4
    "
  >

    <div
      class="
        min-w-0

        flex-1
      "
    >

      <p
        class="
          truncate

          font-serif

          text-[20px]

          italic

          text-[#181818]
        "
      >
        ${escapeHtml(product.name)}
      </p>

      ${
        price
          ? `
<p
  class="
    mt-1

    font-medium

    text-[#A07936]
  "
>
  ${price}
</p>
`
          : ""
      }

    </div>


    <a
      id="productStickyEnquiryButton"

      data-enquiry-message="${escapeHtml(message)}"

      href="${CONTACT_PAGE_URL}"

      class="
        flex

        shrink-0

        items-center

        gap-2

        rounded-2xl

        bg-[#181818]

        px-6
        py-4

        text-[13px]

        font-medium

        uppercase

        tracking-[0.16em]

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

      Enquire

    </a>

  </div>

</div>

`;
}
