import { createHeroSlides } from "./slides.js";

import { createHeroIndicators } from "./indicators.js";

export function createHero(heroSlides = []) {
  return `
    <section
      id="hero"
      class="
        relative
        h-[110vh]
        overflow-hidden
      "
    >

      <!-- Background Slides -->

      ${createHeroSlides(heroSlides)}

      <!-- Progress Indicators -->

      ${createHeroIndicators(heroSlides.length)}

      <!-- Previous Button -->

      <button
        id="heroPrev"
        type="button"
        aria-label="Previous Slide"

        class="
          absolute
          left-6
          top-1/2
          z-40

          hidden

          h-14
          w-14

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-white/20

          bg-black/20

          text-white

          backdrop-blur-md

          transition-all
          duration-300

          hover:scale-110
          hover:border-primary
          hover:bg-black/40

          lg:flex
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>

      </button>

      <!-- Next Button -->

      <button
        id="heroNext"
        type="button"
        aria-label="Next Slide"

        class="
          absolute
          right-6
          top-1/2
          z-40

          hidden

          h-14
          w-14

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-white/20

          bg-black/20

          text-white

          backdrop-blur-md

          transition-all
          duration-300

          hover:scale-110
          hover:border-primary
          hover:bg-black/40

          lg:flex
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>

      </button>

      <!-- Bottom Fade -->

      <div
        class="
          absolute
          inset-x-0
          bottom-0
          h-44
          bg-gradient-to-t
          from-black/70
          via-black/20
          to-transparent
        "
      ></div>

    </section>
  `;
}
