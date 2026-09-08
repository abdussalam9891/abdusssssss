/*
 * Buy Now adds the item to the cart and takes the customer straight
 * to pages/checkout.html to place a real order. See
 * features/productDetails/cart.js and features/checkout/.
 */

export function createBuyNowButton(product) {

  const disabled =
    product.inStock === false;


  return `

<button
  type="button"
  id="productBuyNowButton"

  ${disabled ? "disabled" : ""}

  class="
    group

    relative

    flex

    w-full

    items-center
    justify-center

    gap-2
    sm:gap-3

    overflow-hidden

    rounded-xl
    sm:rounded-2xl

    border
    border-transparent

    bg-[#181818]

    px-3
    py-3

    sm:px-6
    sm:py-5

    text-[11.5px]
    sm:text-[13px]

    font-medium

    uppercase

    tracking-[0.04em]
    sm:tracking-[0.18em]

    text-white

    shadow-[0_1px_2px_rgba(0,0,0,0.08)]

    transition-all
    duration-500

    hover:-translate-y-1

    hover:shadow-[0_22px_55px_rgba(0,0,0,.18)]

    active:translate-y-0
    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:translate-y-0
    disabled:border-[#DDD7CF]
    disabled:bg-transparent
    disabled:text-[#B0B0B0]
    disabled:shadow-none
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

      group-disabled:hidden
    "
  ></span>

  <i
    data-lucide="zap"

    class="
      relative
      z-10

      h-3.5
      w-3.5

      shrink-0

      sm:h-4
      sm:w-4

      transition-transform
      duration-300

      group-hover:scale-110
      group-disabled:scale-100
    "
  ></i>

  <span class="relative z-10 truncate">
    Buy Now
  </span>

</button>

`;
}
