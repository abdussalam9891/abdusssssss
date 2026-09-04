import { escapeHtml, formatPrice, getProductDetailsHref } from "../../utils/format.js";

import {
  getPrimaryImage,
  PLACEHOLDER_IMAGE,
} from "../../utils/productImages.js";


/*
 * Dedicated card for the wishlist grid — visually inspired by
 * GIVA's wishlist card (image, rating, price, name, then a
 * remove + "Move to Cart" row) but rendered in this site's own
 * palette/typography rather than copying GIVA's colors. Only used
 * on the wishlist page, unlike components/showcase/showcaseCard.js.
 */


function getProductPrice(product) {

  const finalPrice = Number(product.finalPrice);

  if (
    Number.isFinite(finalPrice) &&
    finalPrice > 0
  ) {
    return Math.round(finalPrice);
  }

  return Math.round(Number(product.price) || 0);
}


export function createWishlistCard(product) {

  if (!product?._id) return "";

  const productId = product._id;

  const image =
    getPrimaryImage(product);

  const price =
    getProductPrice(product);

  const name =
    product.name || "Untitled Product";

  const rating =
    Number(product.averageRating) || 0;

  const reviewCount =
    Number(product.totalReviews) || 0;

  const detailsHref =
    getProductDetailsHref(productId, product.slug);


  return `

<div
  data-wishlist-card
  data-product-id="${escapeHtml(productId)}"

  class="group"
>

  <!-- Image -->

  <a
    href="${detailsHref}"

    class="
      block

      overflow-hidden

      rounded-2xl

      border
      border-[#ECE5D8]

      bg-[#FCFBF9]

      aspect-square
    "
  >
    <img
      src="${escapeHtml(image)}"

      alt="${escapeHtml(name)}"

      loading="lazy"

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="
        h-full
        w-full

        object-cover

        transition-transform
        duration-500

        group-hover:scale-105
      "
    >
  </a>


  <!-- Info -->

  <div
    class="
      mt-4

      px-0.5
    "
  >

    ${
      reviewCount > 0
        ? `
    <div
      class="
        flex

        items-center

        gap-1.5

        text-[12px]

        text-[#8A8A8A]
      "
    >
      <span
        class="
          inline-flex

          items-center

          gap-1

          font-medium

          text-[#181818]
        "
      >
        ${rating.toFixed(1)}

        <i
          data-lucide="star"

          class="
            h-3
            w-3

            fill-[#C89B3C]

            text-[#C89B3C]
          "
        ></i>
      </span>

      <span>|</span>

      <span>${reviewCount}</span>
    </div>
    `
        : ""
    }

    <p
      class="
        ${reviewCount > 0 ? "mt-2" : ""}

        text-[18px]
        sm:text-[20px]

        font-semibold

        text-[#181818]
      "
    >
      ${formatPrice(price)}
    </p>

    <a
      href="${detailsHref}"

      class="
        mt-1

        block

        truncate

        font-serif
        italic

        text-[15px]
        sm:text-[17px]

        text-[#181818]

        transition-colors
        duration-300

        hover:text-[#A07936]
      "
    >
      ${escapeHtml(name)}
    </a>


    <!-- Actions -->

    <div
      class="
        mt-4

        flex

        items-center

        gap-2
        sm:gap-3
      "
    >

      <button
        type="button"

        aria-label="Remove ${escapeHtml(name)} from wishlist"

        data-product-id="${escapeHtml(productId)}"

        class="
          wishlist-remove-button

          flex

          h-10
          w-10

          sm:h-12
          sm:w-12

          shrink-0

          items-center
          justify-center

          rounded-full

          border
          border-[#ECE5D8]

          bg-white

          text-[#181818]

          transition-colors
          duration-300

          hover:border-[#B3261E]

          hover:text-[#B3261E]
        "
      >
        <i
          data-lucide="trash-2"

          class="
            h-4
            w-4

            sm:h-[18px]
            sm:w-[18px]
          "
        ></i>
      </button>

      <button
        type="button"

        data-product-id="${escapeHtml(productId)}"

        class="
          wishlist-move-to-cart-button

          flex

          h-10
          sm:h-12

          min-w-0
          flex-1

          items-center
          justify-center

          overflow-hidden

          rounded-lg

          bg-[#181818]

          px-2
          sm:px-5

          text-[10px]
          sm:text-[13px]

          font-medium

          uppercase

          tracking-[0.06em]
          sm:tracking-[0.14em]

          text-white

          transition-colors
          duration-300

          hover:bg-[#A07936]
        "
      >
        <span class="truncate">Move to Cart</span>
      </button>

    </div>

  </div>

</div>

`;
}
