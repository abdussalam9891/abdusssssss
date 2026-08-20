import { escapeHtml, formatPrice } from "../../utils/format.js";


// Self-contained inline placeholder — mirrors
// features/productDetails/model.js's PLACEHOLDER_IMAGE (and
// components/cart/cartItemRow.js's copy of the same) so a broken
// product thumbnail never falls back to another broken image path.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="#FCFBF9"/>` +
    `<path d="M140 250 L190 170 L225 215 L260 160 L305 250 Z" ` +
    `fill="none" stroke="#D8CBB0" stroke-width="10" stroke-linejoin="round"/>` +
    `<circle cx="170" cy="140" r="20" fill="none" stroke="#D8CBB0" stroke-width="10"/>` +
    `</svg>`
  );


/*
 * Dedicated card for the wishlist grid — visually inspired by
 * GIVA's wishlist card (image, rating, price, name, then a
 * remove + "Move to Cart" row) but rendered in this site's own
 * palette/typography rather than copying GIVA's colors. Only used
 * on the wishlist page, unlike components/showcase/showcaseCard.js.
 */


function getProductImage(product) {

  const images = Array.isArray(product.images)
    ? [...product.images]
        .sort(
          (a, b) =>
            (a?.position ?? 0) -
            (b?.position ?? 0)
        )
        .map((image) => image?.url)
        .filter(Boolean)
    : [];

  return (
    images[0] ||
    PLACEHOLDER_IMAGE
  );
}


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
    getProductImage(product);

  const price =
    getProductPrice(product);

  const name =
    product.name || "Untitled Product";

  const rating =
    Number(product.averageRating) || 0;

  const reviewCount =
    Number(product.totalReviews) || 0;

  const detailsHref =
    `/pages/product-details.html?id=${encodeURIComponent(productId)}`;


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
