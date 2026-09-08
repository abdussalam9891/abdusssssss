import { renderInstagramGallery } from "./renderInstagramGallery.js";
import { websiteService } from "../../services/websiteService.js";

function createInstagramGallerySection() {
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

export async function initInstagramGallery() {
  const container =
    document.getElementById("instagramGallery-container");

  if (!container) return;

  container.innerHTML =
    createInstagramGallerySection();

  renderInstagramGallery();

  const followLink =
    document.getElementById("instagramFollowLink");

  try {

    const { instagram } =
      await websiteService.getSocialLinks();

    if (followLink && instagram) {
      followLink.href = instagram;
    }

  } catch (error) {

    console.error(
      "[Instagram Gallery] Failed to load social link:",
      error
    );

    // Keep the existing fallback ("#") link already rendered.

  }
}
