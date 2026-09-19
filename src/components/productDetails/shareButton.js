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

    rounded-xl
    sm:rounded-2xl

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

    text-ink

    shadow-[0_1px_2px_rgba(0,0,0,0.04)]

    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:border-primary
    hover:text-primary
    hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]

    active:translate-y-0
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

      transition-transform
      duration-300

      group-hover:scale-110
    "
  ></i>

  <span class="truncate">
    Share
  </span>

</button>

`;
}
