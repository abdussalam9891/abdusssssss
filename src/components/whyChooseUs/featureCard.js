import { icon } from "../../utils/icon.js";

const ICONS = {
  certified: "award",
  exchange: "repeat",
  transparency: "search-check",
  shipping: "truck",
  ethics: "handshake",
  designs: "globe",
  arrow: "arrow-right",         // Arrow CTA
};

export function createFeatureCard(feature) {
  return `
    <div
      class="
        reveal
        group
        relative
        flex
        flex-col
        items-center
        justify-between
        rounded-2xl
        bg-white
        px-3
        pb-5
        pt-9
        text-center
        border
        border-[#F1E1BC]/60
        shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        sm:px-6
        sm:pb-8
        sm:pt-16
      "
    >
      <!-- Top Badge Icon -->
      <div
        class="
          absolute
          -top-5
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-b
          from-[#FBF3E2]
          to-[#F1E1BC]
          ring-1
          ring-[#A07936]/25
          shadow-[0_8px_20px_-6px_rgba(160,121,54,0.35)]
          transition-transform
          duration-300
          group-hover:scale-105
          sm:h-16
          sm:w-16
          sm:-top-7
        "
      >
        ${icon(
    ICONS[feature.icon] || feature.icon,
    `
            h-5
            w-5
            text-[#A07936]
            sm:h-8
            sm:w-8
          `
  )}
      </div>

      <!-- Card Content -->
      <div>
        <h3
          class="
            font-serif
            text-sm
            font-semibold
            text-[#181818]
            sm:text-2xl
          "
        >
          ${feature.title}
        </h3>

        ${feature.description || feature.desc
      ? `
          <p
            class="
              mt-1.5
              text-[11px]
              leading-4
              text-[#6B6B6B]
              sm:mt-3
              sm:text-sm
              sm:leading-7
            "
          >
            ${feature.description || feature.desc}
          </p>
        `
      : ""
    }
      </div>

      <!-- Bottom Arrow CTA -->
      <div
        class="
          mt-3
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          bg-[#FBF3E2]
          text-[#A07936]
          transition-colors
          duration-300
          group-hover:bg-[#A07936]
          group-hover:text-white
          sm:mt-6
          sm:h-10
          sm:w-10
        "
      >
        ${ICONS.arrow
      ? icon(ICONS.arrow, "h-3.5 w-3.5 stroke-[2.5] sm:h-4 sm:w-4")
      : `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        `
    }
      </div>
    </div>
  `;
}
