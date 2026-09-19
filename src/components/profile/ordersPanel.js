/*
 * Static panel shell, scoped to the profile page's "orders" tab —
 * mirrors features/orders/ordersLayout.js's loading/empty/error/
 * list states but drops the login state (the profile shell already
 * gates everything behind isLoggedIn()) and uses its own element
 * ids so it never collides with the standalone orders page.
 */

export function createProfileOrdersPanel() {

  return `

<div>

  <h2
    class="
      font-serif
      italic

      text-[24px]
      sm:text-[28px]

      text-ink
    "
  >
    My Orders
  </h2>

  <p class="mt-2 text-[14px] text-[#8A8A8A]">
    Track your current orders and browse your order history.
  </p>


  <!-- Loading State -->

  <div
    id="profileOrdersLoadingState"

    class="
      hidden

      mt-10

      flex

      flex-col

      items-center

      gap-5
    "
    role="status"
    aria-live="polite"
  >

    <span
      class="
        h-10
        w-10

        animate-spin

        rounded-full

        border-2
        border-[#ECE5D8]
        border-t-primary
      "
    ></span>

    <p class="text-[#777]">
      Loading your orders…
    </p>

  </div>


  <!-- Empty State -->

  <div
    id="profileOrdersEmptyState"

    class="
      hidden

      mt-10

      flex

      flex-col

      items-center

      gap-4

      rounded-[22px]

      border
      border-dashed
      border-[#E8E1D8]

      py-16

      text-center
    "
  >

    <i
      data-lucide="package"

      class="
        h-10
        w-10

        text-[#D8CBB0]
      "
    ></i>

    <p class="text-[14px] text-[#8A8A8A]">
      You haven't placed any orders yet. Once you do, they'll show
      up right here.
    </p>

    <a
      href="/pages/products.html"

      class="
        inline-flex

        items-center

        rounded-full

        bg-ink

        px-8
        py-4

        text-[13px]

        font-medium

        uppercase

        tracking-[0.18em]

        text-white

        transition-colors
        duration-300

        hover:bg-primary
      "
    >
      Browse Collections
    </a>

  </div>


  <!-- Error State -->

  <p
    id="profileOrdersErrorState"

    class="
      hidden

      mt-10

      text-[14px]

      text-[#B3261E]
    "
  >
    We couldn't load your orders right now. Please try again shortly.
  </p>


  <!-- Orders List -->

  <div
    id="profileOrdersList"

    class="
      hidden

      mt-8

      flex

      flex-col

      gap-6
    "
  ></div>

</div>

`;
}
