/*
 * There is no backend cart endpoint yet — this adds to the local
 * cart (features/cart/cartState.js) so the button is genuinely
 * functional today. See features/productDetails/cart.js for the
 * click handler; swapping in a real POST /cart call later only
 * touches that one file.
 */

export function createAddToCartButton(product) {

  const disabled =
    product.inStock === false;


  return `

<button
  type="button"
  id="productAddToCartButton"

  ${disabled ? "disabled" : ""}

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

    border
    border-[#181818]

    px-6
    py-5

    text-[13px]
    font-medium

    uppercase

    tracking-[0.18em]

    text-[#181818]

    transition-all
    duration-300

    hover:border-[#A07936]
    hover:text-[#A07936]

    disabled:cursor-not-allowed
    disabled:border-[#DDD7CF]
    disabled:text-[#B0B0B0]
    disabled:hover:border-[#DDD7CF]
    disabled:hover:text-[#B0B0B0]
  "
>

  <i
    data-lucide="shopping-bag"

    class="
      h-4
      w-4
    "
  ></i>

  Add to Cart

</button>

`;
}
