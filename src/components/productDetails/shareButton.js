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
    group

    flex

    w-full

    items-center
    justify-center

    gap-2
    sm:gap-3

    rounded-lg
    sm:rounded-xl

    border
    border-[#DDD7CF]

    bg-white

    px-3
    py-2.5

    sm:px-6
    sm:py-4

    text-[11px]
    sm:text-[13px]

    font-medium

    uppercase

    tracking-[0.03em]
    sm:tracking-[0.18em]

    text-[#181818]

    transition-all
    duration-300

    hover:border-[#A07936]
    hover:text-[#A07936]

    active:scale-[0.98]
  "
>

  <i
    data-lucide="share-2"

    class="
      h-3.5
      w-3.5

      shrink-0

      sm:h-4
      sm:w-4
    "
  ></i>

  <span class="truncate">
    Share
  </span>

</button>

`;
}
