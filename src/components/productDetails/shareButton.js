/*
 * Uses the Web Share API where available, falling back to
 * copying the product link to the clipboard — see
 * features/productDetails/share.js. No backend involved.
 */

export function createShareButton() {

  return `

<button
  type="button"
  id="productShareButton"

  aria-label="Share this product"

  class="
    flex

    w-full

    items-center
    justify-center

    gap-3

    rounded-2xl

    border
    border-[#DDD7CF]

    bg-white

    px-6
    py-4

    text-[13px]
    font-medium

    uppercase

    tracking-[0.18em]

    text-[#181818]

    transition-all
    duration-300

    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>

  <i
    data-lucide="share-2"

    class="
      h-4
      w-4
    "
  ></i>

  Share

</button>

`;
}
