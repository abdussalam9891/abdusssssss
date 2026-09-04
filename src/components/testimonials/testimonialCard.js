import { PRODUCTS } from "../../constants/products.js";
import { getProductImages } from "../../utils/getProductImages.js";

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

<div
  class="
    group

    flex
    h-full
    flex-col

    rounded-[20px]
    md:rounded-[28px]

    border
    border-[#F2ECE4]

    bg-white

    px-5
    py-6
    md:px-7
    md:py-8

    text-center

    transition-all
    duration-500

    hover:scale-[1.02]

    hover:border-[#C9A45C]

    hover:shadow-[0_22px_55px_rgba(0,0,0,.08)]
  "
>

  <!-- Headline -->

  <h3
    class="
      font-serif

      text-[22px]
      md:text-[30px]

      text-[#181818]
    "
  >
    ${testimonial.headline}
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




        </span>

      </div>

    </div>

  </div>

</div>

</div>

`;
}
