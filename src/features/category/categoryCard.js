export function createCategoryCard(category) {
  return `
    <a
      href="${category.url}"
      class="
        group
        block
        shrink-0
        snap-start

        w-[calc((100vw-4rem)/6)]

        sm:w-[calc((100%-7.5rem)/6)]

        lg:w-[calc((100%-10rem)/6)]
      "
    >
<!-- Image Card -->

<div
  class="
    reveal
    overflow-hidden
    rounded-xl
    lg:rounded-2xl

    border
    border-[#ECE5D8]

    transition-all
    duration-500

    hover:-translate-y-1
    hover:border-[#C8A35A]
    hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
  "
>

  <div
    class="
      aspect-[14/17]
      sm:aspect-[8/7]

      w-full

      overflow-hidden
    "
  >

    <img
      src="${category.image}"
      alt="${category.title}"

      loading="lazy"
      decoding="async"

      class="
        h-full
        w-full

        object-cover
        object-center

        transition-transform
        duration-700
        ease-out

        group-hover:scale-110
      "
    />

  </div>

</div>


      <!-- Category -->

      <div
        class="
          pt-2
          sm:pt-4
          lg:pt-5

          text-center
        "
      >

        <h3
          class="
            font-serif
            italic

            text-[11px]
            sm:text-xl
            lg:text-xl

            leading-tight

            text-[#181818]

            transition-colors
            duration-300

            group-hover:text-[#A07936]
          "
        >
          ${category.title}
        </h3>

      </div>

    </a>
  `;
}
