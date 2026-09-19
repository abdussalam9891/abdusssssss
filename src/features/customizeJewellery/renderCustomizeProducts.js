
import { getProductImages } from "../../utils/getProductImages.js";


 




// ==========================================================
// PRODUCT CARD
// ==========================================================

export function createCustomizeProductCard(
  product,
  selected = false
) {

  const images =
    getProductImages(product);


  return `

    <button
      type="button"

      class="
        customize-product-card
        group
        relative

        w-[180px]
        sm:w-[200px]

        shrink-0
        snap-start

        overflow-hidden

        rounded-xl

        border

        bg-white

        text-left

        transition-all
        duration-300

        ${
          selected
            ? `
              border-primary
              ring-2
              ring-primary/20
            `
            : `
              border-[#E4DDD4]
              hover:border-[#C8B99F]
            `
        }
      "

      data-product-id="${product._id || product.id}"
    >

      <!-- SELECTED INDICATOR -->

      <span
        class="
          customize-product-selected

          absolute
          right-3
          top-3

          z-20

          flex
          h-6
          w-6

          items-center
          justify-center

          rounded-full

          bg-primary

          text-white

          transition-all
          duration-300

          ${
            selected
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }
        "
      >

        <i
          data-lucide="check"
          class="h-3.5 w-3.5"
        ></i>

      </span>


      <!-- IMAGE -->

      <div
        class="
          relative
          aspect-square

          overflow-hidden

          bg-[#F8F6F2]
        "
      >

        <img
          src="${images.front}"

          alt="${product.name}"

          loading="lazy"

          class="
            h-full
            w-full

            object-contain

            p-5

            transition-transform
            duration-500

            group-hover:scale-105
          "

          onerror="
            this.onerror=null;
            this.src='${images.back || images.front}'
          "
        >

      </div>


      <!-- PRODUCT INFO -->

      <div class="px-4 py-4">

        <p
          class="
            line-clamp-2

            min-h-[40px]

            font-serif

            text-[16px]

            leading-tight

            text-ink
          "
        >
          ${product.name}
        </p>


        <div
          class="
            mt-3

            flex
            items-center

            gap-2
          "
        >

          <span
            class="
              text-sm
              font-semibold
              text-ink
            "
          >
            ₹${Number(product.price).toLocaleString("en-IN")}
          </span>


          ${
            product.originalPrice
              ? `
                <span
                  class="
                    text-xs
                    text-[#999999]
                    line-through
                  "
                >
                  ₹${Number(
                    product.originalPrice
                  ).toLocaleString("en-IN")}
                </span>
              `
              : ""
          }

        </div>

      </div>

    </button>

  `;
}
