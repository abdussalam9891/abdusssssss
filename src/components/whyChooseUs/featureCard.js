import { icon } from "../../utils/icon.js";

const ICONS = {
  shield: "shield-check", // 925 Certified
  craftsmanship: "gem",   // Handcrafted Excellence
  gift: "gift",           // Gift Ready
  support: "messages-square", // Customer Support
};

export function createFeatureCard(feature) {
  return `
    <div
      class="
        group
        flex
        flex-col
        items-center
        justify-center
        text-center

        px-2
        py-6

       

        transition-all
        duration-700
        ease-out
      "
    >

      <div
        class="
          flex

          h-16
          w-16

          lg:h-20
          lg:w-20

          items-center
          justify-center

          rounded-full

          border
          border-[#EDEDED]

          transition-all
          duration-500

          group-hover:-translate-y-1
          group-hover:scale-110
          group-hover:border-[#A07936]
        "
      >

        ${icon(
          ICONS[feature.icon],
          `
            h-9
            w-9

            lg:h-10
            lg:w-10

            text-[#181818]

            transition-all
            duration-500

            group-hover:scale-110
            group-hover:text-[#A07936]
          `
        )}

      </div>

      <h3
        class="
          mt-5

          font-serif

          text-lg
          tracking-wide

          text-[#181818]

          lg:text-xl
        "
      >
        ${feature.title}
      </h3>

    </div>
  `;
}
