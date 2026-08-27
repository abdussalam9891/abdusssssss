import {
  escapeHtml,
  PLACEHOLDER_IMAGE,
} from "../../features/productDetails/model.js";


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

  const multiple =
    images.length > 1;


  // ==========================================
  // NO IMAGES — DEGRADED STATE
  // ==========================================

  if (!images.length) {

    return `

<div
  class="
    flex

    aspect-square

    max-w-[340px]
    sm:max-w-[420px]
    lg:max-w-[480px]
    xl:max-w-[540px]

    mx-auto
    lg:mx-0

    items-center
    justify-center

    rounded-2xl
    sm:rounded-[28px]

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
    space-y-3
    sm:space-y-4

    max-w-[340px]
    sm:max-w-[420px]
    lg:max-w-[480px]
    xl:max-w-[540px]

    mx-auto
    lg:mx-0
  "
>

  <!-- Main Image -->

  <div
    class="
      group

      relative

      overflow-hidden

      rounded-2xl
      sm:rounded-[28px]

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

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="
        h-full
        w-full

        cursor-zoom-in

        object-cover

        transition-opacity
        duration-300
      "
    >

    ${
      multiple
        ? `
<!-- Prev / Next -->

<button
  type="button"
  id="productGalleryPrev"
  aria-label="Previous image"

  class="
    absolute
    left-4
    top-1/2

    -translate-y-1/2

    flex

    h-10
    w-10

    items-center
    justify-center

    rounded-full

    border
    border-white/40

    bg-white/85

    text-[#181818]

    opacity-0

    backdrop-blur

    transition-all
    duration-300

    hover:bg-white

    group-hover:opacity-100
  "
>
  <i data-lucide="chevron-left" class="h-5 w-5"></i>
</button>

<button
  type="button"
  id="productGalleryNext"
  aria-label="Next image"

  class="
    absolute
    right-4
    top-1/2

    -translate-y-1/2

    flex

    h-10
    w-10

    items-center
    justify-center

    rounded-full

    border
    border-white/40

    bg-white/85

    text-[#181818]

    opacity-0

    backdrop-blur

    transition-all
    duration-300

    hover:bg-white

    group-hover:opacity-100
  "
>
  <i data-lucide="chevron-right" class="h-5 w-5"></i>
</button>


<!-- Counter -->

<div
  id="productGalleryCounter"

  class="
    absolute
    bottom-4
    right-4

    rounded-full

    bg-black/60

    px-3
    py-1.5

    text-[12px]

    font-medium

    tracking-[0.08em]

    text-white

    backdrop-blur
  "
>
  1 / ${images.length}
</div>
`
        : ""
    }

  </div>


  <!-- Thumbnails -->

  ${
    multiple
      ? `
<div
  id="productThumbnails"

  class="
    flex

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

    group/thumb

    relative

    h-14
    w-14

    sm:h-20
    sm:w-20

    shrink-0

    overflow-hidden

    rounded-xl
    sm:rounded-2xl

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

    onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

    class="
      h-full
      w-full

      object-cover

      transition-transform
      duration-500

      group-hover/thumb:scale-105
    "
  />

</button>

`
    )
    .join("")}

</div>
`
      : ""
  }


  ${
    videos.length
      ? `
<!-- Product Video -->

<div
  class="
    overflow-hidden

    rounded-[28px]

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

`;
}
