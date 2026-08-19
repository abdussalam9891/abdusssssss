import {
  escapeHtml,
  formatPrice,
} from "../../features/productDetails/model.js";


const CONTACT_PAGE_URL = "/pages/contact.html";


/*
 * The WhatsApp number is backend-provided
 * (website.whatsappNumber). No trustworthy number exists in the
 * repository, so the button renders as a contact-page link and
 * features/productDetails/enquiry.js upgrades it to a WhatsApp
 * deep link once the backend answers.
 */

export function buildEnquiryMessage(product, quantity = 1, size = "") {

  const price =
    formatPrice(product.finalPrice);


  return [
    "Hello Banshiwaale,",
    "",
    "I'm interested in this jewellery piece.",
    "",
    `Product: ${product.name}`,

    product.sku
      ? `SKU: ${product.sku}`
      : "",

    size
      ? `Size: ${size}`
      : "",

    quantity > 1
      ? `Quantity: ${quantity}`
      : "",

    price
      ? `Price: ${price}`
      : "",

    "",
    "Could you please share more details?",
  ]
    .filter(
      (line, index, lines) =>
        line !== "" ||
        lines[index - 1] !== ""
    )
    .join("\n");
}


export function createEnquiryButton(product) {

  const message =
    buildEnquiryMessage(product);


  return `

<a
  id="productEnquiryButton"

  data-enquiry-message="${escapeHtml(message)}"

  href="${CONTACT_PAGE_URL}"

  class="
    group

    relative

    flex

    w-full

    items-center
    justify-center

    gap-3

    overflow-hidden

    rounded-2xl

    bg-[#181818]

    px-8
    py-5

    text-[14px]
    font-medium

    uppercase

    tracking-[0.20em]

    text-white

    transition-all
    duration-500

    hover:-translate-y-1

    hover:shadow-[0_22px_55px_rgba(0,0,0,.18)]
  "
>

  <span
    class="
      absolute
      inset-0

      origin-left

      scale-x-0

      bg-[#A07936]

      transition-transform
      duration-500

      group-hover:scale-x-100
    "
  ></span>

  <i
    data-lucide="message-circle"

    class="
      relative
      z-10

      h-5
      w-5
    "
  ></i>

  <span class="relative z-10">
    Enquire About This Piece
  </span>

</a>

`;
}
