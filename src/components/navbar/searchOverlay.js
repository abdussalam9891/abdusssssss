import { NAVIGATION } from "../../constants/navigation.js";

export function createSearchOverlay() {
  const popularSearches = NAVIGATION.map(
    (item) => `
      <button
        type="button"
        class="
          popular-search-btn

          rounded-full

          border
          border-[#A07936]

          bg-[#A07936]

          px-5
          py-2.5

          text-[13px]
          font-medium

          text-white

          transition-all
          duration-300

          hover:border-[#8a6528]
          hover:bg-[#8a6528]
        "
        data-category="${item.slug}"
        data-href="${item.href}"
      >
        ${item.label}
      </button>
    `
  ).join("");

  return `
<div
  id="searchOverlay"
  class="fixed inset-0 z-[1000] hidden"
>

  <!-- Backdrop -->

  <div
    id="searchBackdrop"
    class="
      absolute
      inset-0

      bg-[#181818]/50
      backdrop-blur-sm

      opacity-0

      transition-opacity
      duration-500
    "
  ></div>

  <!-- Panel -->

  <div
    id="searchModal"
    class="
      absolute
      inset-x-0
      top-0

      max-h-[92vh]
      overflow-y-auto
      no-scrollbar

      -translate-y-full

      bg-white

      rounded-b-[28px]
      sm:rounded-b-[36px]

      shadow-[0_30px_80px_rgba(0,0,0,.25)]

      opacity-0

      transition-all
      duration-500
      ease-out
    "
  >

    <div
      class="
        mx-auto
        max-w-4xl

        px-6
        py-10

        sm:px-10
        sm:py-14
      "
    >

      <!-- Header -->

      <div class="flex items-start justify-between gap-6">

        <div>

          <p
            class="
              text-[11px]
              uppercase
              tracking-[0.3em]
              text-[#A07936]
            "
          >
            Banshiwale
          </p>

          <h2
            class="
              mt-2

              font-serif
              italic

              text-3xl
              sm:text-4xl

              tracking-[-0.02em]

              text-[#181818]
            "
          >
            Find Your Piece
          </h2>

        </div>

        <button
          id="closeSearchBtn"
          type="button"
          aria-label="Close Search"
          class="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-full

            border
            border-[#A07936]
            bg-[#A07936]

            text-white

            transition-all
            duration-300

            hover:rotate-90
            hover:border-[#8a6529]
            hover:bg-[#8a6529]
          "
        >
          <i
            data-lucide="x"
            class="h-5 w-5"
          ></i>
        </button>

      </div>

      <!-- Search Box -->

      <div
        class="
          mt-8
          sm:mt-10

          flex
          items-center
          gap-4

          border-b-2
          border-[#181818]/10

          pb-4

          transition-colors
          duration-300

          focus-within:border-[#A07936]
        "
      >

        <i
          data-lucide="search"
          class="h-6 w-6 shrink-0 text-[#A07936]"
        ></i>

        <input
          id="searchInput"
          type="search"
          placeholder="Search chains, rings, bracelets..."
          autocomplete="off"
          class="
            w-full
            bg-transparent

            font-serif

            text-xl
            sm:text-2xl

            text-[#181818]

            placeholder:text-[#B9B2A6]

            outline-none
          "
        />

      </div>

      <!-- Popular Searches -->

      <div class="mt-8 sm:mt-10">

        <h3
          class="
            mb-4

            flex
            items-center
            gap-2

            text-[11px]
            uppercase
            tracking-[0.25em]
            text-[#9A9184]
          "
        >
          <i
            data-lucide="sparkles"
            class="h-3.5 w-3.5 text-[#A07936]"
          ></i>
          Trending Searches
        </h3>

        <div
          class="
            flex
            flex-wrap
            gap-3
          "
        >
          ${popularSearches}
        </div>

      </div>

      <!-- Search Results -->

      <div
        id="searchResults"
        class="
          mt-10

          border-t
          border-[#F2ECE3]

          pt-8
        "
      >

        <div
          id="searchEmptyState"
          class="
            py-14
            text-center
          "
        >

          <div
            class="
              mx-auto
              mb-5

              flex
              h-16
              w-16

              items-center
              justify-center
            "
          >
            <img
              src="/src/assets/logo-white.png"
              alt="Banshiwale"
              class="h-32 w-32 object-contain"
            />
          </div>

          <h4
            class="
              mb-2

              font-serif

              text-xl

              text-[#181818]
            "
          >
            Start typing to search
          </h4>

          <p class="text-sm text-[#8A8A8A]">
            Search by product name, category or collection.
          </p>

        </div>

      </div>

    </div>

  </div>

</div>
`;
}
