export function createTestimonialsSection() {
  return `
<section
  class="
    relative

    overflow-visible

    bg-white

    py-8
    lg:py-14
  "
>

  <div
    class="
      mx-auto

      max-w-7xl

      px-5
      lg:px-8
    "
  >

    <!-- Heading -->

    <div class="text-center">

      <p
        class="
          font-serif

          text-2xl
          md:text-[48px]

          italic

          text-[#181818]
        "
      >
        Trusted by our community
      </p>

    </div>

    <!-- Slider -->

    <div
      class="
        relative

        mt-10
      "
    >

      <!-- Left -->

      <button

        id="testimonialPrev"

        type="button"

        aria-label="Previous"

        class="
          absolute

          left-[-10px]
          top-1/2

          z-20

          hidden
          lg:flex

          h-14
          w-14

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-[#E9E1D6]

          bg-white/95

          text-[#181818]

          shadow-[0_12px_30px_rgba(0,0,0,.08)]
          backdrop-blur-md

          transition-all
          duration-500

          hover:-translate-y-1/2
          hover:scale-110

          hover:border-[#C9A45C]
          hover:shadow-[0_20px_45px_rgba(0,0,0,.14)]
          hover:text-[#A07936]
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"

          fill="none"

          viewBox="0 0 24 24"

          stroke="currentColor"

          class="
            h-5
            w-5
          "
        >

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"

            d="M15 19l-7-7 7-7"
          />

        </svg>

      </button>

      <!-- Right -->

      <button

        id="testimonialNext"

        type="button"

        aria-label="Next"

        class="
          absolute

          right-[-10px]
          top-1/2

          z-20

          hidden
          lg:flex

          h-14
          w-14

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-[#E9E1D6]

          bg-white/95

          text-[#181818]

          shadow-[0_12px_30px_rgba(0,0,0,.08)]
          backdrop-blur-md

          transition-all
          duration-500

          hover:-translate-y-1/2
          hover:scale-110

          hover:border-[#C9A45C]
          hover:shadow-[0_20px_45px_rgba(0,0,0,.14)]
          hover:text-[#A07936]
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"

          fill="none"

          viewBox="0 0 24 24"

          stroke="currentColor"

          class="
            h-5
            w-5
          "
        >

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"

            d="M9 5l7 7-7 7"
          />

        </svg>

      </button>

      <!-- Track -->

      <div
        class="
          overflow-hidden

          py-3
        "
      >

        <div

          id="testimonialTrack"

          class="
            flex

            transition-transform
            duration-700
            ease-out
          "
        >

          <!-- Cards injected here -->

        </div>

      </div>

      <!-- Mobile Pagination -->

      <div

        id="testimonialDots"

        class="
          mt-8

          flex

          items-center
          justify-center

          gap-2

          lg:hidden
        "
      >

        <!-- Dots injected by JS -->

      </div>

    </div>

  </div>

</section>
`;
}
