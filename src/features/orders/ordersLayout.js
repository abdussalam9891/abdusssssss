/*
 * Static page shell. The feature module decides, at render time,
 * which state (login/loading/empty/error/list) to show — this only
 * lays out the containers it toggles between. Mirrors
 * features/wishlist/wishlistLayout.js.
 */

export function createOrdersLayout() {

  return `

<section
  class="
    pt-28
    pb-20

    sm:pt-32

    lg:pt-40
    lg:pb-32
  "
>

  <div
    class="
      mx-auto

      max-w-[900px]

      px-5
      sm:px-6
      lg:px-8
    "
  >

    <div class="text-center">

      <h1
        class="
          font-serif

          text-[30px]
          sm:text-[42px]
          lg:text-[56px]

          italic

          text-ink
        "
      >
        My Orders
      </h1>

      <p
        class="
          mt-2
          sm:mt-3

          text-[13px]
          sm:text-[14px]

          text-[#8A8A8A]
        "
      >
        Track your current orders and browse your order history.
      </p>

    </div>


    <!-- Sign-In Required State -->

    <div
      id="ordersLoginState"

      class="
        hidden

        mx-auto

        mt-10
        sm:mt-16

        flex

        max-w-md

        flex-col

        items-center

        gap-5

        text-center
      "
    >

      <i
        data-lucide="lock"

        class="
          h-12
          w-12

          text-[#D8CBB0]
        "
      ></i>

      <p class="text-[#666]">
        Sign in to view your current and past orders.
      </p>

      <button
        type="button"
        id="ordersSignInButton"

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
        Sign In
      </button>

    </div>


    <!-- Loading State -->

    <div
      id="ordersLoadingState"

      class="
        hidden

        mt-16

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
      id="ordersEmptyState"

      class="
        hidden

        mx-auto

        mt-10
        sm:mt-16

        flex

        max-w-md

        flex-col

        items-center

        gap-5

        text-center
      "
    >

      <i
        data-lucide="package"

        class="
          h-12
          w-12

          text-[#D8CBB0]
        "
      ></i>

      <p class="text-[#666]">
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

    <div
      id="ordersErrorState"

      class="
        hidden

        mx-auto

        mt-10
        sm:mt-16

        flex

        max-w-md

        flex-col

        items-center

        gap-5

        text-center
      "
    >

      <i
        data-lucide="triangle-alert"

        class="
          h-12
          w-12

          text-[#D8CBB0]
        "
      ></i>

      <p class="text-[#666]">
        We couldn't load your orders right now. Please try again in
        a moment.
      </p>

    </div>


    <!-- Orders List -->

    <div
      id="ordersList"

      class="
        hidden

        mt-10
        sm:mt-16

        flex

        flex-col

        gap-6
      "
    ></div>

  </div>

</section>

`;
}
