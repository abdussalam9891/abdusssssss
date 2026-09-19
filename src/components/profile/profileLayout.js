/*
 * Static page shell. Mirrors features/wishlist/wishlistLayout.js
 * and features/cart/cartLayout.js: this file only lays out the
 * containers the feature module (features/profile/profilePageInit.js)
 * toggles between and fills in at render time — signed-out state,
 * or the account shell (sidebar + tab panels) once a user is known.
 */

import { createAddressFormModal } from "./addressFormModal.js";


export function createProfileLayout() {

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

      max-w-[1320px]

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
        My Account
      </h1>

    </div>


    <!-- Sign-In Required State -->

    <div
      id="profileLoginState"

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
        Sign in to view your profile, manage your saved
        addresses and keep your details up to date.
      </p>

      <button
        type="button"
        id="profileSignInButton"

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


    <!-- Account Shell -->

    <div
      id="profileShell"

      class="
        hidden

        mt-10
        sm:mt-16

        grid

        grid-cols-1

        gap-8

        lg:grid-cols-[320px_1fr]
        lg:gap-10
      "
    >

      <aside
        id="profileSidebar"

        class="
          lg:sticky
          lg:top-32

          lg:self-start
        "
      ></aside>

      <div id="profileContent">

        <div id="profileOverviewPanel"></div>

        <div
          id="profileInfoPanel"
          class="hidden"
        ></div>

        <div
          id="profileAddressesPanel"
          class="hidden"
        ></div>

        <div
          id="profileOrdersPanel"
          class="hidden"
        ></div>

      </div>

    </div>

  </div>

</section>

${createAddressFormModal()}

`;
}
