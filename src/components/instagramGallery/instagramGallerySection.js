export function createInstagramGallerySection() {
  return `
<section
  class="
    relative

    overflow-hidden

    bg-white

    py-8
    lg:py-14
  "
>

  <div
    class="
      mx-auto

      max-w-7xl

      px-5
      lg:px-8
    "
  >

    <!-- Heading -->

    <div class="text-center">

      <p
        class="
          font-serif

          text-2xl
          md:text-[48px]

          italic

          text-[#181818]
        "
      >
        Shop Our Instagram
      </p>

      <a
        id="instagramFollowLink"

        href="#"
        target="_blank"
        rel="noopener noreferrer"

        class="
          mt-3

          inline-block

          text-sm
          md:text-base

          tracking-wide

          text-[#A07936]

          transition-colors
          duration-300

          hover:text-[#181818]
        "
      >
        @banshiwale &middot; Follow for daily styling
      </a>

    </div>

    <!-- Grid -->

    <div
      id="instagramGalleryGrid"

      class="
        mt-10

        grid

        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4

        gap-2
        md:gap-3
      "
    >

      <!-- Tiles injected here -->

    </div>

  </div>

</section>
`;
}
