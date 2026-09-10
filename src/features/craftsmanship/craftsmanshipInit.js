function createCraftsmanshipSection() {
  return `
<section
  class="

    reveal
    reveal-up

    relative

    bg-white

    py-16
    lg:py-24
  "
>

  <div
    class="
      relative

      mx-auto

      w-full
      max-w-[1600px]

      px-5
      sm:px-6
      lg:px-10
      xl:px-14
    "
  >
    <div
      class="
        grid

        items-start

        gap-10
        lg:gap-16

        lg:grid-cols-[1fr_1.15fr]
      "
    >

      <!-- Content -->

      <div class="order-2">

        <!-- Heading -->

        <h2
          class="
            font-serif
            italic
            font-bold

            text-2xl
            md:text-3xl
            lg:text-3xl

            leading-tight

            text-[#181818]
          "
        >
          Sterling Silver,
          <br />
          <span class="text-[#A07936]">Made To Last A Lifetime.</span>
        </h2>

        <!-- Description -->

        <p
          class="
            mt-6

            max-w-xl

            text-base
            lg:text-lg

            leading-8

            text-[#666]
          "
        >
          Every banshiwale piece starts out as
          <span class="font-semibold text-[#A07936]">certified 925 sterling silver</span>
          — cut, shaped and finished entirely by hand under the eye of
          skilled artisans. No shortcuts, no cheap plating that fades in
          a few months. Just jewellery you can wear every single day and
          still love years from now.
        </p>

        <!-- Features -->

        <div
          class="
            mt-10

            max-w-xl
          "
        >

          <div class="py-7 first:pt-0">
            <h3
              class="
                font-serif
                italic
                font-semibold

                text-xl
                lg:text-2xl

                text-[#181818]
              "
            >
              Highest Quality
            </h3>
            <p
              class="
                mt-4

                text-sm
                lg:text-base

                leading-7

                text-[#666]
              "
            >
              We're picky about our materials, and even pickier about
              the finishing. Every piece goes through
              <span class="font-semibold text-[#A07936]">careful, precise hand-finishing</span>
              before it ever reaches you — because "good enough" just
              isn't good enough for us.
            </p>
          </div>

          <div class="py-7">
            <h3
              class="
                font-serif
                italic
                font-semibold

                text-xl
                lg:text-2xl

                text-[#181818]
              "
            >
              Fair Pricing
            </h3>
            <p
              class="
                mt-4

                text-sm
                lg:text-base

                leading-7

                text-[#666]
              "
            >
              Luxury shouldn't feel like a rip-off. We cut out the
              middlemen and work directly with our artisans, so the price
              you pay
              <span class="font-semibold text-[#A07936]">actually reflects the craftsmanship</span>
              — not a marketing budget.
            </p>
          </div>

          <div class="py-7 last:pb-0">
            <h3
              class="
                font-serif
                italic
                font-semibold

                text-xl
                lg:text-2xl

                text-[#181818]
              "
            >
              Crafted To Last
            </h3>
            <p
              class="
                mt-4

                text-sm
                lg:text-base

                leading-7

                text-[#666]
              "
            >
              Trends come and go — good jewellery doesn't. Every piece
              is made for
              <span class="font-semibold text-[#A07936]">everyday wear and special moments alike</span>,
              with settings that actually hold and detailing that ages
              well, so it stays part of your story for years.
            </p>
          </div>

        </div>

        <!-- CTA -->

        <a
          href="/pages/about.html"
          class="
            group

            relative

            mt-10

            inline-flex

            items-center
            justify-center

            overflow-hidden

            rounded-md

            border
            border-[#A07936]

            px-8
            py-4

            text-sm
            font-medium
            uppercase
            tracking-[0.18em]

            text-[#181818]

            transition-[border-radius]
            duration-500
            ease-out

            hover:rounded-tl-none
            hover:rounded-tr-3xl
            hover:rounded-br-none
            hover:rounded-bl-3xl
          "
        >

          <span
            class="
              absolute
              inset-0

              origin-left

              scale-x-0

              bg-[#A07936]

              transition-transform
              duration-500
              ease-out

              group-hover:scale-x-100
            "
          ></span>

          <span
            class="
              relative
              z-10

              flex
              items-center
              gap-3

              transition-colors
              duration-300

              group-hover:text-white
            "
          >
            Discover Our Story

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>

        </a>

      </div>

      <!-- Image -->

      <div
        class="
          order-1

          relative

          lg:sticky
          lg:top-28
        "
      >

        <div
          class="
            group

            relative

            overflow-hidden
            rounded-3xl

            h-[420px]
            sm:h-[520px]
            lg:h-[620px]
          "
        >

          <img
            src="/src/assets/craftmanship.png"
            alt="Artisan hand-finishing a banshiwale ring at the workbench, gold dust catching the light"
            loading="lazy"
            class="
              h-full
              w-full

              object-cover
              object-center

              transition-transform
              duration-700

              group-hover:scale-105
            "
          />

          <!-- Overlay -->

          <div
            class="
              absolute
              inset-0

              bg-gradient-to-t
              from-black/60
              via-black/5
              to-transparent
            "
          ></div>

          <!-- Floating badge -->

          <div
            class="
              absolute

              bottom-5
              left-5
              right-5

              sm:right-auto
              sm:bottom-6
              sm:left-6

              flex

              items-center

              gap-3

              rounded-2xl

              bg-white/95

              backdrop-blur

              px-4
              py-3

              shadow-[0_15px_35px_rgba(0,0,0,0.35)]
            "
          >

            <span
              class="
                flex

                h-9
                w-9

                shrink-0

                items-center
                justify-center

                rounded-full

                bg-[#FBF3E2]

                text-[#A07936]
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 3h12l3 5-9 13L3 8l3-5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 8h18M9 3l3 5 3-5M12 8l-3 13M12 8l3 13"
                />
              </svg>
            </span>

            <div>
              <p class="text-xs font-semibold text-[#181818]">
                Hand-finished in-house
              </p>
              <p class="text-[11px] text-[#6B6B6B]">
                By master silversmiths
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>
`;
}

export function initCraftsmanship() {
  const container = document.getElementById("craftsmanship");

  if (!container) return;

  container.innerHTML = createCraftsmanshipSection();

  window.lucide?.createIcons();
}
