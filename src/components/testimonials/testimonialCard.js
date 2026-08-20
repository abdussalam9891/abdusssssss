import { PRODUCTS } from "../../constants/products.js";
import { getProductImages } from "../../utils/getProductImages.js";

function createStars(rating) {
  return Array.from({ length: rating })
    .map(
      () => `
<svg
  class="h-4 w-4 md:h-5 md:w-5 fill-[#181818]"
  viewBox="0 0 20 20"
>
  <path d="M9.049.927c.3-.921 1.603-.921 1.902 0l1.24 3.818a1 1 0 0 0 .95.69h4.014c.969 0 1.371 1.24.588 1.81l-3.247 2.36a1 1 0 0 0-.364 1.118l1.24 3.817c.3.922-.755 1.688-1.54 1.118l-3.247-2.359a1 1 0 0 0-1.176 0L6.162 15.66c-.784.57-1.838-.196-1.539-1.118l1.24-3.817a1 1 0 0 0-.364-1.118L2.252 7.245c-.783-.57-.38-1.81.588-1.81h4.014a1 1 0 0 0 .951-.69L9.05.927Z"/>
</svg>
`
    )
    .join("");
}

export function createTestimonialCard(testimonial) {
  const product = PRODUCTS.find(
    (item) => item.id === testimonial.productId
  );

  if (!product) return "";

  const images = getProductImages(product);

  return `

<div
  class="
    flex-none

    basis-full
    md:basis-1/2
    lg:basis-1/3

    px-5
  "
>

<a
  href="../../pages/productDetails.html?id=${product.id}"

  class="
    group

    flex
    h-full
    flex-col

    rounded-[20px]
    md:rounded-[28px]

    border
    border-[#F2ECE4]

    bg-[#FCFBF9]

    px-5
    py-6
    md:px-7
    md:py-8

    text-center

    transition-all
    duration-500

    hover:scale-[1.02]

    hover:bg-white

    hover:border-[#C9A45C]

    hover:shadow-[0_22px_55px_rgba(0,0,0,.08)]
  "
>

  <!-- Rating -->

  <div
    class="
      flex
      items-center
      justify-center

      gap-1
    "
  >

    ${createStars(testimonial.rating)}

  </div>

  <!-- Name -->

  <h3
    class="
      mt-4
      md:mt-6

      font-serif

      text-[22px]
      md:text-[30px]

      text-[#181818]
    "
  >
    ${testimonial.name}
  </h3>

  <!-- Review -->

  <p
    class="
      mt-3
      md:mt-5

      flex-1

      text-[15px]
      md:text-[18px]

      leading-7
      md:leading-9

      text-[#3F3F3F]
    "
  >
    ${testimonial.review}
  </p>

  <!-- Product -->

  <div
    class="
      mt-auto

      pt-5
      md:pt-8

      border-t
      border-[#ECE5D9]
    "
  >

    <div
      class="
        flex

        items-center

        gap-3
        md:gap-5
      "
    >

      <img

        src="${images.front}"

        alt="${product.name}"

        loading="lazy"

        class="
          h-14
          w-14
          md:h-20
          md:w-20

          flex-shrink-0

          object-cover

          transition-transform
          duration-500

          group-hover:scale-110
        "
      >

      <div
        class="
          flex-1

          text-left
        "
      >

        <h4
          class="
            text-[15px]
            md:text-[18px]

            font-medium

            leading-snug

            text-[#181818]
          "
        >
          ${product.name}
        </h4>

        <span
          class="
            mt-1
            md:mt-2

            inline-flex

            items-center

            gap-2

            text-[11px]
            md:text-[12px]

            font-medium

            uppercase

            tracking-[0.18em]

            text-[#A07936]
          "
        >

          View Product

          <svg
            xmlns="http://www.w3.org/2000/svg"

            fill="none"

            viewBox="0 0 24 24"

            stroke="currentColor"

            class="
              h-3.5
              w-3.5

              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          >

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"

              d="M9 5l7 7-7 7"
            />

          </svg>

        </span>

      </div>

    </div>

  </div>

</a>

</div>

`;
}
