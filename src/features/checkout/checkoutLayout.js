/*
 * Static page shell — mirrors components/profile/profileLayout.js
 * (sign-in-gated) and features/cart/cartLayout.js (empty state +
 * content grid toggle). features/checkout/checkoutPageInit.js
 * decides which of the three states below is visible and fills in
 * the content containers at render time.
 */

import { createAddressFormModal } from "../../components/profile/addressFormModal.js";


export function createCheckoutLayout() {

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

      max-w-[1200px]

      px-5
      sm:px-6
      lg:px-8
    "
  >

    <div id="checkoutHeading" class="text-center">

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
        Checkout
      </h1>

    </div>


    <!-- Sign-In Required State -->

    <div
      id="checkoutLoginState"

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
        Sign in to add a delivery address and complete your order.
      </p>

      <button
        type="button"
        id="checkoutSignInButton"

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


    <!-- Empty Cart State -->

    <div
      id="checkoutEmptyState"

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
        data-lucide="shopping-bag"

        class="
          h-12
          w-12

          text-[#D8CBB0]
        "
      ></i>

      <p class="text-[#666]">
        Your cart is empty. Add a piece you love before checking out.
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


    <!-- Payment Failed State -->

    <div
      id="checkoutFailedState"

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
        data-lucide="x-circle"

        class="
          h-12
          w-12

          text-[#B3261E]
        "
      ></i>

      <p class="text-[15px] font-medium text-ink">
        Payment Failed
      </p>

      <p class="text-[#666]">
        We couldn't process your payment. No amount was charged —
        please try again.
      </p>

      <button
        type="button"
        id="checkoutRetryButton"

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
        Try Again
      </button>

    </div>


    <!-- Order Confirmed State -->

    <div
      id="checkoutConfirmedState"

      class="
        hidden

        mt-10
        sm:mt-16
      "
    ></div>


    <!-- Checkout Content -->

    <div
      id="checkoutContent"

      class="
        hidden

        mt-10
        sm:mt-16

        grid

        grid-cols-1

        gap-8
        sm:gap-12

        lg:grid-cols-[1.5fr_1fr]
        lg:gap-16
      "
    >

      <div class="space-y-8 sm:space-y-10">

        <div id="checkoutAddressSection"></div>

        <div id="checkoutPaymentSection"></div>

      </div>

      <div id="checkoutOrderSummary"></div>

    </div>

  </div>

</section>

${createAddressFormModal()}

`;
}
