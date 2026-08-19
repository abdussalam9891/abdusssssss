/*
 * There is no order/checkout backend endpoint yet — Buy Now adds
 * the item to the local cart and takes the customer to
 * pages/cart.html, where checkout happens over WhatsApp until a
 * real order endpoint exists. See features/productDetails/cart.js.
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

    gap-3

    overflow-hidden

    rounded-2xl

    bg-[#181818]

    px-6
    py-5

    text-[13px]
    font-medium

    uppercase

    tracking-[0.18em]

    text-white

    transition-all
    duration-500

    hover:-translate-y-1

    hover:shadow-[0_22px_55px_rgba(0,0,0,.18)]

    disabled:cursor-not-allowed
    disabled:translate-y-0
    disabled:bg-[#DDD7CF]
    disabled:text-[#8A8A8A]
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

      h-4
      w-4
    "
  ></i>

  <span class="relative z-10">
    Buy Now
  </span>

</button>

`;
}
