/*
 * Static markup only — populated and wired up in
 * features/quickAdd/index.js. Shared by every "Add to Cart" trigger
 * that needs a size/variant choice first: showcase product cards
 * (components/showcase/showcaseCard.js) and the wishlist page's
 * "Move to Cart" button (components/wishlist/wishlistCard.js).
 */

export function createQuickAddModal() {

  return `

<div
  id="quickAddModal"

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
    id="quickAddModalOverlay"

    class="
      absolute
      inset-0

      bg-black/60
      backdrop-blur-sm
    "
  ></div>


  <div
    id="quickAddModalPanel"

    class="
      relative
      z-10

      w-full
      max-w-sm

      max-h-[90vh]

      overflow-y-auto

      rounded-2xl

      border
      border-[#ECE5D8]

      bg-white

      p-6
      sm:p-7

      opacity-0
      scale-95

      transition-all
      duration-300
    "
  >

    <div class="flex items-center justify-between">

      <h3
        id="quickAddModalTitle"

        class="
          font-serif

          text-[20px]

          italic

          text-[#181818]
        "
      >
        Select Size
      </h3>

      <button
        type="button"
        id="closeQuickAddModal"

        class="
          text-[#B0AA9D]

          transition-colors
          duration-300

          hover:text-[#181818]
        "
      >
        <i data-lucide="x" class="h-5 w-5"></i>
      </button>

    </div>


    <div id="quickAddModalBody" class="mt-6">
      <!-- populated by features/quickAdd/index.js -->
    </div>

  </div>

</div>

`;
}
