export function createMarqueeSection(items = []) {

  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  // Duplicate items for seamless infinite scrolling
  const marqueeItems = [...items, ...items];

  return `
    <section
      class="
        relative
        overflow-hidden
        bg-[#FAF8F5]
        py-2
        lg:py-7
      "
    >

      <!-- Left Fade -->

      <div
        class="
          pointer-events-none
          absolute
          left-0
          top-0
          z-10
          h-full
          w-16
          bg-gradient-to-r
          from-white
          to-transparent
          lg:w-28
        "
      ></div>


      <!-- Right Fade -->

      <div
        class="
          pointer-events-none
          absolute
          right-0
          top-0
          z-10
          h-full
          w-16
          bg-gradient-to-l
          from-white
          to-transparent
          lg:w-28
        "
      ></div>


      <div class="marquee">

        <div class="marquee-track">

          ${marqueeItems
            .map(
              (item) => `
                <div
                  class="
                    marquee-item
                    flex
                    items-center
                    gap-8
                    whitespace-nowrap
                    px-8
                    sm:px-10
                    lg:px-14
                    text-sm
                    lg:text-[15px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#181818]
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-[#A07936]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z"
                    />
                  </svg>

                  <span>
                    ${item.text}
                  </span>

                </div>
              `
            )
            .join("")}

        </div>

      </div>

    </section>
  `;
}
