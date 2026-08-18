import { escapeHtml } from "../../features/productDetails/model.js";


/*
 * Receives the normalized product produced by
 * features/productDetails/model.js:
 *
 *   gallery -> string[] (image urls, ordered by position)
 *   videos  -> string[] (video urls, may be empty)
 */

export function createProductGallery(product) {

  const images =
    product.gallery || [];

  const videos =
    product.videos || [];

  const name =
    escapeHtml(
      product.name || "Product"
    );


  // ==========================================
  // NO IMAGES — DEGRADED STATE
  // ==========================================

  if (!images.length) {

    return `

<div
  class="
    flex

    aspect-square

    items-center
    justify-center

    rounded-[30px]

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    text-[14px]

    text-[#8A8A8A]
  "
>
  No images available for this product.
</div>

`;
  }


  return `

<div
  class="
    flex

    flex-col-reverse
    lg:flex-row

    gap-5
  "
>

  <!-- Thumbnails -->

  <div
    id="productThumbnails"

    class="
      flex

      lg:flex-col

      gap-3

      overflow-x-auto

      no-scrollbar
    "
  >

    ${images
      .map(
        (image, index) => `

<button
  type="button"

  data-index="${index}"

  aria-label="View image ${index + 1} of ${images.length}"

  class="
    product-thumbnail

    group

    relative

    h-20
    w-20

    shrink-0

    overflow-hidden

    rounded-2xl

    border

    ${
      index === 0
        ? "border-[#A07936]"
        : "border-[#ECE5D8]"
    }

    bg-white

    transition-all
    duration-300

    hover:border-[#A07936]
  "
>

  <img
    src="${escapeHtml(image)}"

    alt="${name}"

    loading="lazy"

    class="
      h-full
      w-full

      object-cover

      transition-transform
      duration-500

      group-hover:scale-105
    "
  />

</button>

`
      )
      .join("")}

  </div>


  <!-- Main Image -->

  <div class="flex-1">

    <div
      class="
        overflow-hidden

        rounded-[30px]

        border
        border-[#ECE5D8]

        bg-white

        aspect-square
      "
    >

      <img
        id="productMainImage"

        src="${escapeHtml(images[0])}"

        alt="${name}"

        loading="eager"

        class="
          h-full
          w-full

          cursor-zoom-in

          object-cover

          transition-all
          duration-500
        "
      >

    </div>


    ${
      videos.length
        ? `
<!-- Product Video -->

<div
  class="
    mt-5

    overflow-hidden

    rounded-[30px]

    border
    border-[#ECE5D8]

    bg-black
  "
>

  <video
    id="productVideo"

    src="${escapeHtml(videos[0])}"

    controls

    playsinline

    preload="metadata"

    class="
      h-full
      w-full

      object-cover
    "
  ></video>

</div>
`
        : ""
    }

  </div>

</div>

`;
}
