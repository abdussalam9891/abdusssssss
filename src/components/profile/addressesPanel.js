import { icon } from "../../utils/icon.js";


export function createAddressesPanel() {

  return `

<div>

  <div
    class="
      flex
      flex-wrap
      items-center
      justify-between

      gap-4
    "
  >

    <div>

      <h2
        class="
          font-serif
          italic

          text-[24px]
          sm:text-[28px]

          text-[#181818]
        "
      >
        Addresses
      </h2>

      <p class="mt-2 text-[14px] text-[#8A8A8A]">
        Manage the addresses your orders are delivered to.
      </p>

    </div>

    <button
      type="button"
      id="profileAddAddressButton"

      class="
        inline-flex

        items-center

        gap-2

        rounded-full

        bg-[#181818]

        px-6
        py-3

        text-[12px]

        font-medium

        uppercase

        tracking-[0.16em]

        text-white

        transition-colors
        duration-300

        hover:bg-[#A07936]
      "
    >
      ${icon("plus", "h-4 w-4")}
      Add New Address
    </button>

  </div>


  <!-- Empty State -->

  <div
    id="profileAddressEmptyState"

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
      data-lucide="map-pin"

      class="
        h-10
        w-10

        text-[#D8CBB0]
      "
    ></i>

    <p class="text-[14px] text-[#8A8A8A]">
      You haven't saved any addresses yet.
    </p>

  </div>


  <!-- Error State -->

  <p
    id="profileAddressErrorState"

    class="
      hidden

      mt-10

      text-[14px]

      text-[#B3261E]
    "
  >
    We couldn't load your addresses right now. Please try again shortly.
  </p>


  <!-- List -->

  <div
    id="profileAddressList"

    class="
      mt-8

      grid

      grid-cols-1
      gap-5

      sm:grid-cols-2
    "
  ></div>

</div>

`;
}
