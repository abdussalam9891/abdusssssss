/*
 * Static page shell. The feature module decides, at render time,
 * whether to show the empty state or the product grid — this
 * only lays out the containers it toggles between. Mirrors
 * components/cart/cartLayout.js.
 */

export function createWishlistLayout() {

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

      max-w-[1600px]

      px-5
      sm:px-6
      lg:px-8
      xl:px-10
    "
  >

    <div class="text-center">

      <p
        class="
          text-[11px]
          sm:text-[12px]

          font-semibold

          uppercase

          tracking-[0.22em]
          sm:tracking-[0.28em]

          text-[#A07936]
        "
      >
        Saved For Later
      </p>

      <h1
        class="
          mt-3

          font-serif

          text-[30px]
          sm:text-[42px]
          lg:text-[56px]

          italic

          text-[#181818]
        "
      >
        Your Wishlist
      </h1>

    </div>


    <!-- Sign-In Required State -->

    <div
      id="wishlistLoginState"

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
        Sign in to keep your favourite jewellery saved across all
        your devices.
      </p>

      <button
        type="button"
        id="wishlistSignInButton"

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
        Sign In
      </button>

    </div>


    <!-- Empty State -->

    <div
      id="wishlistEmptyState"

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
        data-lucide="heart"

        class="
          h-12
          w-12

          text-[#D8CBB0]
        "
      ></i>

      <p class="text-[#666]">
        Your wishlist is empty. Save the pieces you love and
        they'll be right here.
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


    <!-- Wishlist Grid -->

    <div
      id="wishlistItems"

      class="
        hidden

        mt-10
        sm:mt-16

        grid

        grid-cols-2

        gap-x-4
        gap-y-8

        sm:grid-cols-3
        sm:gap-x-6
        sm:gap-y-10

        lg:grid-cols-4
        lg:gap-8
      "
    ></div>

  </div>

</section>

`;
}
