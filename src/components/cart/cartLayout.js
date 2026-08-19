/*
 * Static page shell. The feature module decides, at render time,
 * whether to show the empty state or the items + summary grid —
 * this only lays out the containers it toggles between.
 */

export function createCartLayout() {

  return `

<section
  class="
    pt-36
    pb-24

    lg:pt-40
    lg:pb-32
  "
>

  <div
    class="
      mx-auto

      max-w-[1200px]

      px-5
      sm:px-6
      lg:px-8
    "
  >

    <div class="text-center">

      <p
        class="
          text-[12px]

          font-semibold

          uppercase

          tracking-[0.28em]

          text-[#A07936]
        "
      >
        Your Selection
      </p>

      <h1
        class="
          mt-3

          font-serif

          text-[42px]
          lg:text-[56px]

          italic

          text-[#181818]
        "
      >
        Shopping Cart
      </h1>

    </div>


    <!-- Empty State -->

    <div
      id="cartEmptyState"

      class="
        hidden

        mx-auto

        mt-16

        flex

        max-w-md

        flex-col

        items-center

        gap-5

        text-center
      "
    >

      <i
        data-lucide="shopping-bag"

        class="
          h-12
          w-12

          text-[#D8CBB0]
        "
      ></i>

      <p class="text-[#666]">
        Your cart is empty. Explore our collections and add a
        piece you love.
      </p>

      <a
        href="/pages/products.html"

        class="
          inline-flex

          items-center

          rounded-full

          bg-[#181818]

          px-8
          py-4

          text-[13px]

          font-medium

          uppercase

          tracking-[0.18em]

          text-white

          transition-colors
          duration-300

          hover:bg-[#A07936]
        "
      >
        Browse Collections
      </a>

    </div>


    <!-- Cart Content -->

    <div
      id="cartContent"

      class="
        hidden

        mt-16

        grid

        grid-cols-1

        gap-12

        lg:grid-cols-[1.6fr_1fr]
        lg:gap-16
      "
    >

      <div
        id="cartItems"

        class="
          space-y-6
        "
      ></div>

      <div id="cartSummary"></div>

    </div>

  </div>

</section>

`;
}
