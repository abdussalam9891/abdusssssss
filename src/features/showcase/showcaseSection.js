import { SHOWCASE_TABS } from "../../constants/showcaseProducts.js";

export function createShowcaseSection() {
  return `
<section
  class="
    reveal
    reveal-up

    bg-white

    py-4
    lg:py-6
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
    md:text-3xl
    lg:text-3xl

    italic

    tracking-[-0.03em]

    text-ink
  "
>
  Our Showcase
</h2>

    </div>



  <!-- Tabs -->

<div
  id="showcaseTabs"
  class="
    mt-4
    lg:mt-4

    flex

    justify-start
    lg:justify-center

    gap-6
    lg:gap-12

    overflow-x-auto

    whitespace-nowrap

    no-scrollbar

    px-1
    sm:px-4
    lg:px-0
  "
>

  ${SHOWCASE_TABS.map(
    (tab, index) => `
<button

  type="button"

  data-tab="${tab.id}"

  class="
    showcase-tab
    group

    relative

    flex-shrink-0

    pb-3

    font-sans

    text-[12px]
    sm:text-[12px]
    lg:text-[13px]

    font-medium

    tracking-normal
    lg:tracking-[0.18em]

    lg:uppercase

    transition-colors
    duration-300

    ${
      index === 0
        ? "text-ink"
        : "text-[#8A8A8A] hover:text-ink"
    }
  "

>

  ${tab.label}

  <span
    class="
      absolute

      left-0
      bottom-0

      h-[2px]

      rounded-full

      bg-primary

      transition-all
      duration-500

      ${
        index === 0
          ? "w-full opacity-100"
          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
      }
    "
  ></span>

</button>
`
  ).join("")}

</div>


    <!-- Divider -->

    <div
      class="
        mt-6

        h-px

        bg-[#EFE8DD]
      "
    ></div>

    <!-- Products -->

    <div class="relative mt-12">

      <div
        class="
          overflow-visible
        "
      >

        <div

          id="showcaseProducts"

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

    </div>

  </div>

</section>
`;
}
