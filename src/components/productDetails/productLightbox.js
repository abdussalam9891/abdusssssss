import { escapeHtml } from "../../features/productDetails/model.js";

export function createProductLightbox(product) {

  // Normalized product: `gallery` is an ordered list of urls.
  const images =
    product.gallery || [];

  const firstImage =
    images[0] || "";

  return `

<div
  id="productLightbox"

  class="
    fixed
    inset-0

    z-[120]

    hidden

    items-center
    justify-center

    bg-black/90
    backdrop-blur-md

    p-6
  "
>

  <button
    id="closeLightbox"
    type="button"

    class="
      absolute
      right-6
      top-6

      flex

      h-12
      w-12

      items-center
      justify-center

      rounded-full

      bg-white/10

      text-white

      transition-all
      duration-300

      hover:bg-white/20
    "
  >
    <i
      data-lucide="x"
      class="h-6 w-6"
    ></i>
  </button>


  <button
    id="lightboxPrev"
    type="button"

    class="
      absolute
      left-5

      hidden
      lg:flex

      h-12
      w-12

      items-center
      justify-center

      rounded-full

      bg-white/10

      text-white

      transition

      hover:bg-white/20
    "
  >
    <i
      data-lucide="chevron-left"
      class="h-6 w-6"
    ></i>
  </button>


  <button
    id="lightboxNext"
    type="button"

    class="
      absolute
      right-5

      hidden
      lg:flex

      h-12
      w-12

      items-center
      justify-center

      rounded-full

      bg-white/10

      text-white

      transition

      hover:bg-white/20
    "
  >
    <i
      data-lucide="chevron-right"
      class="h-6 w-6"
    ></i>
  </button>


  <img
    id="lightboxImage"

    src="${escapeHtml(firstImage)}"

    alt="${escapeHtml(product.name || "Product image")}"

    class="
      max-h-[88vh]
      max-w-[92vw]

      object-contain
    "
  >

</div>

  `;

}
