export function createRecentlyViewedSection() {

  return `

<section
  class="
    bg-[#FCFBF9]

    py-8
    sm:py-10
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

    <div class="text-center">

      <p
        class="
          text-[11px]
          sm:text-[13px]

          uppercase

          tracking-[0.24em]
          sm:tracking-[0.30em]

          text-primary
        "
      >
        Continue Exploring
      </p>

      <h2
        class="
          mt-3
          sm:mt-4

          font-serif

          text-[26px]
          sm:text-[38px]
          lg:text-[56px]

          italic

          text-ink
        "
      >
        Recently Viewed
      </h2>

    </div>

    <div

      id="recentlyViewedProducts"

      aria-live="polite"

      class="
        mt-6
        sm:mt-10
        lg:mt-16

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
    ></div>

  </div>

</section>

`;

}
