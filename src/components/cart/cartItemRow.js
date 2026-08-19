import {
  escapeHtml,
  formatPrice,
} from "../../utils/format.js";


// Self-contained inline placeholder — mirrors
// features/productDetails/model.js's PLACEHOLDER_IMAGE so a
// broken product thumbnail never falls back to another broken
// image path.
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
 * Receives one item from features/cart/cartState.js:
 *   { id, name, slug, sku, image, price, finalPrice, size, quantity }
 */

export function createCartItemRow(item) {

  const lineTotal =
    formatPrice(
      (Number(item.finalPrice ?? item.price) || 0) *
        item.quantity
    );

  const unitPrice =
    formatPrice(item.finalPrice ?? item.price);


  return `

<div
  data-cart-item

  data-id="${escapeHtml(item.id)}"
  data-size="${escapeHtml(item.size || "")}"

  class="
    flex

    gap-3
    sm:gap-5

    border-b
    border-[#ECE5D8]

    pb-5
    sm:pb-6
  "
>

  <a
    href="${
      item.slug
        ? `/pages/product-details.html?id=${encodeURIComponent(item.id)}`
        : "#"
    }"

    class="
      h-20
      w-20

      sm:h-24
      sm:w-24

      shrink-0

      overflow-hidden

      rounded-2xl

      border
      border-[#ECE5D8]

      bg-[#FCFBF9]
    "
  >
    <img
      src="${escapeHtml(item.image || PLACEHOLDER_IMAGE)}"

      alt="${escapeHtml(item.name || "Product")}"

      loading="lazy"

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="
        h-full
        w-full

        object-cover
      "
    >
  </a>


  <div
    class="
      flex

      min-w-0

      flex-1

      flex-col

      justify-between
    "
  >

    <div>

      <a
        href="${
          item.slug
            ? `/pages/product-details.html?id=${encodeURIComponent(item.id)}`
            : "#"
        }"

        class="
          line-clamp-2

          font-serif

          text-[15px]
          sm:text-[19px]

          italic

          text-[#181818]

          hover:text-[#A07936]
        "
      >
        ${escapeHtml(item.name || "Product")}
      </a>

      <p
        class="
          mt-1

          text-[11px]
          sm:text-[12px]

          text-[#8A8A8A]
        "
      >
        ${
          [
            item.size
              ? `Size: ${escapeHtml(item.size)}`
              : "",

            item.sku
              ? `SKU: ${escapeHtml(item.sku)}`
              : "",
          ]
            .filter(Boolean)
            .join(" · ")
        }
      </p>

      ${
        unitPrice
          ? `
<p
  class="
    mt-2

    text-[14px]

    font-medium

    text-[#A07936]
  "
>
  ${unitPrice} each
</p>
`
          : ""
      }

    </div>


    <div
      class="
        mt-4

        flex

        flex-wrap

        items-center

        justify-between

        gap-4
      "
    >

      <div
        class="
          inline-flex

          items-center

          overflow-hidden

          rounded-xl

          border
          border-[#ECE5D8]
        "
      >

        <button
          type="button"

          class="
            cart-item-decrease

            flex

            h-9
            w-9

            items-center
            justify-center

            text-[#181818]

            transition-colors
            duration-300

            hover:bg-[#FCFBF9]
          "
        >
          −
        </button>

        <span
          class="
            w-10

            text-center

            text-[14px]

            font-medium

            text-[#181818]
          "
        >
          ${item.quantity}
        </span>

        <button
          type="button"

          class="
            cart-item-increase

            flex

            h-9
            w-9

            items-center
            justify-center

            text-[#181818]

            transition-colors
            duration-300

            hover:bg-[#FCFBF9]
          "
        >
          +
        </button>

      </div>


      <div
        class="
          flex

          items-center

          gap-4
        "
      >

        ${
          lineTotal
            ? `
<span
  class="
    text-[15px]

    font-semibold

    text-[#181818]
  "
>
  ${lineTotal}
</span>
`
            : ""
        }

        <button
          type="button"

          aria-label="Remove ${escapeHtml(item.name || "item")} from cart"

          class="
            cart-item-remove

            text-[#B3261E]

            transition-colors
            duration-300

            hover:text-[#7d1a15]
          "
        >
          <i
            data-lucide="trash-2"

            class="
              h-4
              w-4
            "
          ></i>
        </button>

      </div>

    </div>

  </div>

</div>

`;
}
