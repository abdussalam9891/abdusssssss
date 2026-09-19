import { createWishlistButton } from "./wishlistButton.js";
import { createAddToCartButton } from "./addToCartButton.js";
import { createBuyNowButton } from "./buyNowButton.js";
import { createShareButton } from "./shareButton.js";
import { createBenefitsRow } from "./benefitsRow.js";
import { createQuantitySelector } from "./quantitySelector.js";
import { createDeliveryChecker } from "./deliveryChecker.js";
import { createOffersSection } from "./offersSection.js";
import { createProductTabs } from "./productTabs.js";

import {
  escapeHtml,
  formatDiscount,
  formatPrice,
  getAvailabilityLabel,
  pickDefaultSize,
  pickDefaultVariant,
} from "../../features/productDetails/model.js";


/*
 * Receives the normalized product produced by
 * features/productDetails/model.js.
 *
 * This column holds only purchase-critical information —
 * hierarchy: name -> rating -> price -> discount -> tax info ->
 * SKU/stock -> sizes -> benefits -> quantity -> CTAs. Full
 * description, attributes and shipping detail live in the
 * accordion rendered by productTabs.js below the two-column
 * area, so this column never needs to scroll internally.
 *
 * Every block below renders only when the backend actually
 * provides the data — nothing is filled in with invented
 * values.
 */


function createRatingLink(rating, totalReviews) {

  const safeRating =
    Number(rating) || 0;


  return `
<a
  href="#productReviews"

  class="
    inline-flex
    flex-wrap
    items-center

    gap-3

    transition-opacity
    duration-300

    hover:opacity-70
  "
>

  <div
    class="
      flex
      items-center

      gap-0.5

      text-[#C89B3C]
    "
  >

    ${Array.from({ length: 5 })
      .map(
        (_, index) => `
<svg
  class="
    h-[16px]
    w-[16px]

    ${
      index < Math.round(safeRating)
        ? "fill-current"
        : "fill-none stroke-current"
    }
  "

  viewBox="0 0 24 24"
>
  <path
    stroke-width="1.8"
    d="M12 17.3L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
  />
</svg>
`
      )
      .join("")}

  </div>


  <span
    class="
      text-sm

      text-[#777]

      underline
      decoration-[#E5DED5]
      underline-offset-4
    "
  >
    ${
      totalReviews > 0
        ? `${safeRating.toFixed(1)} · ${totalReviews} ${
            totalReviews === 1
              ? "review"
              : "reviews"
          }`
        : "No reviews yet"
    }
  </span>

</a>
`;
}


function createStock(product) {

  // Backend did not send stock information at all.
  if (product.inStock === null) return "";


  const label =
    getAvailabilityLabel(product);


  return `
<div
  class="
    inline-flex
    items-center

    gap-2

    rounded-full

    px-4
    py-2

    text-[13px]

    font-medium

    ${
      product.inStock
        ? "bg-[#F1F7F1] text-[#2F6B3A]"
        : "bg-[#FBF1F1] text-[#B3261E]"
    }
  "
>

  <span
    class="
      h-2
      w-2

      rounded-full

      ${
        product.inStock
          ? "bg-[#2F6B3A]"
          : "bg-[#B3261E]"
      }
    "
  ></span>

  ${escapeHtml(label)}

</div>
`;
}


function createSku(product) {

  if (!product.sku) return "";


  return `
<p
  class="
    text-[13px]

    text-[#8A8A8A]
  "
>
  SKU:
  <span class="text-[#555]">
    ${escapeHtml(product.sku)}
  </span>
</p>

`;
}


export function createPricing(product) {

  const finalPrice =
    formatPrice(product.finalPrice);

  const basePrice =
    formatPrice(product.price);


  const showBasePrice =
    basePrice &&
    finalPrice &&
    Number(product.price) !==
      Number(product.finalPrice);


  const discount =
    formatDiscount(product);


  const savings =
    showBasePrice
      ? formatPrice(
          Math.abs(
            Number(product.price) -
              Number(product.finalPrice)
          )
        )
      : "";


  return `
<div>

  <div
    class="
      flex

      flex-wrap

      items-center

      gap-3
      sm:gap-4
    "
  >

    <span
      class="
        text-[26px]
        sm:text-[32px]
        lg:text-[38px]

        font-semibold

        text-ink
      "
    >
      ${finalPrice || "Price on request"}
    </span>

    ${
      showBasePrice
        ? `
<span
  class="
    text-[16px]
    sm:text-[20px]

    text-[#B0A99B]

    line-through
  "
>
  ${basePrice}
</span>
`
        : ""
    }

    ${
      discount
        ? `
<span
  class="
    inline-flex
    items-center

    rounded-full

    border
    border-[#E9D9B8]

    bg-[#FBF4E7]

    px-3
    py-1

    text-[11px]

    font-semibold

    uppercase

    tracking-[0.14em]

    text-primary
  "
>
  ${escapeHtml(discount)}
</span>
`
        : ""
    }

  </div>


  ${
    savings
      ? `
<p
  class="
    mt-2

    text-[13px]

    font-medium

    text-[#2F6B3A]
  "
>
  You save ${savings}
</p>
`
      : ""
  }


  ${
    finalPrice
      ? `
<p
  class="
    mt-3

    text-[13px]

    leading-6

    text-[#8A8A8A]
  "
>
  MRP incl. of all taxes
</p>
`
      : ""
  }

</div>
`;
}


function createVariants(product) {

  if (!product.variants.length) return "";


  // Must be the same pick state.js applied to the product on
  // load, or the highlighted chip and the price/gallery below it
  // would describe two different variants.
  const selected =
    pickDefaultVariant(product);


  return `
<div>

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-primary
    "
  >
    Select Option
  </p>


  <div
    id="productVariantOptions"

    class="
      mt-4

      flex
      flex-wrap

      gap-3
    "
  >

    ${product.variants
      .map((variant) => {

        const isDefault =
          variant.id === selected?.id;

        const thumb =
          variant.images[0] || "";

        return `
<button
  type="button"

  data-variant-id="${escapeHtml(variant.id)}"

  aria-label="${escapeHtml(variant.label)}"

  class="
    product-variant-option

    flex

    items-center

    gap-2

    rounded-lg
    sm:rounded-xl

    border

    py-1.5
    pl-1.5
    pr-3.5

    sm:py-2
    sm:pl-2
    sm:pr-4

    text-[13px]
    sm:text-[14px]

    font-medium

    transition-all
    duration-300

    ${
      isDefault
        ? "border-primary"
        : "border-[#ECE5D8]"
    }

    text-ink

    hover:border-primary
    active:scale-95
  "
>
  ${
    thumb
      ? `
<img
  src="${escapeHtml(thumb)}"

  alt=""

  loading="lazy"

  class="
    h-8
    w-8

    sm:h-9
    sm:w-9

    shrink-0

    rounded-md
    sm:rounded-lg

    object-cover
  "
/>
`
      : ""
  }
  ${escapeHtml(variant.label)}
</button>
`;
      })
      .join("")}

  </div>

</div>
`;
}


function createSizes(product) {

  if (!product.availableSizes.length) return "";


  const defaultSize =
    pickDefaultSize(product);


  return `
<div>

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-primary
    "
  >
    Select Size
  </p>


  <div
    id="productSizeOptions"

    class="
      mt-4

      flex
      flex-wrap

      gap-3
    "
  >

    ${product.availableSizes
      .map((size) => {

        const outOfStock =
          size.stock === 0;

        const isDefault =
          !outOfStock &&
          size.label === defaultSize?.label;

        return `
<button
  type="button"

  data-size-label="${escapeHtml(size.label)}"
  data-size-stock="${
    size.stock === null ? "" : size.stock
  }"

  ${outOfStock ? "disabled" : ""}

  class="
    product-size-option

    rounded-lg
    sm:rounded-xl

    border

    px-3.5
    py-1.5

    sm:px-4
    sm:py-2

    text-[13px]
    sm:text-[14px]

    font-medium

    transition-all
    duration-300

    ${
      isDefault
        ? "border-ink bg-ink text-white"
        : "border-[#ECE5D8] text-ink"
    }

    ${
      outOfStock
        ? "cursor-not-allowed opacity-40 line-through"
        : "hover:border-primary active:scale-95"
    }
  "
>
  ${escapeHtml(size.label)}${
    !outOfStock &&
    size.stock !== null &&
    size.stock <= 5
      ? ` <span class="${
          isDefault
            ? "text-white/70"
            : "text-[#8A8A8A]"
        }">(${size.stock} left)</span>`
      : ""
  }
</button>
`;
      })
      .join("")}

  </div>

</div>
`;
}


export function createProductInfo(product) {

  return `

<div class="space-y-5 sm:space-y-7">

  <!-- Title + Rating -->

  <div>

    <h1
      class="
        font-serif

        text-[26px]
        sm:text-[34px]
        lg:text-[48px]

        italic

        leading-[1.1]
        lg:leading-[1.05]

        text-ink
      "
    >
      ${escapeHtml(product.name)}
    </h1>

    <div class="mt-4">
      ${createRatingLink(
        product.averageRating,
        product.totalReviews
      )}
    </div>

  </div>


  <!-- Price -->

  <div id="productPricing">
    ${createPricing(product)}
  </div>


  <!-- Stock + SKU -->

  <div
    class="
      flex
      flex-wrap

      items-center

      gap-4
    "
  >
    ${createStock(product)}
    ${createSku(product)}
  </div>


  <!-- Delivery Check -->

  ${createDeliveryChecker()}


  <!-- Variants -->

  ${createVariants(product)}


  <!-- Sizes -->

  ${createSizes(product)}


  <!-- Benefits -->

  ${createBenefitsRow()}


  <!-- Quantity -->

  ${createQuantitySelector(product)}


  <!-- CTAs -->

  <div class="space-y-2 sm:space-y-3 pt-1 sm:pt-2">

    <div
      class="
        grid

        grid-cols-2

        gap-2
        sm:gap-3
      "
    >
      ${createAddToCartButton(product)}
      ${createBuyNowButton(product)}
    </div>

    <div
      class="
        grid

        grid-cols-2

        gap-2
        sm:gap-3
      "
    >
      ${createWishlistButton(product)}
      ${createShareButton(product)}
    </div>

  </div>


  <!-- Offers -->

  ${createOffersSection()}


  <!-- Description / Specifications / Shipping / etc -->

  ${createProductTabs(product)}

</div>

`;
}
