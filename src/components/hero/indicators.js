import { HERO_SLIDES } from "../../constants/heroSlides.js";

export function createHeroIndicators() {
  return `
    <div
      class="
        absolute
        bottom-10
        left-1/2
        z-40

        flex
        -translate-x-1/2
        items-center
        gap-2

        md:bottom-12
      "
    >

      ${HERO_SLIDES.map(
        (_, index) => `
          <button
            type="button"

            class="
              hero-indicator

              h-2
              w-2

              rounded-full

              bg-white/40

              transition-all
              duration-300

              hover:bg-white/70
            "

            data-indicator="${index}"

            aria-label="Go to slide ${index + 1}"
          ></button>
        `
      ).join("")}

    </div>
  `;
}
