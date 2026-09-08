import { PRODUCTS } from "../../constants/products.js";
import { getProductImages } from "../../utils/getProductImages.js";
import { getProductDetailsHref } from "../../utils/format.js";

export function createInstagramGalleryTile(entry) {
  const product = PRODUCTS.find(
    (item) => item.id === entry.productId
  );

  if (!product) return "";

  const images = getProductImages(product);

  return `

<a
  href="${getProductDetailsHref(product.id, product.slug)}"
  aria-label="Shop ${product.name}"

  class="
    group

    relative
    block

    aspect-square

    overflow-hidden

    bg-[#F7F3EC]
  "
>

  <img
    src="${images.front}"
    alt="${product.name}"
    loading="lazy"

    class="
      h-full
      w-full

      object-cover

      transition-transform
      duration-700

      group-hover:scale-110
    "
  >

  <div
    class="
      absolute
      inset-0

      flex
      items-center
      justify-center

      bg-black/0

      transition-colors
      duration-500

      group-hover:bg-black/40
    "
  >

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"

      class="
        h-7
        w-7

        text-white

        opacity-0
        scale-75

        transition-all
        duration-500

        group-hover:opacity-100
        group-hover:scale-100
      "
    >
      <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5Zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 4 7.75 3.75 3.75 0 0 1 7.75 4Zm8.75 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>
    </svg>

  </div>

</a>

`;
}
