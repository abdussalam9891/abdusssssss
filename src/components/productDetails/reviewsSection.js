import { escapeHtml } from "../../features/productDetails/model.js";


/*
 * The backend only returns an aggregate `averageRating` /
 * `totalReviews` on the product — there is no review-list
 * endpoint (checked services/productService.js and the sample
 * response). So this renders an honest ratings summary rather
 * than fabricated review cards with invented names, dates or
 * quotes.
 */

function createStars(rating) {

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
    h-5
    w-5

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


export function createReviewsSection(product) {

  const hasReviews =
    product.totalReviews > 0;


  return `

<section
  id="productReviews"

  class="
    border-t
    border-[#ECE5D8]

    bg-[#FCFBF9]

    py-16
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


    ${
      hasReviews
        ? `
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

      text-[56px]

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
`
        : `
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
`
    }

  </div>

</section>

`;
}
