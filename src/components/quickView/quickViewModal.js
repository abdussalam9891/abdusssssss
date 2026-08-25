/*
 * Static markup only — populated and wired up in
 * features/quickView/index.js. Opened from every showcase card's
 * eye icon (components/showcase/showcaseCard.js) so a shopper can
 * preview a product's photos, price, sizes and a short description
 * without leaving the listing they're browsing.
 */

export function createQuickViewModal() {

  return `

<div
  id="quickViewModal"

  class="
    fixed
    inset-0
    z-[200]

    hidden

    items-center
    justify-center

    p-4
  "
>

  <div
    id="quickViewModalOverlay"

    class="
      absolute
      inset-0

      bg-black/60
      backdrop-blur-sm
    "
  ></div>


  <div
    id="quickViewModalPanel"

    class="
      relative
      z-10

      w-full
      max-w-3xl

      max-h-[90vh]

      overflow-y-auto

      rounded-2xl
      sm:rounded-[28px]

      border
      border-[#ECE5D8]

      bg-white

      p-5
      sm:p-8

      opacity-0
      scale-95

      transition-all
      duration-300
    "
  >

    <button
      type="button"
      id="closeQuickViewModal"

      aria-label="Close quick view"

      class="
        absolute
        right-4
        top-4
        sm:right-6
        sm:top-6

        z-20

        flex

        h-9
        w-9

        items-center
        justify-center

        rounded-full

        border
        border-[#ECE5D8]

        bg-white/95

        text-[#B0AA9D]

        transition-colors
        duration-300

        hover:text-[#181818]
      "
    >
      <i data-lucide="x" class="h-4 w-4"></i>
    </button>


    <div id="quickViewModalBody">
      <!-- populated by features/quickView/index.js -->
    </div>

  </div>

</div>

`;
}
