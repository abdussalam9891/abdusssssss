export function createCollectionCard(collection) {
  return `
    <a
      href="${collection.url}"
      class="
        group
        block

        w-[calc(50%-0.5rem)]

        sm:w-[240px]

        lg:w-[280px]
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
      h-[170px]
      sm:h-[210px]
      lg:h-[250px]

      w-full

      overflow-hidden
    "
  >

    <img
      src="${collection.image}"
      alt="${collection.title}"

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
          pt-4
          lg:pt-5

          text-center
        "
      >

        <h3
          class="
            font-serif
            italic

            text-lg
            sm:text-xl
            lg:text-xl

            leading-tight

            text-[#181818]

            transition-colors
            duration-300

            group-hover:text-[#A07936]
          "
        >
          ${collection.title}
        </h3>

      </div>

    </a>
  `;
}
