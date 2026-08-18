import { createEnquiryButton } from "./enquiryButton.js";

import {
  escapeHtml,
  formatDiscount,
  formatPrice,
} from "../../features/productDetails/model.js";


/*
 * Receives the normalized product produced by
 * features/productDetails/model.js.
 *
 * Every block below renders only when the backend actually
 * provides the data — nothing is filled in with invented
 * values.
 */


function createStars(rating, totalReviews) {

  const safeRating =
    Number(rating) || 0;


  return `
<div
  class="
    flex
    flex-wrap
    items-center

    gap-3
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


  <span class="text-sm text-[#777]">
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

</div>
`;
}


function createTags(product) {

  const tags = [

    ...product.subCategory,

    ...product.childCategory,

    ...product.gender,

  ];


  if (!tags.length) return "";


  return `
<div
  class="
    flex
    flex-wrap

    gap-2
  "
>

  ${tags
    .map(
      (tag) => `
<span
  class="
    rounded-full

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    px-4
    py-1.5

    text-[12px]

    uppercase

    tracking-[0.14em]

    text-[#6B6B6B]
  "
>
  ${escapeHtml(tag)}
</span>
`
    )
    .join("")}

</div>
`;
}


function createStock(product) {

  // Backend did not send stock information at all.
  if (product.inStock === null) return "";


  const label =
    product.inStock
      ? product.stockStatus ||
        (product.stock <= 5
          ? `Only ${product.stock} left in stock`
          : "In Stock")
      : product.stockStatus ||
        "Out of Stock";


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


function createPricing(product) {

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


  return `
<div>

  <div
    class="
      flex

      flex-wrap

      items-center

      gap-4
    "
  >

    <span
      class="
        text-[38px]

        font-semibold

        text-[#181818]
      "
    >
      ${finalPrice || "Price on request"}
    </span>

    ${
      discount
        ? `
<span
  class="
    rounded-full

    bg-[#181818]

    px-3
    py-1

    text-[11px]

    font-medium

    uppercase

    tracking-[0.18em]

    text-white
  "
>
  ${escapeHtml(discount)}
</span>
`
        : ""
    }

  </div>


  ${
    showBasePrice ||
    product.makingCharges !== null ||
    product.taxRate !== null
      ? `
<p
  class="
    mt-3

    text-[13px]

    leading-6

    text-[#8A8A8A]
  "
>
  ${[
    showBasePrice
      ? `Base price ${basePrice}`
      : "",

    product.makingCharges !== null
      ? `making charges ${product.makingCharges}%`
      : "",

    product.taxRate !== null
      ? `tax ${product.taxRate}%`
      : "",
  ]
    .filter(Boolean)
    .join(" · ")}
</p>
`
      : ""
  }

</div>
`;
}


function createSizes(product) {

  if (!product.availableSizes.length) return "";


  return `
<div>

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-[#A07936]
    "
  >
    Available Sizes
  </p>


  <div
    class="
      mt-4

      flex
      flex-wrap

      gap-3
    "
  >

    ${product.availableSizes
      .map(
        (size) => `
<span
  class="
    rounded-xl

    border
    border-[#ECE5D8]

    px-4
    py-2

    text-[14px]

    text-[#181818]
  "
>
  ${escapeHtml(size.label)}${
    size.stock !== null
      ? ` <span class="text-[#8A8A8A]">(${size.stock})</span>`
      : ""
  }
</span>
`
      )
      .join("")}

  </div>

</div>
`;
}


function createAttributes(product) {

  if (!product.attributes.length) return "";


  return `
<div
  class="
    grid

    gap-4

    sm:grid-cols-2
  "
>

  ${product.attributes
    .map(
      (attribute) => `
<div
  class="
    rounded-2xl

    border
    border-[#F2ECE3]

    px-5
    py-4
  "
>

  <p
    class="
      text-[11px]

      uppercase

      tracking-[0.18em]

      text-[#A07936]
    "
  >
    ${escapeHtml(attribute.name)}
  </p>

  <p
    class="
      mt-1

      text-[15px]

      text-[#181818]
    "
  >
    ${escapeHtml(attribute.value)}
  </p>

</div>
`
    )
    .join("")}

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


export function createProductInfo(product) {

  return `

<div class="space-y-8">

  <!-- Title -->

  <div>

    <h1
      class="
        font-serif

        text-[42px]
        lg:text-[56px]

        italic

        leading-none

        text-[#181818]
      "
    >
      ${escapeHtml(product.name)}
    </h1>


    <div class="mt-5">
      ${createStars(
        product.averageRating,
        product.totalReviews
      )}
    </div>

  </div>


  <!-- Tags -->

  ${createTags(product)}


  <!-- Price -->

  ${createPricing(product)}


  <!-- Stock -->

  ${createStock(product)}


  <!-- Description -->

  ${
    product.description
      ? `
<p
  class="
    max-w-xl

    text-[16px]

    leading-8

    text-[#666]
  "
>
  ${escapeHtml(product.description)}
</p>
`
      : ""
  }


  <!-- Attributes -->

  ${createAttributes(product)}


  <!-- Sizes -->

  ${createSizes(product)}


  <!-- SKU -->

  ${createSku(product)}


  <!-- CTA -->

  ${createEnquiryButton(product)}

</div>

`;
}
