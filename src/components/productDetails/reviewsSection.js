import { escapeHtml } from "../../features/productDetails/model.js";


/*
 * The initial aggregate (average/total) comes from the product
 * object itself, so the summary has something to show before the
 * dedicated review endpoints resolve. features/productDetails/
 * reviews.js re-fetches the real list (GET
 * /review/getProductReviews/:id) and a fresher summary (GET
 * /review/starsummary/:id) after mount, and re-renders both
 * #productReviewsSummary and #productReviewsList — including
 * after a new review is submitted.
 */

export function createStars(rating, sizeClass = "h-5 w-5") {

  return `
<div
  class="
    flex
    items-center

    gap-1

    text-[#C89B3C]
  "
>
  ${Array.from({ length: 5 })
    .map(
      (_, index) => `
<svg
  class="
    ${sizeClass}

    ${
      index < Math.round(rating)
        ? "fill-current"
        : "fill-none stroke-current"
    }
  "

  viewBox="0 0 24 24"
>
  <path
    stroke-width="1.6"
    d="M12 17.3L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
  />
</svg>
`
    )
    .join("")}
</div>
`;
}


export function createReviewsSummary(product) {

  const hasReviews =
    product.totalReviews > 0;


  if (!hasReviews) {

    return `
<div class="mt-6">

  ${createStars(0)}

  <p
    class="
      mx-auto

      mt-4

      max-w-md

      text-[15px]

      leading-7

      text-[#777]
    "
  >
    No reviews yet for
    ${escapeHtml(product.name)}.
  </p>

</div>
`;
  }


  return `
<div
  class="
    mt-6

    flex

    flex-col

    items-center

    gap-3
  "
>

  <span
    class="
      font-serif

      text-[40px]
      sm:text-[48px]
      lg:text-[56px]

      leading-none

      italic

      text-[#181818]
    "
  >
    ${product.averageRating.toFixed(1)}
  </span>

  ${createStars(product.averageRating)}

  <p class="text-[14px] text-[#777]">
    Based on ${product.totalReviews} ${
      product.totalReviews === 1
        ? "review"
        : "reviews"
    }
  </p>

</div>
`;
}


export function createReviewsSection(product) {

  return `

<section
  id="productReviews"

  class="
    border-t
    border-[#ECE5D8]

    bg-[#FCFBF9]

    py-12
    sm:py-16
    lg:py-20
  "
>

  <div
    class="
      mx-auto

      max-w-3xl

      px-5

      text-center

      lg:px-8
    "
  >

    <p
      class="
        text-[12px]

        font-semibold

        uppercase

        tracking-[0.28em]

        text-[#A07936]
      "
    >
      Ratings &amp; Reviews
    </p>


    <div id="productReviewsSummary">
      ${createReviewsSummary(product)}
    </div>


    <button
      type="button"
      id="productWriteReviewButton"

      class="
        mt-8

        inline-flex

        items-center

        gap-2

        rounded-full

        border
        border-[#181818]

        px-6
        py-3

        text-[12px]

        font-medium

        uppercase

        tracking-[0.16em]

        text-[#181818]

        transition-colors
        duration-300

        hover:border-[#A07936]
        hover:text-[#A07936]
      "
    >
      Write a Review
    </button>

  </div>


  <div
    class="
      mx-auto

      mt-10
      sm:mt-12

      max-w-5xl

      px-5

      lg:px-8
    "
  >

    <div
      id="productReviewsList"

      class="
        grid

        gap-5

        sm:grid-cols-2

        lg:grid-cols-3
      "
    ></div>

  </div>

</section>

`;
}
