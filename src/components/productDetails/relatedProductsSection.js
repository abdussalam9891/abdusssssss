export function createRelatedProductsSection() {

  return `

<section
  class="
    bg-white

    py-10
    sm:py-12
    lg:py-16
  "
>

  <div
    class="
      mx-auto

      max-w-[1600px]

      px-5
      lg:px-8
      xl:px-10
    "
  >

    <!-- Heading -->

    <div
      class="
        flex

        flex-wrap

        items-end

        justify-between

        gap-4

        border-b
        border-[#F2ECE3]

        pb-6
        sm:pb-8
      "
    >

      <div>

        <p
          class="
            text-[11px]
            sm:text-[12px]

            font-semibold

            uppercase

            tracking-[0.24em]
            sm:tracking-[0.28em]

            text-[#A07936]
          "
        >
          More To Explore
        </p>

        <h2
          class="
            mt-2

            font-serif

            text-[28px]
            sm:text-[38px]
            lg:text-[52px]

            italic

            leading-tight

            text-[#181818]
          "
        >
          You May Also Like
        </h2>

      </div>

      <a
        href="/pages/products.html"

        class="
          hidden

          shrink-0

          items-center

          gap-2

          pb-2

          text-[13px]

          font-medium

          uppercase

          tracking-[0.16em]

          text-[#181818]

          transition-colors
          duration-300

          hover:text-[#A07936]

          sm:inline-flex
        "
      >
        Browse Collection

        <svg
          xmlns="http://www.w3.org/2000/svg"

          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"

          class="
            h-3.5
            w-3.5
          "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"

            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>

    </div>


    <!-- Products -->

    <div

      id="relatedProducts"

      class="
        mt-6
        sm:mt-8
        lg:mt-10

        flex

        gap-4
        sm:gap-6
        lg:gap-8

        overflow-x-auto

        scroll-smooth

        snap-x
        snap-mandatory

        no-scrollbar
      "
    >

    </div>


    <p
      class="
        mt-4

        flex

        items-center

        gap-1.5

        text-[11px]

        text-[#B0AA9D]

        sm:hidden
      "
    >
      Swipe to explore

      <svg
        xmlns="http://www.w3.org/2000/svg"

        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"

        class="
          h-3
          w-3
        "
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"

          d="M13 5l7 7-7 7M5 12h14"
        />
      </svg>
    </p>

  </div>

</section>

`;

}
