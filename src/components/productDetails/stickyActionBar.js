import {
  escapeHtml,
  formatPrice,
} from "../../features/productDetails/model.js";


/*
 * Compact mobile-only purchase bar: mirrors the main Add to Cart
 * / Buy Now buttons (features/productDetails/cart.js wires both
 * the main and sticky ids together) so the primary CTAs stay
 * reachable once the full-size buttons scroll out of view.
 */

export function createStickyActionBar(product) {

  const price =
    formatPrice(product.finalPrice);

  const disabled =
    product.inStock === false;


  return `

<div
  id="productStickyActionBar"

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

    p-3
    sm:p-4

    lg:hidden
  "
>

  <div
    class="
      flex

      items-center

      gap-2
      sm:gap-3
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

          text-[15px]
          sm:text-[18px]

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
    mt-0.5

    text-[13px]
    sm:text-[15px]

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


    <button
      type="button"
      id="productStickyAddToCartButton"

      ${disabled ? "disabled" : ""}

      aria-label="Add to cart"

      class="
        flex

        shrink-0

        items-center
        justify-center

        rounded-xl
        sm:rounded-2xl

        border
        border-[#181818]

        h-11
        w-11

        sm:h-12
        sm:w-12

        text-[#181818]

        transition-all
        duration-300

        hover:border-[#A07936]
        hover:text-[#A07936]

        active:scale-[0.96]

        disabled:cursor-not-allowed
        disabled:border-[#DDD7CF]
        disabled:text-[#B0B0B0]
      "
    >
      <i
        data-lucide="shopping-bag"

        class="
          h-4
          w-4

          sm:h-5
          sm:w-5
        "
      ></i>
    </button>


    <button
      type="button"
      id="productStickyBuyNowButton"

      ${disabled ? "disabled" : ""}

      class="
        flex

        shrink-0

        items-center
        justify-center

        gap-1.5
        sm:gap-2

        rounded-xl
        sm:rounded-2xl

        bg-[#181818]

        px-4
        py-3

        sm:px-6
        sm:py-4

        text-[11.5px]
        sm:text-[13px]

        font-medium

        uppercase

        tracking-[0.05em]
        sm:tracking-[0.14em]

        text-white

        transition-all
        duration-300

        hover:bg-[#A07936]

        active:scale-[0.96]

        disabled:cursor-not-allowed
        disabled:bg-[#DDD7CF]
        disabled:text-[#8A8A8A]
      "
    >
      Buy Now
    </button>

  </div>

</div>

`;
}
