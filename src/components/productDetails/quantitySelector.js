/*
 * Purely a client-side purchase-intent control — it has no
 * backend quantity/cart API to call. It clamps against the
 * backend `stock` figure (features/productDetails/quantity.js)
 * and feeds the selected quantity into the WhatsApp enquiry
 * message, which is the site's real purchase channel.
 */

export function createQuantitySelector(product) {

  // No stock information at all: nothing to clamp against, and
  // no established backend claim to render either way.
  if (product.inStock === null) return "";


  if (product.inStock === false) {

    return `
<div>
  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-[#A07936]
    "
  >
    Quantity
  </p>

  <p
    class="
      mt-3

      text-[14px]

      text-[#B3261E]
    "
  >
    Currently out of stock.
  </p>
</div>
`;
  }


  return `

<div>

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-[#A07936]
    "
  >
    Quantity
  </p>


  <div
    class="
      mt-4

      flex

      flex-wrap

      items-center

      gap-5
    "
  >

    <div
      class="
        inline-flex

        items-center

        overflow-hidden

        rounded-2xl

        border
        border-[#ECE5D8]
      "
    >

      <button
        type="button"
        id="productQuantityDecrease"
        aria-label="Decrease quantity"

        class="
          flex

          h-11
          w-11

          items-center
          justify-center

          text-[#181818]

          transition-colors
          duration-300

          hover:bg-[#FCFBF9]

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        −
      </button>

      <span
        id="productQuantityValue"
        data-quantity="1"

        class="
          w-12

          text-center

          text-[15px]

          font-medium

          text-[#181818]
        "
      >
        1
      </span>

      <button
        type="button"
        id="productQuantityIncrease"
        aria-label="Increase quantity"

        class="
          flex

          h-11
          w-11

          items-center
          justify-center

          text-[#181818]

          transition-colors
          duration-300

          hover:bg-[#FCFBF9]

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        +
      </button>

    </div>


    <p
      id="productQuantityTotal"

      class="
        text-[13px]

        text-[#8A8A8A]
      "
    ></p>

  </div>

</div>

`;
}
