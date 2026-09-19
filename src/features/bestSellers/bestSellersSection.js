export function createBestSellersSection() {
  return `
<section
  class="
    reveal
    reveal-up

    bg-white

    py-8
    lg:py-14
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

    <div class="text-center">

      <h2
        class="
          font-serif

          text-2xl
          md:text-[40px]

          italic

          leading-tight

          text-ink
        "
      >
        Best Sellers
      </h2>

      <a
        href="/pages/products.html?sort=rating"

        class="
          mt-3

          inline-flex

          items-center

          gap-1.5

          text-[13px]
          lg:text-[14px]

          font-medium

          tracking-wide

          text-ink

          transition-colors
          duration-300

          hover:text-primary
        "
      >
        Shop All Best Sellers

        <i
          data-lucide="arrow-right"

          class="h-4 w-4"
        ></i>
      </a>

    </div>

    <!-- Carousel -->

    <div class="relative mt-8 lg:mt-10">

      <div
        class="
          overflow-visible
        "
      >

        <div
          id="bestSellersProducts"

          class="
            flex

            gap-4
            lg:gap-8

            overflow-x-auto
            overflow-y-visible

            scroll-smooth

            snap-x
            snap-mandatory

            no-scrollbar

            px-1
            pt-3
            pb-6
          "
        ></div>

      </div>

      <button
        type="button"
        id="bestSellersPrev"

        aria-label="Scroll left"

        class="
          absolute

          left-0
          lg:-left-5

          top-1/2

          -translate-y-1/2

          z-20

          hidden
          lg:flex

          h-11
          w-11

          items-center
          justify-center

          rounded-full

          border
          border-[#EEE7DB]

          bg-white

          text-ink

          shadow-[0_10px_25px_rgba(0,0,0,.08)]

          transition-all
          duration-300

          hover:border-[#C9A45C]
          hover:text-[#C9A45C]

          disabled:opacity-0
          disabled:pointer-events-none
        "
      >
        <i data-lucide="chevron-left" class="h-5 w-5"></i>
      </button>

      <button
        type="button"
        id="bestSellersNext"

        aria-label="Scroll right"

        class="
          absolute

          right-0
          lg:-right-5

          top-1/2

          -translate-y-1/2

          z-20

          hidden
          lg:flex

          h-11
          w-11

          items-center
          justify-center

          rounded-full

          border
          border-[#EEE7DB]

          bg-white

          text-ink

          shadow-[0_10px_25px_rgba(0,0,0,.08)]

          transition-all
          duration-300

          hover:border-[#C9A45C]
          hover:text-[#C9A45C]

          disabled:opacity-0
          disabled:pointer-events-none
        "
      >
        <i data-lucide="chevron-right" class="h-5 w-5"></i>
      </button>

    </div>

  </div>

</section>
`;
}
